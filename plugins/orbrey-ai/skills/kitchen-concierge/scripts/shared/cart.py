"""Shared dataclasses for cart input, search results, and order confirmation."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Literal


@dataclass(frozen=True)
class CartItem:
    name: str
    quantity: float
    unit: str
    notes: str | None = None
    max_price_aud: float | None = None
    substitution: Literal["allow", "ask", "deny"] = "allow"
    recipe_source: str | None = None

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "CartItem":
        return cls(
            name=d["name"],
            quantity=float(d["quantity"]),
            unit=d["unit"],
            notes=d.get("notes"),
            max_price_aud=d.get("max_price_aud"),
            substitution=d.get("substitution", "allow"),
            recipe_source=d.get("recipe_source"),
        )


@dataclass(frozen=True)
class SearchResult:
    adapter_sku: str
    display_name: str
    unit_price_aud: float
    package_size: str
    in_stock: bool


@dataclass(frozen=True)
class AddToCartOutcome:
    ok: bool
    substituted: bool = False
    substitution_reason: str | None = None
    screenshot_path: str | None = None


@dataclass(frozen=True)
class CartSummary:
    items: list[dict[str, Any]] = field(default_factory=list)
    subtotal_aud: float = 0.0
    delivery_fee_aud: float = 0.0
    total_aud: float = 0.0
    est_ready_at: str | None = None


@dataclass(frozen=True)
class OrderConfirmation:
    reference_number: str
    total_aud: float
    ready_at: str
    store_id: str
    mode: Literal["click-and-collect", "delivery"]
