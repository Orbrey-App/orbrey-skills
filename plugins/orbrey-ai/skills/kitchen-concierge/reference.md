# Kitchen Concierge — Reference

Lookup material the SKILL.md doesn't carry inline.

---

## 1. Adapter Contract

Every grocery adapter implements the abstract base in `scripts/adapters/base.py`:

```python
class GroceryAdapter(ABC):
    name: str                              # "woolworths", "coles", "uber_eats"
    supports_click_and_collect: bool
    supports_delivery: bool
    requires_browser: bool                 # True for all v1 adapters (Playwright)

    @abstractmethod
    def login(self) -> None: ...

    @abstractmethod
    def search_item(self, item: CartItem) -> list[SearchResult]: ...

    @abstractmethod
    def add_to_cart(self, result: SearchResult, qty: int) -> AddToCartOutcome: ...

    @abstractmethod
    def get_cart_summary(self) -> CartSummary: ...

    @abstractmethod
    def checkout(self, mode: Literal["click-and-collect", "delivery"], confirm: bool) -> OrderConfirmation: ...

    def teardown(self) -> None:           # default impl: close the browser
        ...
```

Supporting dataclasses live in `scripts/shared/cart.py`:
- `CartItem(name, quantity, unit, notes=None, max_price_aud=None)`
- `SearchResult(adapter_sku, display_name, unit_price_aud, package_size, in_stock)`
- `AddToCartOutcome(ok, substituted, substitution_reason, screenshot_path=None)`
- `CartSummary(items[], subtotal_aud, delivery_fee_aud, total_aud, est_ready_at)`
- `OrderConfirmation(reference_number, total_aud, ready_at, store_id, mode)`

The CLI entrypoint never imports an adapter directly — it goes through the registry in `scripts/adapters/__init__.py`.

---

## 2. CLI Usage

```
python scripts/order_groceries.py --list-adapters
python scripts/order_groceries.py <adapter> <cart.json> --mode click-and-collect --dry-run
python scripts/order_groceries.py <adapter> <cart.json> --mode click-and-collect
python scripts/order_groceries.py <adapter> <cart.json> --mode delivery --show-browser
```

Flags:
- `--dry-run` — runs login + search + add-to-cart, returns cart summary, does NOT checkout
- `--show-browser` — Playwright launches headed (default headless)
- `--mode` — `click-and-collect` | `delivery`
- `--resume` — re-attach to an existing browser session after manual TFA
- `--screenshot-dir <path>` — override `.kitchen-concierge/screenshots/` default

Exit codes:
- 0 — success (cart built and/or order placed)
- 10 — credential error (env var missing or login failed)
- 20 — TFA / captcha challenge — manual intervention needed
- 30 — item availability below threshold (>20% missing/substituted)
- 40 — checkout error
- 99 — unknown / unhandled exception (screenshot saved)

---

## 3. Per-Store Quirks

| Store | Quirks |
|---|---|
| Woolworths | Stock is postcode-locked. The cart must be associated with a "fulfilment location" before search. The adapter sets this once during `login()` using `store_id` from the cart payload. Reward Everyday card auto-applied if linked. |
| Coles | Postcode appears in the URL path (`/find-stores/results?q=2000`). Substitutions can be pre-authorised in account settings — the adapter respects the user's preference; does not override. |
| Uber Eats Groceries | No postcode lock; uses delivery address from saved profile. Surge pricing means `total_aud` at checkout may exceed dry-run total — adapter re-confirms if delta > 5%. No click-and-collect; force `--mode delivery`. |
| Aldi (future) | No e-commerce; in-store only as of 2026. Adapter scaffold exists for when this changes. |
| Walmart (future) | US-only. `store_postcode` validation accepts 5-digit US ZIPs alongside 4-digit AU postcodes. |
| Walgreens (future) | US-only, pharmacy-focused. Limited grocery range. |

---

## 4. Cron Cookbook

