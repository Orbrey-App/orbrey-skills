---
name: recurring-task-author
description: Convert a natural-language task schedule into the recurrence fields Orbrey supports, preview it, and create it after approval.
---

Use this workflow when the user asks for a repeating chore, reminder, or contribution.

1. Clarify the task title, assignee, task kind, first date, repeat unit and interval, weekdays if weekly, due time if relevant, and optional end date.
2. Resolve assignee names with `members_list` when permitted. Never guess UUIDs.
3. Explain any schedule requirement that Orbrey cannot represent. The MCP supports DAY, WEEK, MONTH, or YEAR repeat units and an interval, days of week, and an optional end date. It does not support arbitrary RRULE text, EXDATE exceptions, or automatic school/public holiday calendars.
4. Show the task payload in plain language, including the first few expected dates. Ask for confirmation before creating it.
5. After confirmation, call `tasks_create` with `task_type="contribution"` for a due-date task or `task_type="routine"` for a repeating routine. Only use values supported by the tool schema. Report the actual result.

If the requested exception cannot be represented, do not create a broader schedule and promise an exception. Ask the user to choose a supported schedule or manage individual dates in Orbrey.
