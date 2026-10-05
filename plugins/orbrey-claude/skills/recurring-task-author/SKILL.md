---
name: recurring-task-author
description: Turn a natural-language task schedule into Orbrey's supported recurrence fields and create it after approval.
argument-hint: [natural-language-schedule]
allowed-tools: Read mcp__plugin_orbrey-ai_orbrey__members_list mcp__plugin_orbrey-ai_orbrey__tasks_create mcp__plugin_orbrey-ai_orbrey__tasks_list
effort: medium
---

# Recurring Task Author

Translate the user's requested schedule into the fields accepted by tasks_create. Do not output an RRule as if Orbrey accepts it.

## Gather the task

Clarify only what is needed: task title, whether it is a routine or contribution, first date, assignee, repeat pattern, and any optional time or gem value. Resolve assignee names through members_list and use only returned member IDs. The user must add an absent member in the Orbrey app.

## Supported schedule fields

- task_type is routine or contribution.
- Contributions use due_date for the first due date and may use due_time in HH:MM format.
- Routines use start_date for the first day and may use time_buckets: ANYTIME, MORNING, AFTERNOON, or EVENING. These are day-part labels, not exact clock times.
- Repeating tasks use repeat_unit: DAY, WEEK, MONTH, or YEAR, plus repeat_interval from 1 to 365.
- Weekly schedules may use days_of_week with Sunday=0 through Saturday=6.
- Contributions may use repeats_enabled and repeat_ends_at. Ask for an end date only if the user wants one.
- A gem_value, if requested, is a non-negative integer in gems. Completion credits the configured value automatically.

Do not claim support for a recurrence count, exception dates, school-holiday calendars, arbitrary time zones, or an RRule grammar. If the request cannot be represented with the supported fields, explain the mismatch and offer the closest schedule the user can approve.

## Preview and create

1. Present the task type, title, assignee, first date, repeat fields, any due time or day-part, optional gem value, and end date.
2. Ask the user to confirm this complete proposal.
3. After confirmation, call tasks_create with only fields supported for that task type. Do not create a task for an unlisted member or invent an ID.
4. If the user asks to inspect the created schedule, call tasks_list for the relevant bounded date window (at most 93 days) and report only returned occurrences.
5. Report the actual create result. A failed call is not a created task.

Skipping a single occurrence is a separate consequential action: explain that tasks_delete_occurrence permanently removes that occurrence and cannot be restored, then call it only after explicit confirmation with the returned occurrence ID and confirm=true. Do not use tasks_set_status with status=skipped; its accepted values are completed and open.
