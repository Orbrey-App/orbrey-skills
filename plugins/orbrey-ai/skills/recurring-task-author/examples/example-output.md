# Recurring Task — Take vitamins

**Household:** The Donovan Household
**Assigned to:** Aria
**Anchor:** Monday 11/05/2026 07:30
**Authored:** 05/05/2026

---

## Natural-Language Input

> Every weekday morning at 7:30, except school holidays.

---

## Parsed RRule

```
DTSTART:20260511T073000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
```

End condition: never (revisit at end of academic year)

---

## First 5 Occurrences

| # | Date | Day | Notes |
|---:|---|---|---|
| 1 | 11/05/2026 | Monday | Anchor |
| 2 | 12/05/2026 | Tuesday | |
| 3 | 13/05/2026 | Wednesday | |
| 4 | 14/05/2026 | Thursday | |
| 5 | 15/05/2026 | Friday | |

---

## Exclusions

- **EXDATE:** none yet — supply Term 2 holiday block (29/06–13/07/2026) when the user is ready, and I'll add it as a 14-date EXDATE list.
- **Pattern exclusions RRule cannot model:** "school holidays" cannot be expressed as an RRule. **Plan:**
  1. Each term, paste the dates of school holidays and I'll add them as `EXDATE` entries.
  2. Or: leave the RRule running and use `orbrey:tasks.set_status` to mark school-holiday occurrences as `skipped` once they appear.

---

## Confirmation Block

About to create:

```
Title: Take vitamins
Assigned: Aria
Schedule: every weekday at 07:30
First due: Monday 11/05/2026 07:30
End: never (revisit at end of academic year)
Exclusions: pending — school holidays to be added per term
```

Confirm to proceed. Decline to keep this as a draft.

---

## Open Items

- [ ] User to provide Term 2 school-holiday dates (29/06–13/07/2026 indicative) so EXDATE can be populated.
- [ ] Reminder time of 07:30 — confirm this is *before* the morning routine kicks off (currently 06:45 wake) so vitamins land at the breakfast slot.
