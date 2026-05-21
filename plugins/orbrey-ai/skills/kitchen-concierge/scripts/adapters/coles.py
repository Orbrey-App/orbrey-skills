"""Coles adapter — drives www.coles.com.au via Playwright.

Postcode appears in the URL path. Substitution preferences from the user's
account settings are respected (not overridden). FlyBuys card auto-applies
if linked.
"""

from __future__ import annotations

import re
from typing import Literal

from shared.cart import (
    AddToCartOutcome,
    CartItem,
    CartSummary,
    OrderConfirmation,
    SearchResult,
)
from shared.credentials import load as load_credentials
from shared.retry import retry

from .base import GroceryAdapter

BASE_URL = "https://www.coles.com.au"


class ColesAdapter(GroceryAdapter):
    name = "coles"
    supports_click_and_collect = True
    supports_delivery = True
    requires_browser = True

    SEL_LOGIN_LINK = "a:has-text('Sign in')"
    SEL_LOGIN_EMAIL = "input[name='loginfmt']"
    SEL_LOGIN_PASS = "input[name='passwd']"
    SEL_LOGIN_SUBMIT = "button:has-text('Next'), button:has-text('Sign in')"
    SEL_TFA_BANNER = "text=Verify your identity"
    SEL_SEARCH_BOX = "input[placeholder*='Search']"
    SEL_PRODUCT_TILE = "[data-testid='product-tile']"
    SEL_PRODUCT_TITLE = "[data-testid='product-title']"
    SEL_PRODUCT_PRICE = "[data-testid='product-pricing']"
    SEL_PRODUCT_ADD = "button:has-text('Add to cart')"
    SEL_CART_LINK = "a:has-text('Trolley')"
    SEL_CART_TOTAL = "[data-testid='trolley-total']"
    SEL_CART_SUBTOTAL = "[data-testid='trolley-subtotal']"
    SEL_CHECKOUT = "button:has-text('Checkout')"
    SEL_PLACE_ORDER = "button:has-text('Place order')"
    SEL_ORDER_REF = "[data-testid='order-number']"
    SEL_SLOT_OPTION = "[data-testid='slot-option']:not([disabled])"

    def __init__(self, **kwargs) -> None:  # type: ignore[no-untyped-def]
        super().__init__(**kwargs)
        self._page = None

    def _ensure_browser(self) -> None:
        if self._browser is not None:
            return
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(headless=self.headless)
        context = self._browser.new_context(locale="en-AU", timezone_id="Australia/Sydney")
        self._page = context.new_page()

    def login(self) -> None:
        creds = load_credentials(self.name)
        self._ensure_browser()
        page = self._page
        assert page is not None

        page.goto(f"{BASE_URL}/find-stores/results?q={self.store_postcode}")
        if self.store_id:
            page.click(f"[data-testid='set-store-{self.store_id}']", timeout=5000)
        page.click(self.SEL_LOGIN_LINK)
        page.wait_for_selector(self.SEL_LOGIN_EMAIL)
        page.fill(self.SEL_LOGIN_EMAIL, creds.user)
        page.click(self.SEL_LOGIN_SUBMIT)
        page.fill(self.SEL_LOGIN_PASS, creds.password)
        page.click(self.SEL_LOGIN_SUBMIT)
        page.wait_for_load_state("networkidle")

        if page.locator(self.SEL_TFA_BANNER).is_visible():
            self.take_screenshot_on_error("tfa")
            raise self.TfaChallenge(
                "Coles TFA challenge — complete in your browser, then re-run with --resume"
            )

        self._logger.info("Logged in at postcode %s", self.store_postcode)

    def search_item(self, item: CartItem) -> list[SearchResult]:
        page = self._page
        assert page is not None
        query = item.name if not item.notes else f"{item.name} {item.notes}"

        def _do_search() -> list[SearchResult]:
            page.fill(self.SEL_SEARCH_BOX, query)
            page.keyboard.press("Enter")
            page.wait_for_selector(self.SEL_PRODUCT_TILE, timeout=10000)
            tiles = page.locator(self.SEL_PRODUCT_TILE).all()[:5]
            results: list[SearchResult] = []
            for tile in tiles:
                title = tile.locator(self.SEL_PRODUCT_TITLE).inner_text().strip()
                price_raw = tile.locator(self.SEL_PRODUCT_PRICE).inner_text().strip()
                m = re.search(r"\$\s*([\d.]+)", price_raw)
                price = float(m.group(1)) if m else 0.0
                in_stock = not tile.locator("text=Unavailable").is_visible()
                results.append(
                    SearchResult(
                        adapter_sku=tile.get_attribute("data-product-code") or title,
                        display_name=title,
                        unit_price_aud=price,
                        package_size="",
                        in_stock=in_stock,
                    )
                )
            return results

        return retry(_do_search, attempts=3, label=f"search '{item.name}'")

    def add_to_cart(self, result: SearchResult, qty: int) -> AddToCartOutcome:
        page = self._page
        assert page is not None
        try:
            tile = page.locator(f"{self.SEL_PRODUCT_TILE}[data-product-code='{result.adapter_sku}']").first
            if not result.in_stock:
                return AddToCartOutcome(ok=False, substitution_reason="out of stock")
            for _ in range(qty):
                tile.locator(self.SEL_PRODUCT_ADD).click()
                page.wait_for_timeout(150)
            return AddToCartOutcome(ok=True)
        except Exception as exc:  # noqa: BLE001
            shot = self.take_screenshot_on_error(f"add-{result.adapter_sku}")
            return AddToCartOutcome(ok=False, substitution_reason=str(exc), screenshot_path=shot)

    def get_cart_summary(self) -> CartSummary:
        page = self._page
        assert page is not None
        page.click(self.SEL_CART_LINK)
        page.wait_for_load_state("networkidle")
        subtotal = self._parse_money(page.locator(self.SEL_CART_SUBTOTAL).inner_text())
        total = self._parse_money(page.locator(self.SEL_CART_TOTAL).inner_text())
        return CartSummary(
            items=[],
            subtotal_aud=subtotal,
            delivery_fee_aud=max(total - subtotal, 0.0),
            total_aud=total,
            est_ready_at=None,
        )

    def checkout(
        self,
        mode: Literal["click-and-collect", "delivery"],
        confirm: bool,
    ) -> OrderConfirmation:
        if not confirm:
            raise self.CheckoutError("checkout called without confirm=True")
        page = self._page
        assert page is not None
        try:
            page.click(self.SEL_CHECKOUT)
            page.wait_for_load_state("networkidle")

            page.click(f"text={'Click & Collect' if mode == 'click-and-collect' else 'Delivery'}")
            page.wait_for_selector(self.SEL_SLOT_OPTION)
            page.click(f"{self.SEL_SLOT_OPTION} >> nth=0")
            page.click("button:has-text('Continue')")
            page.wait_for_load_state("networkidle")

            page.click(self.SEL_PLACE_ORDER)
            page.wait_for_selector(self.SEL_ORDER_REF, timeout=30000)
            ref = page.locator(self.SEL_ORDER_REF).inner_text().strip()
            total = self._parse_money(page.locator("[data-testid='order-total']").inner_text())
            ready = page.locator("[data-testid='collection-window']").inner_text().strip()
            return OrderConfirmation(
                reference_number=ref,
                total_aud=total,
                ready_at=ready,
                store_id=self.store_id or self.store_postcode,
                mode=mode,
            )
        except Exception as exc:
            shot = self.take_screenshot_on_error("checkout")
            raise self.CheckoutError(f"checkout failed: {exc} (screenshot: {shot})") from exc

    @staticmethod
    def _parse_money(text: str) -> float:
        m = re.search(r"\$\s*([\d,]+\.\d{2})", text)
        return float(m.group(1).replace(",", "")) if m else 0.0

    def teardown(self) -> None:
        super().teardown()
        if hasattr(self, "_pw"):
            try:
                self._pw.stop()
            except Exception:  # noqa: BLE001
                pass
