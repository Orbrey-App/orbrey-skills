---
name: calendar-conflict-finder
description: Find overlapping or tightly timed events in the authorised household calendar using returned dates and times.
---

Use this workflow when the user asks to find calendar conflicts or review a schedule for a date range.

1. Confirm the date range and whether to inspect every household event or focus on a named member.
2. Call `calendar_list` for the requested household-local date range. Use `members_list` only when names or member IDs are needed and access is available.
3. Compare actual returned start and end times. Report overlapping events and short gaps only when the timestamps support the conclusion. Do not infer travel time, availability, or unconnected external calendars.
4. Show the affected events, dates, and times, then distinguish confirmed overlaps from possible tight transitions.
5. Do not edit or delete events unless the user separately asks. Before any proposed multi-event edit, show the complete changes and ask for confirmation.

If the calendar scope or connection is unavailable, say the calendar was not checked. Never describe a partial result as the full household schedule.
