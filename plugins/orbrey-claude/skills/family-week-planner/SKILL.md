---
name: family-week-planner
description: Create a concise weekly household view from returned meals, task occurrences, and calendar events.
argument-hint: [week-start-date]
allowed-tools: Read mcp__plugin_orbrey-ai_orbrey__meal_plan_week mcp__plugin_orbrey-ai_orbrey__tasks_list mcp__plugin_orbrey-ai_orbrey__calendar_list
---

# Family Week Planner

## User Context

$ARGUMENTS

If no week is supplied, use the upcoming Monday through Sunday in the household timezone.

## Workflow

1. Resolve the inclusive Monday–Sunday date range and tell the user which dates you will use.
2. Read `meal_plan_week`, `tasks_list`, and `calendar_list` for that range. If a source fails or is outside the authorised scopes, mark it unavailable; do not fill the gap by guessing.
3. Assemble only returned meal-plan entries, task occurrences, and calendar events. Preserve their returned dates, times, names, and statuses. Do not infer member age, school status, work status, travel time, availability, or task dependencies.
4. Keep a compact day-by-day view. Distinguish “no items returned” from “source unavailable.” Do not exclude an event as private or irrelevant based on guessed identity or role.
5. If no meal plan exists, show the meal section as not planned and offer to start `meal-planner`; do not present TBD meals as saved data.
6. Render the response in chat using `templates/output-template.md`. Create a file only if the user asks for one.

## Rules

- Never invent events, meals, or task assignments.
- Use Australian English and DD/MM/YYYY dates.
- The schedule is a summary of returned data, not a complete calendar guarantee.
- Do not make changes to household data from this read-only workflow.
