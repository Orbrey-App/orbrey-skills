---
name: chore-rotator
description: Review task history and household members to propose a fair chore schedule, then create tasks only after the user approves.
---

Use this workflow when the user asks to distribute recurring chores across household members.

1. Ask which chores to include, the time window, rotation preference, and any constraints the user wants considered.
2. Call `members_list` to resolve names and IDs, and `tasks_list` for the relevant history. Do not infer ages, effort scores, allowances, or task costs unless explicitly returned or provided by the user.
3. Propose a balanced schedule using observable assignments and the user's stated rules. Distinguish measured history from suggestions; do not shame members or invent a fairness metric.
4. Show every task, assignee, recurrence, and configured gem value before writing. Ask for explicit confirmation of the full proposed set.
5. After confirmation, create each item with `tasks_create` using `task_type="contribution"` and only returned member IDs. If the user wants to change an existing task instead, show the exact changes, get approval, then call `tasks_update` with the current task ID and `confirm=true`.
6. Report successful and failed writes separately. Completing a task applies its configured gem value automatically; do not call `rewards_adjust` to duplicate it.

If task history or member data is unavailable, explain the limitation and offer a schedule based only on constraints the user supplied.
