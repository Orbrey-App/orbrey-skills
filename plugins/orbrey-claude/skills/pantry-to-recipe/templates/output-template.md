# Pantry to Recipe — {{Household Name}}

**Date:** {{DD/MM/YYYY HH:mm}}
**Meal:** {{dinner | lunch | breakfast | snack}}
**Time budget:** {{≤30 | ≤45 | no cap}} min
**Diners:** {{N}}
**Pantry source:** {{Orbrey list 'Pantry' | user input | cabinet check}}

---

## Top Picks

| # | Recipe | Match | Gaps | Time | Note |
|---:|---|---:|---|---:|---|
| 1 | {{recipe}} | {{n}}% | {{n}} ({{names}}) | {{n}} min | {{why}} |
| 2 | {{recipe}} | {{n}}% | {{n}} ({{names}}) | {{n}} min | {{why}} |
| 3 | {{recipe}} | {{n}}% | {{n}} ({{names}}) | {{n}} min | {{why}} |

---

## Recommended: {{Top recipe}}

**Servings:** {{N}} · **Total time:** {{n}} min

### Have on hand
- {{ingredient}} — {{qty}} ({{pantry stock vs recipe needs}})
- {{ingredient}}

### Gaps
- **{{ingredient}}** — recipe needs {{qty}}; not in pantry.
  - Substitute: {{suggestion + reason}}.

### Plan
1. {{Step or note about scaling for diner count}}.
2. {{Step about timing — start braising at HH:mm if dinner is at 18:30}}.

---

## Optional Express Shop

Only if you're up for a 2-item dash:

- [ ] {{item}} — {{recipe}}
- [ ] {{item}} — {{recipe}}

---

## Open Items

- [ ] Confirm pantry stock matches reality (last updated {{when}})
- [ ] {{Recipe}} flagged 90% match but ingredient list is vague ("spices") — verify before relying

---

## Next Actions

- Cook the recommended recipe
- Run `/orbrey-ai:grocery-organizer` to add missing items if you want a fuller shop
- Run `/plan-week` to push pantry-friendly recipes higher in next week's plan
