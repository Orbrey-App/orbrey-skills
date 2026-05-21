"""Abstract base class every grocery adapter inherits from."""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from shared.cart import (
    AddToCartOutcome,
    CartItem,
    CartSummary,
    OrderConfirmation,
    SearchResult,
)
from shared.credentials import CredentialError as _CredentialError


class GroceryAdapter(ABC):
    """Adapter contract — implement these five methods + class attributes per store."""

    name: str = "abstract"
    supports_click_and_collect: bool = False
    supports_delivery: bool = False
    requires_browser: bool = True

    # Exception types — re-exported here so callers don't need to import shared.credentials directly.
    CredentialError = _CredentialError

    class TfaChallenge(RuntimeError):
        """Raised when login hits a TFA / captcha challenge that needs human action."""

    class CheckoutError(RuntimeError):
        """Raised when checkout fails for any reason other than credentials/availability."""

    def __init__(
        self,
        *,
        headless: bool = True,
        screenshot_dir: Path = Path(".kitchen-concierge/screenshots"),
        store_id: str | None = None,
        store_postcode: str = "",
    ) -> None:
        self.headless = headless
        self.screenshot_dir = screenshot_dir
        self.store_id = store_id
        self.store_postcode = store_postcode
        self._logger = logging.getLogger(self.name)
        self._browser = None  # set in subclasses when they spin up Playwright

    # --- abstract surface ---

    @abstractmethod
    def login(self) -> None:
        """Log in to the grocer using credentials from env vars. Raise CredentialError or TfaChallenge."""

    @abstractmethod
    def search_item(self, item: CartItem) -> list[SearchResult]:
        """Search the store for a cart item. Return zero or more matching SKUs, ranked by relevance."""

    @abstractmethod
    def add_to_cart(self, result: SearchResult, qty: int) -> AddToCartOutcome:
        """Add the chosen SKU to the cart. May substitute or skip if out of stock."""

    @abstractmethod
    def get_cart_summary(self) -> CartSummary:
        """Return a snapshot of the current cart — items, subtotal, fee, total, ready window."""

    @abstractmethod
    def checkout(
        self,
        mode: Literal["click-and-collect", "delivery"],
        confirm: bool,
    ) -> OrderConfirmation:
        """Place the order. `confirm=False` is a safety guard — set it True explicitly to commit."""

    # --- shared helpers ---

    def take_screenshot_on_error(self, label: str) -> str:
        """Save a Playwright screenshot to the configured dir and return its path."""
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        path = self.screenshot_dir / f"{self.name}-{label}-{ts}.png"
        try:
            if self._browser is not None:
                self._browser.contexts[0].pages[0].screenshot(path=str(path), full_page=True)
                self._logger.warning("Screenshot saved: %s", path)
                return str(path)
        except Exception as exc:  # noqa: BLE001
            self._logger.warning("Could not capture screenshot: %s", exc)
        return ""

    def teardown(self) -> None:
        """Close the browser. Subclasses may override."""
        if self._browser is not None:
            try:
                self._browser.close()
            except Exception:  # noqa: BLE001
                pass
            self._browser = None
