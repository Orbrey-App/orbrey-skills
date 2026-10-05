# Iteration log — kitchen-concierge

One row per eval run. Append-only.

| Date | Pass-rate | Regressions | Wins | New | Mode | Notes |
|---|---:|---:|---:|---:|---|---|
| 2026-07-19 | 18/18 | 0 | — | 18 | script | First recorded run. 0.3.0 rebuild. |

---

## 2026-07-19 — 0.3.0 rebuild, first recorded run

The 0.2.0 suite was never executed; this file had no rows. These are the first
results this skill has ever had.

**Script tier: 18/18 passed.**

```
node evals/run-script-cases.mjs
```

| Group | Cases | Result |
|---|---|---|
| Spend ceiling | 3 | pass |
| Allergens | 5 | pass |
| Substitution policy | 2 | pass |
| Checkout gate | 8 | pass |

Cases that would have caught the 0.2.0 defects, and now do:

- `gate-2-total-over-ceiling` — 0.2.0 had no spend cap at all; `max_price_aud`
  was parsed and never read.
- `allergen-1-alias-match` — catches "Almond Meal" against a `tree nuts`
  restriction. 0.2.0 had no allergen data anywhere to match against.
- `allergen-3-fail-closed-missing-profile` — 0.2.0 read dietary prefs from a
  config key that setup never wrote, and proceeded regardless.
- `hook-5-verified-asks-never-allows` — 0.2.0's checkout hook returned `exit 0`
  unconditionally and no-oped entirely when `jq` was absent, which is the
  default on Windows.
- `hook-8-unparseable-input-fails-closed` — 0.2.0's hooks failed open by design.

### Not yet exercised

**Tier 2 agent cases have not been run.** Activation, dispatch, unattended
deferral, preflight and the two injection cases need a harness that drives the
skill. The injection cases in particular are the ones worth running before
trusting this around a live account.

**The LIVE cases have not been run.** Nothing in this suite has touched a real
retailer. The gates around the ordering flow are tested; the flow through them
is not. `live-1-small-order-end-to-end` is the case that would prove the Chrome
path works at all, and it needs `claude --chrome`, a real account, and a
deliberately low spend ceiling.

Do not read "18/18" as "the skill works". Read it as "the safety layer is real
this time, and here is the command that demonstrates it".
