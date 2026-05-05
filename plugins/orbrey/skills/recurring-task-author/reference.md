# Recurring Task Author — Reference

Reference for translating natural-language schedules into iCalendar RRule strings (RFC 5545).

---

## 1. RRule Components

```
DTSTART:YYYYMMDDTHHMMSS                  # Anchor (first occurrence)
RRULE:FREQ=DAILY|WEEKLY|MONTHLY|YEARLY   # Required
       ;INTERVAL=N                       # Repeat every N
       ;BYDAY=MO,TU,WE,TH,FR,SA,SU       # Day names
       ;BYMONTHDAY=1..31                 # Day of month
       ;BYMONTH=1..12                    # Month of year
       ;BYSETPOS=1..N | -1..-N           # Nth occurrence in set
       ;COUNT=N                          # Stop after N occurrences
       ;UNTIL=YYYYMMDDTHHMMSSZ           # Stop on/after date

EXDATE:YYYYMMDDTHHMMSS                   # Skip these specific dates
```

---

## 2. Common Patterns

| Phrase | RRule |
|---|---|
| every day | `FREQ=DAILY` |
| every other day | `FREQ=DAILY;INTERVAL=2` |
| every weekday | `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR` |
| every Saturday and Sunday | `FREQ=WEEKLY;BYDAY=SA,SU` |
| every Monday and Thursday | `FREQ=WEEKLY;BYDAY=MO,TH` |
| every other Tuesday | `FREQ=WEEKLY;INTERVAL=2;BYDAY=TU` |
| every fortnight (anchor on Monday) | `FREQ=WEEKLY;INTERVAL=2;BYDAY=MO` |
| every third week | `FREQ=WEEKLY;INTERVAL=3` |
| 1st Sunday of the month | `FREQ=MONTHLY;BYDAY=1SU` |
| 3rd Friday of the month | `FREQ=MONTHLY;BYDAY=3FR` |
| last Friday of the month | `FREQ=MONTHLY;BYDAY=-1FR` |
| 2nd-last Saturday | `FREQ=MONTHLY;BYDAY=-2SA` |
| the 15th of every month | `FREQ=MONTHLY;BYMONTHDAY=15` |
| 1st and 15th of the month | `FREQ=MONTHLY;BYMONTHDAY=1,15` |
| every quarter | `FREQ=MONTHLY;INTERVAL=3` |
| every six months | `FREQ=MONTHLY;INTERVAL=6` |
| every year on 1 January | `FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1` |
| every year on the first Sunday of June | `FREQ=YEARLY;BYMONTH=6;BYDAY=1SU` |

---

## 3. End Conditions

| Phrase | Field |
|---|---|
| no end | (omit COUNT and UNTIL) |
| 12 times | `;COUNT=12` |
| until 31 December | `;UNTIL=20261231T000000Z` |
| for one term (~10 weeks) | `;COUNT=10` for weekly tasks |

---

## 4. Patterns RRule CAN'T Model Cleanly

| Phrase | Why | Workaround |
|---|---|---|
| "except school holidays" | Holidays vary per state and term | Use `EXDATE` after listing the dates |
| "except public holidays" | Holidays vary per jurisdiction | Same — `EXDATE` after listing |
| "weekdays except Mondays in school terms" | Mixed week + term logic | Two RRules concatenated |
| "every other Tuesday but skip if Adam is away" | Conditional on a person | Mark `skipped` when it fires |
| "every Wed unless raining" | Conditional on weather | Same — manual skip |

---

## 5. Australian Term Holidays — Reference Window (NSW)

(For sanity-checking; check the official department calendar before locking in.)

| Term | Holiday block (approx.) |
|---|---|
| Term 1 | mid-Apr → end Apr |
| Term 2 | early Jul → mid Jul |
| Term 3 | late Sep → mid Oct |
| Term 4 | mid-Dec → late Jan |

These shift year-to-year. Always confirm.

---

## 6. Time Zone Notes

- Australian local time uses `DTSTART:YYYYMMDDTHHMMSS` (no `Z`) and assumes the household's TZ.
- For cross-TZ households, use `DTSTART;TZID=Australia/Sydney:YYYYMMDDTHHMMSS`.
- DST shifts: a 07:30 task in NSW is 07:30 wall-clock year-round; the underlying UTC shifts in April and October. The Orbrey backend handles this — surface it once if a sub-hour pattern is in play.

---

## 7. Validation Checklist

Before creating any recurrence:

- [ ] Anchor date is correct
- [ ] BYDAY days are correctly abbreviated (MO/TU/WE/TH/FR/SA/SU)
- [ ] First 5 occurrences match user expectation
- [ ] End condition is set if appropriate (no infinite tasks)
- [ ] Exclusions captured for known holidays
- [ ] Member assignment confirmed
