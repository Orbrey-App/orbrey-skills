---
name: grocery-tidy
description: Dedupe, categorise, and aisle-order the household grocery list. Confirms merges before any destructive grocery.merge call.
argument-hint: "[optional-store — e.g. 'aldi' or 'costco']"
---

# /grocery-tidy

Wraps the `grocery-organizer` skill with a single-command entry point.

## Workflow

1. Resolve household ID from `default_household_id`.
2. Pass `$ARGUMENTS` to `grocery-organizer` if the user named a store layout.
3. Invoke the skill end-to-end.
4. The skill will surface a merge-plan confirmation block before any `grocery.merge` calls — do not bypass that gate.

## Hard rules

- **No silent merges.** The destructive-confirm hook fires on `grocery.merge`; the skill also surfaces the plan beforehand.
- **Don't run on an empty list** — surface that and stop.
- **Don't pull pantry shortages onto the list** unless the user opts in via `$ARGUMENTS` (e.g. "with pantry").

## Output

The same `grocery-organizer` deliverable: a tidied, aisle-ordered list with the merge log.

## Next-action chain (suggest only)

- `/family-digest` — weekly audit of the household
- `/plan-week` — auto-syncs missing meal-plan items into a fresh list next time
