---
name: chore-rotator
description: Plan and, after approval, create household chore tasks using the authorised member roster and supported task schedules.
argument-hint: [period-and-style]
allowed-tools: Read mcp__plugin_orbrey_orbrey__members_list mcp__plugin_orbrey_orbrey__tasks_list mcp__plugin_orbrey_orbrey__tasks_create
effort: high
---

# Chore Rotator

Plan a proposed chore schedule for the one household authorised to this MCP connection. Do not assume a member's age, ability, effort score, allowance, currency, or prior assignment unless the user provides it or a tool returns it.

## Workflow

1. Ask only for missing decisions: the planning dates, chores, participating members, preferred distribution, schedule, and whether any task should carry a gem value.
2. Call members_list to resolve member names to IDs. Use only IDs returned by that tool. If a person is not on the roster, ask the user to add them in the Orbrey app first.
3. If past or current assignments matter, call tasks_list for a bounded date window supported by the tool (up to 93 days). Count only returned task occurrences and statuses. Do not infer effort or fairness from task counts alone.
4. Propose an assignment table. Explain the rule used, such as equal task counts or a user-specified weighting. Mark any unknown workload data.
5. Create tasks only after the user approves the complete proposed set. Use tasks_create with task_type=contribution, the resolved assignee_member_ids, and supported schedule fields. Use due_date for the first due date. Recurrences use repeat_unit (DAY, WEEK, MONTH, or YEAR), repeat_interval, days_of_week (Sunday=0 through Saturday=6), repeats_enabled, and optionally repeat_ends_at. Use due_time only when the user supplied a time.
6. A gem_value is an integer gem amount, not money. If set, Orbrey automatically credits it when the occurrence is marked completed. Do not create a second reward adjustment for the same completion.
7. Report only the actual tool results. If any task creation fails, identify which task was not created.

## Limits

- The MCP connection already selects one household. Do not ask for a household ID or imply that the plugin can switch households.
- members_list returns names, IDs, roles, and available food-preference fields; it does not return ages or chore abilities.
- Do not invent a household roster, chores, point budgets, rates, or history.
- The MCP does not accept iCalendar RRule strings. Translate a schedule only into the supported fields and disclose when a requested pattern cannot be represented.
- Do not write a local rotation file or claim that a plan was saved unless a file was actually created.
- Use Australian English and dates the user can verify.
