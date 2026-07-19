# Example — `run` and `approve`

> **Illustrative, not a captured transcript.** Names, stores, products and
> figures are invented to show the shape of the flow, including the failure
> paths. Nothing here is a record of a real run.

This shows the two-part shape that matters most in 0.3.0: a **scheduled run
defers** (nobody is present to approve a purchase), and a later **interactive
`approve` builds the cart and checks out**.

---

## Part 1 — the scheduled run (Sunday 18:00, nobody at the keyboard)

**Claude:**

> **Kitchen Concierge — weekly run, Donovan household**
>
> *3.0* Scheduled run detected. No interactive session — I'll prepare everything
> and stop before ordering.
>
> *3.1* Household confirmed. **Dietary profile: 4/4 members, last confirmed
> 05/05/2026.**
>
> | Member | Restriction | Tier |
> |---|---|---|
> | Eli | tree nuts *(almond, cashew, walnut, pistachio…)* | **life_threatening** |
> | Sophie | high-FODMAP (onion, garlic) | medical_avoid |
> | Household | no pork | ethical_religious |
>
> *3.2* Planning 7 days via `meal-planner`, passing the contract above… 7 dinners
> planned. Two candidate recipes dropped — a satay and a pesto — both carry tree
> nuts. Replaced, not flagged as caveats.
>
> *3.3* Pantry list read (37 items). 14 ingredients already on hand.
>
> *3.4* 23 items added to the grocery list, deduped and aisle-ordered.
>
> *3.5* Brief sent to Sam.
>
> ---
>
> **Nothing has been ordered and nothing has been charged.**
>
> This run was scheduled, so it stops here — placing an order needs you present
> to approve the spend. Estimated basket **$164 AUD** at Woolworths Bondi
> (your ceiling is $250).
>
> Run `/orbrey-ai:kitchen-concierge approve` when you're next at the keyboard.
>
> Logged: `deferred-awaiting-approval`

---

## Part 2 — `approve` (Monday morning, `claude --chrome`)

**User:** `/orbrey-ai:kitchen-concierge approve`

**Claude:**

> *0.5* Chrome tools available. ✓
>
> Resuming the run deferred 24/05/2026 18:00 — 23 items, estimated $164.
>
> Rebuilding the cart in the browser now. Prices and stock have moved since
> last night, so I'm re-pricing rather than trusting the stored figures.
>
> *(navigates to Woolworths in your logged-in Chrome, sets fulfilment to Bondi,
> adds items)*
>
> Two things to flag:
>
> - **Sourdough loaf** — out of stock. Your policy is "Ask me first", so I've
>   left it out rather than swapping.
> - **Free-range eggs 12pk** — $8.50, above the $7.00 cap you set on eggs.
>
> Review-page total: **$171.40** including a $5.00 delivery fee.
>
> *(runs `verify_cart.mjs --cart … --total 171.40`)*
>
> ```
> --- CART VERIFIED ---
> Items:        22
> Total:        $171.40 AUD (ceiling $250.00)
> Allergens:    checked against 3 restriction(s) across 4 member(s)
> Cart hash:    5650dd2afd4b134f
> ```

**R3** — "1 item exceeds your per-item price cap." · `Over cap`
→ `Skip it` · `Buy anyway` · `Show me` · `Cancel the order`

**User:** Buy anyway

**R2** — "22 items, $171.40 incl. delivery. 1 unavailable. Order?" · `Order`
→ `Order now` · `Edit the list` · `Try Coles instead` · `Skip this run`

**User:** Order now

**Claude:** *(clicks through checkout — the PreToolUse gate fires)*

> ```
> About to place a REAL grocery order.
>
>   Total:  $171.40 AUD (your ceiling: $250.00)
>   Items:  22
>   Store:  Woolworths Bondi
>   Mode:   click-and-collect
>
> Cart verified 1 min ago against 4 household dietary profile(s).
> Approving this charges your saved payment method.
> ```
>
> *(user approves the permission prompt)*
>
> ### Run complete — 2026-05-25T09:14:22+10:00
>
> - Outcome: **Placed**
> - Dietary profile: 4/4 members resolved
> - Cart verified: Yes — hash `5650dd2afd4b134f`, total $171.40
> - Order reference: `WW-4471902`
> - Collection: 25/05 16:00–17:00, Woolworths Bondi
> - Log: `${CLAUDE_PLUGIN_DATA}/runs/2026-05-25T09-14-22Z.md`
>
> Next scheduled run: Sunday 31/05/2026 18:00.

---

## What a blocked run looks like

If the dietary profile had been missing, Part 1 would have stopped at 3.1:

> *3.1* **Aborting this run.**
>
> I can't read `household-dietary-profiles.json`, and I won't plan or buy food
> for this household without it. Eli's tree-nut allergy is recorded as
> life-threatening, so proceeding on a guess isn't something I'll do — even
> though the plan itself would probably have been fine.
>
> Run `/orbrey-ai:household-onboarder` to restore it, then `run` again.
>
> Logged: partial run, `precondition-failed`.

And if the basket had come to $268 against a $250 ceiling, `verify_cart.mjs`
would exit 40 and the run would stop there — the gate would not have offered a
checkout prompt at all. Splitting the order to slip under the ceiling is
explicitly not a workaround.
