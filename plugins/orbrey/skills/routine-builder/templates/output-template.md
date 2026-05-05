# Routine — {{Routine Name}} ({{Member}})

**Type:** {{morning | school-prep | after-school | dinner | bedtime | weekend | custom}}
**Anchor:** {{anchor name}} at {{HH:mm}}
**Window:** {{HH:mm}} – {{HH:mm}} ({{minutes}} min available)
**Built:** {{DD/MM/YYYY}}

---

## Time Math

| Allocated | Available | Slack |
|---|---|---|
| {{n}} min | {{m}} min | {{m-n}} min |

{{If slack < 0, surface the overrun and what the user agreed to drop or move.}}

---

## Timeline

| Time | Step | Duration | Assigned | Notes |
|---|---|---:|---|---|
| {{HH:mm}} | {{step}} | {{n}} min | {{member}} | {{depends on / handoff}} |

---

## Recurring Task Occurrences (Proposed)

| Title | Assigned | Recurrence | First due |
|---|---|---|---|
| {{step}} | {{member}} | FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR | {{DD/MM/YYYY}} |

Confirm to create.

---

## Dependencies

- {{Step}} → relies on {{prior routine}} (e.g. "uniform laid out" — bedtime routine)
- {{Step}} → must precede {{later step}}

---

## Open Items

- [ ] {{Item}}

---

## Next Actions

- Build the matching {{counterpart routine}} (e.g. if you built bedtime, build morning next)
- Run `/orbrey:family-week-planner` to merge with chores and calendar
- Watch for the first 2 weeks; tighten any step that consistently overruns
