"""Adapter scaffold — copy this file to add a new store (e.g. iga.py, aldi.py, walmart.py).

After copying:
  1. Rename the class.
  2. Set class attributes (name, supports_*, requires_browser).
  3. Implement the five abstract methods using your store's site.
  4. Register the class in `adapters/__init__.py` REGISTRY.
  5. Add env-var names (ORBREY_<NAME>_USER / _PASS) to scripts/README.md and SKILL.md.

Keep the file around 100–300 lines. Reuse `shared/retry.py` for flaky DOM
operations and `shared/credentials.load("<name>")` for the env-var lookup.
"""

from __future__ import annotations

from typing import Literal

from shared.cart import (
    AddToCartOutcome,
    CartItem,
    CartSummary,
    OrderConfirmation,
    SearchResult,
)
from shared.credentials import load as load_credentials

from .base import GroceryAdapter


class TemplateAdapter(GroceryAdapter):
    """Replace this class name when you copy this file."""

    name = "template"  # used in CLI: python order_groceries.py template cart.json
    supports_click_and_collect = True
    supports_delivery = True
    requires_browser = True

    # Selectors — edit these as the store's DOM changes.
    SEL_LOGIN_EMAIL = "input[name='email']"
    SEL_LOGIN_PASS = "input[name='password']"
    SEL_LOGIN_SUBMIT = "button[type='submit']"
    SEL_SEARCH_BOX = "input[type='search']"
    SEL_SEARCH_RESULT = ".product-card"
    SEL_ADD_BUTTON = "button.add-to-cart"
    SEL_CART_TOTAL = ".cart-total"
    SEL_CHECKOUT_BUTTON = "button.checkout"

    def login(self) -> None:
        # creds = load_credentials(self.name)
        # self._browser = playwright.chromium.launch(headless=self.headless)
        # page = self._browser.new_page()
        # page.goto("https://store.example.com/login")
        # page.fill(self.SEL_LOGIN_EMAIL, creds.user)
        # page.fill(self.SEL_LOGIN_PASS, creds.password)
        # page.click(self.SEL_LOGIN_SUBMIT)
        # if page.locator("text=Two-factor").is_visible():
        #     self.take_screenshot_on_error("tfa")
        #     raise self.TfaChallenge("TFA prompt — complete in your browser, then re-run with --resume")
        raise NotImplementedError("TemplateAdapter.login")

    def search_item(self, item: CartItem) -> list[SearchResult]:
        raise NotImplementedError("TemplateAdapter.search_item")

    def add_to_cart(self, result: SearchResult, qty: int) -> AddToCartOutcome:
        raise NotImplementedError("TemplateAdapter.add_to_cart")

    def get_cart_summary(self) -> CartSummary:
        raise NotImplementedError("TemplateAdapter.get_cart_summary")

    def checkout(
        self,
        mode: Literal["click-and-collect", "delivery"],
        confirm: bool,
    ) -> OrderConfirmation:
        if not confirm:
            raise self.CheckoutError("checkout called without confirm=True — refusing to place order")
        raise NotImplementedError("TemplateAdapter.checkout")
