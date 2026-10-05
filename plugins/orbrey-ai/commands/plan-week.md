---
name: plan-week
description: Draft a 7-day meal plan with sensible defaults; save meals or sync groceries only after separate confirmation.
argument-hint: "[optional-constraints — e.g. 'vegetarian Tues, 4 diners']"
---

# /plan-week

You are running the `meal-planner` skill with sensible defaults so the user gets a plan in one command.

## Defaults

- **Duration:** 7 days
- **Start date:** the next Monday from today
- **Meals per day:** dinner only
- **Effort budget:** Low–Medium with one Saturday Leisure slot reserved for higher-effort
- **Diners:** use the user's supplied household size; do not infer it from a paid rewards tool
- **Dietary constraints:** read `members_list` when the authorised `profile:read` scope is available. The tool does not expose severity tiers or aliases; state uncertainty and do not claim allergy safety
- **Grocery sync:** optional — show the missing items and ask separately before using the confirmation-gated sync tool

## Workflow

1. Use the single household authorised for this MCP connection; do not list or ask the user to select households.
2. Override defaults from `$ARGUMENTS` if the user passed any (e.g. "fortnight" → 14 days, "vegetarian" → blanket veggie, "no fish" → exclude fish).
3. Invoke the **`meal-planner`** skill end-to-end with the resolved parameters.
4. Surface the plan draft and grocery delta in chat. Do not claim to save a local file unless one is actually created.

## Hard rules

- **No silent grocery mutations.** Always show the delta and ask before adding items.
- **If the recipe library has < 7 dinners**, surface the gap and ask whether the user wants repeats or will add more recipes in Orbrey.
- Saving to the household plan and syncing groceries are separate user-approved actions.

## Next-action chain (suggest only)

After the plan is rendered, recommend:

- `/grocery-tidy` — dedupe and aisle-order the updated grocery list
- `/family-digest` — Sunday-evening curated audit
- `/orbrey-ai:family-week-planner` — produce the printable fridge schedule once the chore rotation is in place
