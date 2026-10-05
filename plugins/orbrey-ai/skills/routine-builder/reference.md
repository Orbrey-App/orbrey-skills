# Routine Builder — Reference

Use these neutral step prompts only as inspiration. Ask what fits the household; do not infer age, ability, schedule, or family roles.

## Possible routine steps

**Start of day**
- Get ready for the day
- Check what needs to leave the house
- Prepare or review the day's essentials

**Return home**
- Put away items brought home
- Review tasks or messages the user names
- Prepare for the next activity

**End of day**
- Reset a shared area
- Prepare items for tomorrow
- Review the next day's calendar

**Shared meal**
- Prepare the space
- Have the meal
- Reset the shared area

## Timing and task timers

The MCP task schema has `timer_duration_seconds`, an optional per-task timer value. It is a timer attached to that task, not a calendar duration, sequence delay, or start time. Routine `time_buckets` are limited to `ANYTIME`, `MORNING`, `AFTERNOON`, and `EVENING`. Orbrey stores each step as a separate task and does not enforce ordering or dependencies.

Only include the timer when the user asks for one. Do not supply default duration budgets or infer the time available.
