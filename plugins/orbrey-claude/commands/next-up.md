---
name: next-up
description: Show the next 5 events / tasks across the household — quick situational awareness.
argument-hint: "[optional-member-filter — e.g. 'maya only']"
---

# /next-up

Read-only situational awareness. The "what's coming?" question answered fast.

## Workflow

1. Use the single household authorised for this MCP connection.
2. Pull in parallel:
   - `orbrey:calendar_list` with a date window covering the next 72 hours
   - `orbrey:tasks_list` with `start_date = household-local today`, `end_date = household-local today + 3 days`
3. Filter to events/tasks within the next 72 hours.
4. If `$ARGUMENTS` names a member, filter to events/tasks involving that member.
5. Sort by start time ascending; take top 5.
6. Render as a compact list:

```
Next up — Donovan Household — 05/05/2026 14:55

  Today
    16:30  Maya — netball training (Jacaranda Park)
    18:00  Family dinner: Halloumi & roast pumpkin bowls
    19:00  Maya — wipe bathroom basin (chore)

  Tomorrow
    07:30  Aria — take vitamins
    08:15  Eli — bus
```

## Hard rules

- **Read-only.** No mutations.
- **No fluff.** This command is asked when the user is in motion — keep it tight.
- **Show member names** when there are multiple people in the household.
- **Honour blanks gracefully.** "Quiet next 72 hours" is a valid output.

## Output

Inline message in chat. No file created.

## Next-action chain (suggest only)

- `/family-digest` — Sunday-evening audit
- `/orbrey:calendar-conflict-finder` — if you spot something that looks tight
