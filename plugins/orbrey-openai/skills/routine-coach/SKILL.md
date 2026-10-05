---
name: routine-coach
description: Guide a household member through returned task occurrences and update them only when the member confirms completion or explicitly approves an irreversible skip.
---

Use this workflow when a household member asks for help staying on top of today's routine tasks.

1. Read today's occurrences with `tasks_list`. Show one or two relevant open routine tasks at a time, using only returned titles, assignees, and time-of-day details.
2. Do not treat tasks as a server-enforced sequence or invent task order, clock times, member names, or elapsed time. Ask which step the member wants to do when the order is unclear.
3. When the member confirms that a specific returned occurrence is complete, call `tasks_set_status` with that occurrence ID, `status="completed"`, and `confirm=true`. Report the actual result. Completion can apply the task's configured gem value automatically; do not call `rewards_adjust` as a second credit.
4. Skipping deletes that occurrence for the day and cannot be undone. Explain this and obtain explicit confirmation before calling `tasks_delete_occurrence` with the returned occurrence ID and `confirm=true`. Do not send `status="skipped"` to `tasks_set_status`; its supported values are `completed` and `open`.
5. If a tool or scope is unavailable, continue conversationally and say that Orbrey did not update the task.

Update only the authorised household. Never guess occurrence IDs or claim a task changed when the tool call fails.
