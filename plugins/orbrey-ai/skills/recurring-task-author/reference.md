# Recurring task fields

This reference mirrors the task fields accepted by the connected Orbrey MCP. It is not an iCalendar/RRule parser.

## Task types

- A routine uses task_type routine, starts with start_date, and may use time_buckets: ANYTIME, MORNING, AFTERNOON, EVENING.
- A contribution uses task_type contribution, starts with due_date, and may use due_time in HH:MM format.
- A routine time bucket represents a part of day, not a clock time. `timer_duration_seconds` is an optional task timer, not a calendar duration or dependency field.

## Repetition

Both task kinds can use repeat_unit DAY, WEEK, MONTH, or YEAR and repeat_interval from 1 to 365. Weekly schedules may use days_of_week as integers from 0 to 6, where Sunday is 0. Contributions may use repeats_enabled and repeat_ends_at.

The schema does not support recurrence count, exception dates, holiday calendars, or free-form RRule strings. If an exact pattern cannot be represented, explain the limitation and ask the user to choose a supported schedule.

## Assignees and rewards

Resolve member names with members_list and use only returned member IDs. The tool does not expose age or ability. A gem_value, when used, is a non-negative integer product unit. Orbrey credits it when the occurrence is completed.

## Confirmation and skipping

Show the complete task definition before calling tasks_create. Ask for approval. To remove one future occurrence, explain that tasks_delete_occurrence is permanent and requires confirm=true and a returned occurrence ID. tasks_set_status accepts completed or open; it does not accept skipped.
