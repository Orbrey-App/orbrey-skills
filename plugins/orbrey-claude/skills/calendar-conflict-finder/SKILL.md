---
name: calendar-conflict-finder
description: Find overlapping household calendar events in a requested date range using only events returned by the authorised Orbrey calendar connection.
argument-hint: [date-range]
allowed-tools: AskUserQuestion mcp__plugin_orbrey_orbrey__calendar_list
effort: medium
---

# Calendar Conflict Finder

## User Context

$ARGUMENTS

If no date range is given, use the next 14 household-local dates. Ask a brief follow-up if the requested range cannot be resolved to dates.

## Workflow

1. Call `calendar_list` with explicit inclusive `start_date` and `end_date` in `YYYY-MM-DD` format. The range cannot exceed 93 days. Set `limit` only when needed and never above 500.
2. Inspect only returned event IDs, titles, start and end times, all-day state, and any explicit member or group association present in the result. Times are already in the household timezone.
3. Identify actual overlaps by comparing returned intervals. Treat two events as associated with the same person only if the returned records identify that person. Otherwise label the result as a household calendar overlap, not a personal double-booking.
4. Do not infer travel time, attendee needs, school/work schedules, events from external providers, or missing start/end times. Note missing fields as unknown.
5. Present each overlap with event titles, returned dates/times, and IDs where useful. State the scanned range and that the result covers only events returned by this connection.
6. This skill is read-only. Do not edit, delete, or reschedule events. If the user wants a change, present the exact proposed change and handle it as a separate explicitly confirmed request.

Use Australian English and 24-hour time. Avoid claiming a conflict when returned intervals do not overlap.

## Output

Use `templates/output-template.md`. If no overlaps are found, say so and include the number of returned events and the date range. If the calendar tool fails or access is denied, explain that no scan was completed.
