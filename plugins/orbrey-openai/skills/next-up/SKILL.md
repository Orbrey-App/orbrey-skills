---
name: next-up
description: Give a compact view of upcoming authorised household tasks and calendar events using returned dates and times.
---

Use this workflow when the user asks what is coming up soon in the household.

1. Use the date range the user requests. If none is given, use today through the next two household-local dates and label that date-based window.
2. Read `calendar_list` and `tasks_list` for that same range. Use `today_snapshot` when the request is only about today.
3. If the user names a household member, use `members_list` when available to resolve that name; filter only on returned member IDs and names.
4. Show up to five relevant returned items. Preserve event times and time zones as returned. Tasks without a due time must not be assigned a made-up clock time or interleaved as though precisely timed.
5. Do not call the result an exact rolling 72-hour forecast unless the current household-local time and timestamps support that claim. Say when the window is date-based or a required domain could not be read.
6. Keep this workflow read-only. Do not complete tasks, edit events, or infer travel time or availability.

A quiet period is a valid result. Use only the authorised household and records returned by Orbrey.
