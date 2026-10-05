---
name: routine-builder
description: Turn a household routine into a clear sequence of task steps and create it only after the user approves the schedule.
---

Use this workflow when the user asks to create or revise a recurring household routine.

1. Ask for the routine name, assignee, time-of-day bucket, start date, repeat pattern, and any timer or reward value. Do not infer a member ID; use `members_list` to resolve a supplied name when available.
2. Build a proposed sequence and schedule from the user's details. Explain that the MCP recurrence model supports DAY, WEEK, MONTH, or YEAR with an interval, optional days of week, and an optional end date. It cannot encode arbitrary holiday calendars or exception dates.
3. Show the full task details and first dates before writing. Ask for explicit confirmation of the exact task.
4. After confirmation, call `tasks_create` with `task_type="routine"`, the confirmed fields, and only returned member IDs. Do not claim creation unless the tool succeeds.
5. Report the tool result and any schedule limitation. Avoid duplicate routines by checking `tasks_list` first when the existing schedule is unclear.

Completing a task in Orbrey applies its configured gem value automatically. Never add a separate reward adjustment for routine completion.
