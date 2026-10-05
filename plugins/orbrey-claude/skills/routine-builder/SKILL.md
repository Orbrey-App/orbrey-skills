---
name: routine-builder
description: Design and, after approval, create household routines using Orbrey's supported recurring task fields.
argument-hint: [routine-type-and-member]
allowed-tools: Read mcp__plugin_orbrey-ai_orbrey__members_list mcp__plugin_orbrey-ai_orbrey__tasks_create mcp__plugin_orbrey-ai_orbrey__tasks_list
effort: medium
---

# Routine Builder

Design a routine from steps the user chooses, then map each step to a supported Orbrey routine task. Do not imply that the MCP provides a timed checklist or dependency engine.

## Gather and plan

Ask for the routine purpose, step titles, participating members, first date, repeat pattern, and optional day-part, task timer, or gem values. Resolve each assignee with members_list. If a person is missing, ask the user to add them in the Orbrey app. Do not infer ages, capabilities, available minutes, or member preferences from the roster.

Present the steps in the order the user wants. The task schema supports timer_duration_seconds as a task timer, but it is not a calendar duration or exact start time. The time_buckets field supports only ANYTIME, MORNING, AFTERNOON, and EVENING. Explain this limit if the user asks for a clock-by-clock schedule.

## Create after approval

1. Show the full set of task titles, assignees, first date, recurrence fields, optional time_buckets, timer_duration_seconds, and gem_value.
2. Ask the user to approve the complete set before writing.
3. Create each step with tasks_create using task_type=routine and supported fields. A weekly routine uses days_of_week (Sunday=0 through Saturday=6); recurrence uses repeat_unit and repeat_interval. Each step is a separate task definition, not an enforced sequence.
4. A gem_value is an integer gem amount. Orbrey credits it when that occurrence is completed; do not call rewards_adjust to duplicate it.
5. If a create call fails, identify the failed step and do not claim it was saved. Use tasks_list only when the user wants a read-back for a bounded date range.

## Boundaries

- Use one authorised household; this connection cannot list or switch households.
- Do not invent member IDs or write a local onboarding/profile file.
- Do not claim that one step depends on another in the task system. Dependencies can be listed as guidance for the user, but Orbrey will not enforce them.
- Do not present timer_duration_seconds as a scheduled duration or claim routines have exact clock times.
- Use Australian English and clear dates.
