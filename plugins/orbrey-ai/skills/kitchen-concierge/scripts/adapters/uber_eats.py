"""Uber Eats Groceries adapter — drives www.ubereats.com via Playwright.

No click-and-collect — forces `--mode delivery`. Surge pricing means the
checkout total can exceed the dry-run total; the adapter re-confirms if the
delta exceeds 5%. Heavy bot detection — if the headless run hits a captcha,
the user must rerun with --show-browser and complete it manually.
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

BASE_URL = "https://www.ubereats.com"


class UberEatsAdapter(GroceryAdapter):
    name = "uber_eats"
    supports_click_and_collect = False
    supports_delivery = True
    requires_browser = True

    SURGE_THRESHOLD = 0.05  # re-confirm if total drifts >5% from dry-run

    SEL_LOGIN_LINK = "a:has-text('Log in')"
    SEL_LOGIN_EMAIL = "input[name='email']"
    SEL_LOGIN_NEXT = "button:has-text('Next')"
    SEL_LOGIN_PASS = "input[name='password']"
    SEL_LOGIN_SUBMIT = "button:has-text('Log in')"
    SEL_CAPTCHA = "iframe[src*='captcha'], text=Confirm you're human"
    SEL_SEARCH_BOX = "input[placeholder*='Search']"
    SEL_PRODUCT_TILE = "[data-testid='item-card'], [data-test='item-tile']"
    SEL_PRODUCT_TITLE = "[data-testid='item-title']"
    SEL_PRODUCT_PRICE = "[data-testid='item-price']"
    SEL_PRODUCT_ADD = "button:has-text('Add to cart'), button:has-text('Add')"
    SEL_CART_BUTTON = "button[aria-label*='cart']"
    SEL_CART_TOTAL = "[data-testid='cart-total']"
    SEL_CHECKOUT = "button:has-text('Go to checkout')"
    SEL_PLACE_ORDER = "button:has-text('Place order')"
    SEL_ORDER_REF = "[data-testid='order-id']"

    def __init__(self, **kwargs) -> None:  # type: ignore[no-untyped-def]
        super().__init__(**kwargs)
        self._page = None
        self._dry_run_total: float | None = None

    def _ensure_browser(self) -> None:
        if self._browser is not None:
            return
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        # Uber Eats fingerprints heavily — use a realistic UA + locale.
        self._browser = self._pw.chromium.launch(
            headless=self.headless,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = self._browser.new_context(
            locale="en-AU",
            timezone_id="Australia/Sydney",
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        self._page = context.new_page()

    def login(self) -> None:
        creds = load_credentials(self.name)
        self._ensure_browser()
        page = self._page
        assert page is not None

        page.goto(f"{BASE_URL}/au")
        page.click(self.SEL_LOGIN_LINK)
        page.wait_for_selector(self.SEL_LOGIN_EMAIL)
        page.fill(self.SEL_LOGIN_EMAIL, creds.user)
        page.click(self.SEL_LOGIN_NEXT)
        page.wait_for_selector(self.SEL_LOGIN_PASS, timeout=15000)
        page.fill(self.SEL_LOGIN_PASS, creds.password)
        page.click(self.SEL_LOGIN_SUBMIT)
        page.wait_for_load_state("networkidle")

        if page.locator(self.SEL_CAPTCHA).is_visible():
            self.take_screenshot_on_error("captcha")
            raise self.TfaChallenge(
                "Uber Eats captcha — rerun with --show-browser and complete it manually"
            )

        self._logger.info("Logged in as %s", creds.user)

    def search_item(self, item: CartItem) -> list[SearchResult]:
        page = self._page
        assert page is not None
        query = item.name if not item.notes else f"{item.name} {item.notes}"

        def _do_search() -> list[SearchResult]:
            page.goto(f"{BASE_URL}/au/groceries?q={query}")
            page.wait_for_selector(self.SEL_PRODUCT_TILE, timeout=10000)
            tiles = page.locator(self.SEL_PRODUCT_TILE).all()[:5]
            results: list[SearchResult] = []
            for tile in tiles:
                title = tile.locator(self.SEL_PRODUCT_TITLE).inner_text().strip()
                price_raw = tile.locator(self.SEL_PRODUCT_PRICE).inner_text().strip()
                m = re.search(r"\$\s*([\d.]+)", price_raw)
                price = float(m.group(1)) if m else 0.0
                results.append(
                    SearchResult(
                        adapter_sku=tile.get_attribute("data-item-id") or title,
                        display_name=title,
                        unit_price_aud=price,
                        package_size="",
                        in_stock=True,
                    )
                )
            return results

        return retry(_do_search, attempts=3, label=f"search '{item.name}'")

    def add_to_cart(self, result: SearchResult, qty: int) -> AddToCartOutcome:
        page = self._page
        assert page is not None
        try:
            tile = page.locator(f"{self.SEL_PRODUCT_TILE}[data-item-id='{result.adapter_sku}']").first
            tile.click()
            page.wait_for_selector(self.SEL_PRODUCT_ADD)
            qty_input = page.locator("input[type='number']")
            if qty_input.is_visible():
                qty_input.fill(str(qty))
            page.click(self.SEL_PRODUCT_ADD)
            page.keyboard.press("Escape")  # close modal
            return AddToCartOutcome(ok=True)
        except Exception as exc:  # noqa: BLE001
            shot = self.take_screenshot_on_error(f"add-{result.adapter_sku}")
            return AddToCartOutcome(ok=False, substitution_reason=str(exc), screenshot_path=shot)

    def get_cart_summary(self) -> CartSummary:
        page = self._page
        assert page is not None
        page.click(self.SEL_CART_BUTTON)
        page.wait_for_selector(self.SEL_CART_TOTAL)
        total = self._parse_money(page.locator(self.SEL_CART_TOTAL).inner_text())
        # Uber Eats merges everything into a single total; approximate.
        summary = CartSummary(
            items=[],
            subtotal_aud=total * 0.85,
            delivery_fee_aud=total * 0.15,
            total_aud=total,
            est_ready_at=None,
        )
        self._dry_run_total = total
        return summary

    def checkout(
        self,
        mode: Literal["click-and-collect", "delivery"],
        confirm: bool,
    ) -> OrderConfirmation:
        if not confirm:
            raise self.CheckoutError("checkout called without confirm=True")
        if mode == "click-and-collect":
            raise self.CheckoutError("Uber Eats does not support click-and-collect")

        page = self._page
        assert page is not None
        try:
            page.click(self.SEL_CHECKOUT)
            page.wait_for_load_state("networkidle")

            final_total = self._parse_money(page.locator(self.SEL_CART_TOTAL).inner_text())
            if self._dry_run_total and final_total > self._dry_run_total * (1 + self.SURGE_THRESHOLD):
                self.take_screenshot_on_error("surge-pricing")
                raise self.CheckoutError(
                    f"surge pricing — total ${final_total:.2f} exceeds dry-run ${self._dry_run_total:.2f} by >{int(self.SURGE_THRESHOLD * 100)}%; re-run to re-confirm"
                )

            page.click(self.SEL_PLACE_ORDER)
            page.wait_for_selector(self.SEL_ORDER_REF, timeout=30000)
            ref = page.locator(self.SEL_ORDER_REF).inner_text().strip()
            ready = page.locator("[data-testid='eta']").inner_text().strip()
            return OrderConfirmation(
                reference_number=ref,
                total_aud=final_total,
                ready_at=ready,
                store_id="uber-eats-delivery",
                mode=mode,
            )
        except self.CheckoutError:
            raise
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
