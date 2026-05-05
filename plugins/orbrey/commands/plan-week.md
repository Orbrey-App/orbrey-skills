---
name: plan-week
description: Generate a 7-day meal plan with sensible defaults and auto-sync missing ingredients to the grocery list.
argument-hint: "[optional-constraints — e.g. 'vegetarian Tues, 4 diners']"
---

# /plan-week

You are running the `meal-planner` skill with sensible defaults so the user gets a plan in one command.

## Defaults

- **Duration:** 7 days
- **Start date:** the next Monday from today
- **Meals per day:** dinner only
- **Effort budget:** Low–Medium with one Saturday Leisure slot reserved for higher-effort
- **Diners:** read from the household via `rewards.wallets` (count of members)
- **Dietary constraints:** read from each member's profile (allergies, vegetarian flags)
- **Grocery sync:** yes — auto-add missing items to the meal-plan list (still ask for confirmation before mutation)

## Workflow

1. Resolve the household ID from `default_household_id` (plugin config). If not set, list available households first.
2. Override defaults from `$ARGUMENTS` if the user passed any (e.g. "fortnight" → 14 days, "vegetarian" → blanket veggie, "no fish" → exclude fish).
3. Invoke the **`meal-planner`** skill end-to-end with the resolved parameters.
4. Surface the plan file path and the grocery delta summary.

## Hard rules

- **No silent grocery mutations.** Always show the delta and ask before adding items.
- **If the recipe library has < 7 dinners**, stop and recommend `/orbrey:recipe-from-url` first.
- **Output the same artefact** the standalone `meal-planner` skill produces — `meal-plan-{{start-date}}.md`.

## Next-action chain (suggest only)

After the plan is rendered, recommend:

- `/grocery-tidy` — dedupe and aisle-order the updated grocery list
- `/family-digest` — Sunday-evening curated audit
- `/orbrey:family-week-planner` — produce the printable fridge schedule once the chore rotation is in place