| Cadence | Cron | Notes |
|---|---|---|
| Weekly, Sunday 18:00 | `0 18 * * 0` | Default for "Weekly". |
| Fortnightly, Sunday 18:00 | `0 18 * * 0` + manual every-second-week filter | Cron has no native fortnightly; the skill checks `(week_of_year % 2 == 0)` in Phase 3.1 and exits early on off-weeks. |
| Monthly, 1st 09:00 | `0 9 1 * *` | First of every month. |
| Fortnightly, Friday 14:00 | `0 14 * * 5` (with week-filter) | Same fortnight trick. |
| Test (every 5 min) | `*/5 * * * *` | Use during initial setup; remove after. |

All cron strings interpreted in the household's time zone (config field `timezone`, default `Australia/Sydney`).

---

## 5. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Exit 10` immediately | Env vars unset | Re-export `ORBREY_<STORE>_USER` and `ORBREY_<STORE>_PASS` in the shell that runs the scheduled task |
| `Exit 20` after login | TFA challenge | Open the screenshot (`.kitchen-concierge/screenshots/<adapter>-<timestamp>.png`), complete the challenge in your real browser to mark the device as trusted; re-run with `--resume` |
| `Exit 30` | >20% items missing | Check the cart JSON for typos; check store stock manually. Lower the threshold via `--substitution-tolerance` if known acceptable |
| Items added with wrong size | Adapter's `search_item` returned multiple SKUs and picked the wrong one | Pre-filter by adding `notes: "500g pack"` in the cart item; the adapter passes it to the search |
| Order placed but no confirmation email | Account email/notification setting | Adapter only triggers the store's confirmation flow; check account settings on the store site |
| Random Playwright failures | Selectors changed | Re-check selector files under `scripts/adapters/<store>.py`. Run `--show-browser` to see the live page |
| Multiple households conflict | Skill uses wrong household_id | Re-run `setup` — config carries household_id; the routine inherits it |

---

## 6. How to Add a New Store

Goal: add an adapter for, say, IGA.

1. Copy `scripts/adapters/_template.py` → `scripts/adapters/iga.py`.
2. Set class attributes:
   ```python
   class IgaAdapter(GroceryAdapter):
       name = "iga"
       supports_click_and_collect = True
       supports_delivery = False
       requires_browser = True
   ```
3. Implement the five abstract methods. Reuse `shared/retry.py` for flaky DOM interactions; use `shared/credentials.load("iga")` to fetch env vars.
4. Register in `scripts/adapters/__init__.py`:
   ```python
   from .iga import IgaAdapter
   REGISTRY["iga"] = IgaAdapter
   ```
5. Add the env-var names to `scripts/README.md` and the SKILL.md adapter list.
6. Smoke-test:
   ```
   python scripts/order_groceries.py iga examples/sample-cart.json --mode click-and-collect --dry-run --show-browser
   ```

Adapters are 100–300 lines each. The base class + shared helpers do the heavy lifting.

---

## 7. Security Notes

- **Credentials**: env vars only. Never `.env` files inside the skill directory. Never config JSON. The CI lint rule scans for accidental `password = "..."` patterns.
- **Payment data**: never typed by the adapter. Saved payment methods on the store account are selected by index/label; if none is saved, the adapter halts with a clear instruction.
- **Screenshots**: may contain logged-in account info. Saved under `.kitchen-concierge/screenshots/` which should be in `.gitignore`. The skill warns once at setup time.
- **TFA**: adapters never bypass. If a challenge fires they screenshot and exit. The user completes the challenge in their real browser; subsequent runs work because the device is trusted.
- **Audit log**: every run writes to `.kitchen-concierge/runs/`. Append-only. Includes the adapter exit code and screenshot paths.

---

## 8. Future Hooks

Already-flagged items the skill explicitly does NOT do in v1 — track here for later:

- Email/SMS notification channels (waiting on Orbrey MCP tools)
- Per-meal nutrition target tracking
- Recipe sourcing from external sites (currently relies on the household library)
- Coupon/promo-code application during checkout
- Comparison shopping across adapters in the same run (would need price-normalisation logic)
- Subscription / recurring-cart support (e.g. weekly milk delivery)
