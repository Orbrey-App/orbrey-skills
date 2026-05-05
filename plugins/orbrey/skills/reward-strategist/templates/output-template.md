# Reward Strategy — {{Household Name}}

**Date:** {{DD/MM/YYYY}}
**Weekly budget:** ${{N}}
**Outcome the family wants:** {{summary}}
**Children in scope:** {{names + ages}}

---

## Earning Rules

### {{Member 1}} ({{age}})
- Base allowance: ${{n}}/wk
- Chore credit rate: per `chore-rotator` (Light $1 / Med $3 / Heavy $5)
- Behaviour bonuses: capped at ${{n}}/wk
- Milestone bonus: ${{n}} on {{achievement}}

{{Repeat per member}}

---

## Redemption Catalogue

### Tier 1 — Instant ($1–$5)
- Screen-time block (15 min)
- Choose tonight's movie
- Pick the music in the car
- Dessert pick

### Tier 2 — Short-term ($5–$25)
- Small toy / book / sticker pack
- App purchase (within rated app budget)
- Solo meal out with one parent

### Tier 3 — Medium ($25–$100)
- New clothing item of choice
- Large toy / Lego set
- Day out (zoo, aquarium, theme park)

### Tier 4 — Milestone ($100+)
- Bike, scooter, console game
- Music instrument
- Major experience (concert, sport tickets)

---

## 12-Week Trajectory

### {{Member 1}}

| Week | Lazy ($) | Steady ($) | Eager ($) |
|---:|---:|---:|---:|
| Start | {{bal}} | {{bal}} | {{bal}} |
| +4 | {{n}} | {{n}} | {{n}} |
| +8 | {{n}} | {{n}} | {{n}} |
| +12 | {{n}} | {{n}} | {{n}} |

{{Repeat per member}}

---

## Implementation Steps

1. In the Orbrey app, set `weekly_allowance` for {{member}} to ${{n}}.
2. Confirm chore rotation is active (run `/orbrey:chore-rotator` if not).
3. Apply behaviour bonuses via `rewards.adjust` with reason field "{{reason}}".
4. Add the Tier 1–4 catalogue as a list in the app (`lists.create` "Rewards catalogue").
5. Schedule a Sunday review — run `/family-digest` weekly.

---

## Open Questions

- [ ] {{Decision the family needs to make}}

---

## Decision Log

| Decision | Options | Chosen | Why |
|---|---|---|---|
| Chore credit vs pure allowance | Hybrid / pure allowance / pure chore | Hybrid | Family wants effort tied to earn |
| Milestone scale for 6yo | $20 / $50 / $100 | $20 | Developmentally appropriate (2–4 weeks) |
