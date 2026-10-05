# Meal Plan — {{Household Name}}

**Window:** {{DD/MM/YYYY}} – {{DD/MM/YYYY}} ({{N}} days)
**Household size:** {{adults}} adults + {{kids}} kids
**Dietary contract:** {{summary of constraints}}
**Effort budget:** {{low | medium | high}}
**Generated:** {{DD/MM/YYYY}}

---

## Slot Map

| Day | Date | Slot type | Why |
|---|---|---|---|
| Mon | {{DD/MM}} | Standard | — |
| Tue | {{DD/MM}} | Express | Soccer training 17:30–19:00 |
| Wed | {{DD/MM}} | Standard | — |
| Thu | {{DD/MM}} | Skipped | {{Member}} on school camp |
| Fri | {{DD/MM}} | Leisure | — |
| Sat | {{DD/MM}} | Leisure | — |
| Sun | {{DD/MM}} | Standard | School night |

---

## The Plan

### Mon {{DD/MM}} — Standard
**{{Recipe title}}** · {{prep}}+{{cook}} min · serves {{N}} · {{tags}}
> {{One-line note: leftover plan, tweak suggestion, or skip-if condition.}}

### Tue {{DD/MM}} — Express
**{{Recipe title}}** · {{prep}}+{{cook}} min · serves {{N}} · {{tags}}
> {{...}}

### Wed {{DD/MM}} — Standard
{{...}}

### Thu {{DD/MM}} — Skipped
> {{Member}} away on camp. No cooking required.

### Fri {{DD/MM}} — Leisure
**{{Recipe title}}** · {{prep}}+{{cook}} min · serves {{N}} · {{tags}}
> Leftovers earmarked for Sun lunch.

### Sat {{DD/MM}} — Leisure
{{...}}

### Sun {{DD/MM}} — Standard
{{...}}

---

## Grocery Delta

Items added to the **Meal plan ({{week}})** list:

| Item | Qty | Unit | Recipe | Notes |
|---|---|---|---|---|
| {{ingredient}} | {{n}} | {{unit}} | {{recipe}} | — |

Items skipped (already present):

| Item | Reason |
|---|---|
| {{ingredient}} | Already on grocery list |
| {{ingredient}} | Pantry has it |

---

## Open Items

- [ ] {{Anything that requires a human decision before the plan is final}}
- [ ] {{Recipes flagged with `[time unknown]`}}
- [ ] {{Suggested library additions if the user opts in}}

---

## Next Actions

- Run `/orbrey-ai:grocery-organizer` to dedupe + aisle-order the list
- Run `/orbrey-ai:family-week-planner` to combine this plan with chores and calendar
- Run `/orbrey-ai:recipe-from-url <url>` to seed missing dietary categories
