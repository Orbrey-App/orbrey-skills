# Reward Strategy — The Donovan Household

**Date:** 05/05/2026
**Weekly budget:** $25 across kids
**Outcome the family wants:** Kids learn to save toward bigger goals; chore effort visibly rewarded; no impulse-buy spiral.
**Children in scope:** Aria (14) · Maya (11) · Eli (8)

---

## Earning Rules

### Aria (14)
- Base allowance: $5/wk
- Chore credit rate: Light $1 / Med $3 / Heavy $5 (projects to ~$12/wk at full completion)
- Behaviour bonuses: capped $4/wk (school effort, kindness)
- Milestone bonus: $50 if she finishes term reading goal (12 books)

### Maya (11)
- Base allowance: $4/wk
- Chore credit rate: same scale (projects to ~$5/wk)
- Behaviour bonuses: capped $3/wk
- Milestone bonus: $20 if violin practice done 5+ days/wk for 4 weeks running

### Eli (8)
- Base allowance: $3/wk
- Chore credit rate: same scale, light only (projects to ~$4/wk)
- Behaviour bonuses: capped $2/wk
- Milestone bonus: $10 if he reads independently 4 nights running

---

## Redemption Catalogue

### Tier 1 — Instant ($1–$5)
- Screen-time block (15 min) — $2
- Choose tonight's movie — $1
- Pick the dessert — $1
- Stay up 15 min late — $3
- Pick the music in the car — $1

### Tier 2 — Short-term ($5–$25)
- Book of choice — $10–$18
- App purchase (within rated budget) — $5–$15
- Solo dinner out with one parent — $20

### Tier 3 — Medium ($25–$100)
- New shoes / clothing item — $40–$80
- Larger Lego or craft kit — $30–$60
- Day at Taronga Zoo — $50

### Tier 4 — Milestone ($100+)
- New scooter / bike accessory — $120
- Nintendo Switch game — $80–$110
- Music exam fees (Maya) — $90

---

## 12-Week Trajectory

### Aria (start balance $18)

| Week | Lazy ($) | Steady ($) | Eager ($) |
|---:|---:|---:|---:|
| Start | 18 | 18 | 18 |
| +4 | 38 | 78 | 110 |
| +8 | 58 | 138 | 220 |
| +12 | 78 | 198 | 330 (incl. milestone) |

### Maya (start balance $7)

| Week | Lazy ($) | Steady ($) | Eager ($) |
|---:|---:|---:|---:|
| Start | 7 | 7 | 7 |
| +4 | 16 | 39 | 67 |
| +8 | 25 | 71 | 127 |
| +12 | 34 | 103 | 188 (incl. milestone) |

### Eli (start balance $0)

| Week | Lazy ($) | Steady ($) | Eager ($) |
|---:|---:|---:|---:|
| Start | 0 | 0 | 0 |
| +4 | 6 | 24 | 38 (incl. milestone) |
| +8 | 12 | 48 | 70 |
| +12 | 18 | 72 | 105 |

**Total weekly outflow at Steady:** Aria $20 + Maya $11 + Eli $6 = **$37** — over the $25 budget.

**Recommendation:** Either lift the budget to $40, or cap Aria's chore-credit ceiling at $8/wk. The user has flagged $25; suggest revisiting and confirming.

---

## Implementation Steps

1. In Orbrey app → Members → set `weekly_allowance`: Aria $5, Maya $4, Eli $3.
2. Confirm chore rotation is active (it is — see chore-rotator output 05/05/2026).
3. Apply behaviour bonuses Sunday evenings via `rewards.adjust`. Reason format: "Behaviour: {{specific praise}}".
4. Create a list named "Rewards catalogue" (`lists.create`) and add the four tiers as items.
5. Schedule `/family-digest` for Sunday evenings — week-over-week balance change visible there.

---

## Open Questions

- [ ] Confirm $25 weekly budget — Steady scenario forecasts $37/wk total. Lift to $40 or cap chore credits?
- [ ] Aria's milestone of $50 for term reading goal — confirm with school reading list before promising.
- [ ] Should Eli's ceiling rise on his next birthday (turning 9 mid-year)?

---

## Decision Log

| Decision | Options | Chosen | Why |
|---|---|---|---|
| Earning model | Pure allowance / pure chore / hybrid | Hybrid | Family wants effort tied to earn but not 100% — kids still get base for being part of household |
| Milestone scale for Eli | $20 / $50 / $10 | $10 | 8yo benefits from short-cycle reinforcement |
| Behaviour bonus cap | Open / $1/wk / $2–$4/wk | Tiered $2–$4 by age | Prevents over-bribery while leaving room for genuine recognition |
| Tier 4 access | All kids / 12+ only | 12+ only initially | Aria saves; Maya & Eli build savings habits in tier 2–3 first |
