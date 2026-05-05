# Recurring Task — {{Task Title}}

**Household:** {{name}}
**Assigned to:** {{member or 'household'}}
**Anchor:** {{DD/MM/YYYY HH:mm}}
**Authored:** {{DD/MM/YYYY}}

---

## Natural-Language Input

> {{The user's exact phrasing}}

---

## Parsed RRule

```
DTSTART:{{YYYYMMDD}}T{{HHMMSS}}
RRULE:{{rule}}
```

End condition: {{never | UNTIL=YYYYMMDD | COUNT=N}}

---

## First 5 Occurrences

| # | Date | Day | Notes |
|---:|---|---|---|
| 1 | {{DD/MM/YYYY}} | {{Day}} | {{anchor}} |
| 2 | {{DD/MM/YYYY}} | {{Day}} | |
| 3 | {{DD/MM/YYYY}} | {{Day}} | |
| 4 | {{DD/MM/YYYY}} | {{Day}} | |
| 5 | {{DD/MM/YYYY}} | {{Day}} | |

---

## Exclusions

- **EXDATE:** {{list of YYYYMMDD or "none"}}
- **Pattern exclusions RRule cannot model:** {{e.g. "school holidays — see plan below"}}

If an occurrence falls on an unmodellable date, the user marks it `skipped` via `orbrey:tasks.set_status`.

---

## Confirmation Block

About to create:

```
Title: {{title}}
Assigned: {{member}}
Schedule: {{rule + anchor}}
First due: {{DD/MM/YYYY HH:mm}}
End: {{never | until X | count N}}
Exclusions: {{list}}
```

Confirm to proceed. Decline to keep this as a draft.

---

## Open Items

- [ ] {{Decision needed}}
