#!/usr/bin/env python3
"""CLI entrypoint for placing grocery orders through a pluggable adapter."""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Any

from adapters import LOAD_ERRORS, REGISTRY
from shared.cart import CartItem, OrderConfirmation

EXIT_OK = 0
EXIT_CREDENTIAL = 10
EXIT_TFA = 20
EXIT_AVAILABILITY = 30
EXIT_CHECKOUT = 40
EXIT_UNKNOWN = 99


def _setup_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="[%(name)s] %(message)s",
    )


def _load_cart(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise FileNotFoundError(f"cart file not found: {path}")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _print_cart_summary(label: str, summary: Any) -> None:
    print(f"\n--- {label} ---")
    print(f"Items:        {len(summary.items)}")
    print(f"Subtotal:     ${summary.subtotal_aud:.2f} AUD")
    print(f"Delivery fee: ${summary.delivery_fee_aud:.2f} AUD")
    print(f"Total:        ${summary.total_aud:.2f} AUD")
    if summary.est_ready_at:
        print(f"Earliest:     {summary.est_ready_at}")


def _list_adapters() -> int:
    print("Available adapters:\n")
    if not REGISTRY:
        print("  (none loaded)\n")
    for name, cls in REGISTRY.items():
        flags = []
        if cls.supports_click_and_collect:
            flags.append("click-and-collect")
        if cls.supports_delivery:
            flags.append("delivery")
        print(f"  {name:<12} {', '.join(flags)}")
    if LOAD_ERRORS:
        print("\nUnavailable adapters (missing dependency or load error):\n")
        for name, msg in LOAD_ERRORS.items():
            print(f"  {name:<12} {msg}")
    print()
    return EXIT_OK


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="order_groceries",
        description="Place a grocery order via a pluggable adapter.",
    )
    parser.add_argument(
        "--list-adapters",
        action="store_true",
        help="List registered adapters and exit.",
    )
    parser.add_argument("adapter", nargs="?", help="Adapter name (woolworths|coles|uber_eats|...)")
    parser.add_argument("cart", nargs="?", type=Path, help="Path to cart.json")
    parser.add_argument(
        "--mode",
        choices=["click-and-collect", "delivery"],
        default="click-and-collect",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build the cart, return a summary, do NOT checkout.",
    )
    parser.add_argument(
        "--show-browser",
        action="store_true",
        help="Launch browser headed (default headless).",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Reattach to an existing browser session after manual TFA.",
    )
    parser.add_argument(
        "--screenshot-dir",
        type=Path,
        default=Path(".kitchen-concierge/screenshots"),
    )
    parser.add_argument(
        "--substitution-tolerance",
        type=float,
        default=None,
        help="Override the cart's substitution_tolerance (0.0–1.0).",
    )
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    _setup_logging(args.verbose)

    if args.list_adapters:
        return _list_adapters()

    if not args.adapter or not args.cart:
        parser.error("adapter and cart are required unless --list-adapters")
        return EXIT_UNKNOWN

    if args.adapter not in REGISTRY:
        if args.adapter in LOAD_ERRORS:
            print(
                f"ERROR: adapter '{args.adapter}' failed to load: {LOAD_ERRORS[args.adapter]}",
                file=sys.stderr,
            )
        else:
            print(
                f"ERROR: unknown adapter '{args.adapter}'. Use --list-adapters.",
                file=sys.stderr,
            )
        return EXIT_UNKNOWN

    try:
        cart_data = _load_cart(args.cart)
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return EXIT_UNKNOWN

    items = [CartItem.from_dict(d) for d in cart_data["items"]]
    tolerance = args.substitution_tolerance
    if tolerance is None:
        tolerance = cart_data.get("substitution_tolerance", 0.2)

    args.screenshot_dir.mkdir(parents=True, exist_ok=True)

    adapter_cls = REGISTRY[args.adapter]
    adapter = adapter_cls(
        headless=not args.show_browser,
        screenshot_dir=args.screenshot_dir,
        store_id=cart_data.get("store_id"),
        store_postcode=cart_data["store_postcode"],
    )

    try:
        adapter.login()
    except adapter.CredentialError as exc:
        print(f"ERROR (credential): {exc}", file=sys.stderr)
        return EXIT_CREDENTIAL
    except adapter.TfaChallenge as exc:
        print(f"TFA CHALLENGE: {exc}", file=sys.stderr)
        return EXIT_TFA

    try:
        substituted = 0
        missing = 0
        for item in items:
            results = adapter.search_item(item)
            if not results:
                missing += 1
                logging.warning("No results for %s", item.name)
                continue
            outcome = adapter.add_to_cart(results[0], int(item.quantity))
            if not outcome.ok:
                missing += 1
                continue
            if outcome.substituted:
                substituted += 1
                logging.info("Substituted %s -> %s", item.name, outcome.substitution_reason)

        unavailable_rate = (substituted + missing) / max(len(items), 1)
        if unavailable_rate > tolerance:
            print(
                f"ERROR (availability): {unavailable_rate:.0%} of cart unavailable (tolerance {tolerance:.0%})",
                file=sys.stderr,
            )
            return EXIT_AVAILABILITY

        summary = adapter.get_cart_summary()
        _print_cart_summary("DRY-RUN summary" if args.dry_run else "Cart summary", summary)
        print(f"Substitutions: {substituted} · Missing: {missing}")

        if args.dry_run:
            return EXIT_OK

        confirmation: OrderConfirmation = adapter.checkout(mode=args.mode, confirm=True)
        print("\n--- ORDER PLACED ---")
        print(f"Reference: {confirmation.reference_number}")
        print(f"Total:     ${confirmation.total_aud:.2f} AUD")
        print(f"Ready at:  {confirmation.ready_at}")
        print(f"Store:     {confirmation.store_id}")
        print(f"Mode:      {confirmation.mode}")
        return EXIT_OK
    except adapter.CheckoutError as exc:
        print(f"ERROR (checkout): {exc}", file=sys.stderr)
        return EXIT_CHECKOUT
    except Exception as exc:  # noqa: BLE001
        screenshot = adapter.take_screenshot_on_error("unknown")
        print(f"ERROR (unknown): {exc}", file=sys.stderr)
        print(f"Screenshot:    {screenshot}", file=sys.stderr)
        logging.exception("Unhandled adapter error")
        return EXIT_UNKNOWN
    finally:
        try:
            adapter.teardown()
        except Exception:  # noqa: BLE001
            pass


if __name__ == "__main__":
    sys.exit(main())
