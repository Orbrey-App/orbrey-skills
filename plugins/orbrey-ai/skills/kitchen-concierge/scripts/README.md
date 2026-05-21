# Kitchen Concierge — Order Scripts

CLI + pluggable adapters used by the `kitchen-concierge` skill to place grocery orders.

## Install

```
python -m venv .venv
.venv\Scripts\Activate.ps1     # Windows
# source .venv/bin/activate    # macOS/Linux
pip install -r scripts/requirements.txt
playwright install chromium
```

## Credentials

Adapters read credentials from environment variables. Never commit them to a file.

| Adapter | User var | Password var |
|---|---|---|
| Woolworths | `ORBREY_WOOLWORTHS_USER` | `ORBREY_WOOLWORTHS_PASS` |
| Coles | `ORBREY_COLES_USER` | `ORBREY_COLES_PASS` |
| Uber Eats | `ORBREY_UBER_EATS_USER` | `ORBREY_UBER_EATS_PASS` |

Example (PowerShell):

```powershell
$env:ORBREY_WOOLWORTHS_USER = "you@example.com"
$env:ORBREY_WOOLWORTHS_PASS = "<your password>"
```

Each store must have a saved payment method on the user's account — the adapter selects it by label and never enters card details.

## Usage

```
python scripts/order_groceries.py --list-adapters
python scripts/order_groceries.py woolworths cart.json --mode click-and-collect --dry-run
python scripts/order_groceries.py woolworths cart.json --mode click-and-collect
python scripts/order_groceries.py uber_eats cart.json --mode delivery --show-browser
```

The cart file must match `templates/cart-schema.json` (one directory up).

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success — cart built and/or order placed |
| 10 | Credential error (env var missing or login failed) |
| 20 | TFA / captcha challenge — manual intervention required |
| 30 | Cart unavailability above tolerance threshold |
| 40 | Checkout error |
| 99 | Unknown / unhandled exception (screenshot saved) |

## Adding a new adapter

1. Copy `adapters/_template.py` to `adapters/<store>.py`.
2. Implement the five abstract methods using your store's site (Playwright selectors, login flow, search, add-to-cart, cart summary, checkout).
3. Register in `adapters/__init__.py` REGISTRY.
4. Add env var pair above and to the skill's `SKILL.md`.
5. Smoke test: `python scripts/order_groceries.py <store> examples/sample-cart.json --dry-run --show-browser`.

See the skill's `reference.md` §6 for the full walkthrough.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ModuleNotFoundError: No module named 'playwright'` | Run `pip install -r requirements.txt` |
| `Executable doesn't exist` (Playwright) | Run `playwright install chromium` |
| `Exit 10` | Re-check env var names; they're case-sensitive |
| `Exit 20` | Open the screenshot saved at `.kitchen-concierge/screenshots/`, complete the challenge in your real browser, rerun with `--resume` |
| Random selector failures | Run with `--show-browser` to watch the live page; selectors may have changed |

## Layout

```
scripts/
├── order_groceries.py
├── requirements.txt
├── README.md
├── adapters/
│   ├── __init__.py
│   ├── base.py
│   ├── _template.py
│   ├── woolworths.py
│   ├── coles.py
│   └── uber_eats.py
└── shared/
    ├── __init__.py
    ├── cart.py
    ├── credentials.py
    └── retry.py
```
