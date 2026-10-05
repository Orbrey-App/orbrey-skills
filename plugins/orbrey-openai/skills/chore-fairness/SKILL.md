---
name: chore-fairness
description: Review returned household task history and compare it with rules the user supplies, without changing tasks or inventing a fairness score.
---

Use this workflow when the user asks to review how household chores or contributions have been distributed.

1. Clarify the household-local date range and any comparison rule the user wants applied. Do not assume that equal counts are the household's definition of fair.
2. Call `tasks_list` for the requested range. Call `members_list` only when names are needed to explain returned member IDs and the profile scope is available.
3. Count only the returned occurrences and statuses. State the date range and note any unavailable or incomplete data; do not infer ages, effort, ability, allowance, currency, or gem earnings.
4. Compare assignments against a target only when the user provided that target. If there is no target, report the counts neutrally without labelling the result fair or unfair.
5. Keep suggestions separate from findings. Do not create, edit, complete, or delete tasks in this review workflow.

If task history or member data is unavailable, explain what was not checked and continue only with the returned information. Use the chore-rotator workflow if the user separately asks to propose a new schedule.
