---
name: grocery-tidy
description: Review and organise the household grocery list. Confirm exact source and target before any destructive grocery_merge call.
argument-hint: "[optional-store — e.g. 'aldi' or 'costco']"
---

# /grocery-tidy

Wraps the `grocery-organizer` skill with a single-command entry point.

## Workflow

1. Use the single household authorised for this MCP connection.
2. Pass `$ARGUMENTS` to `grocery-organizer` if the user named a store layout.
3. Invoke the skill end-to-end.
4. The skill will surface a merge-plan confirmation block before any `grocery_merge` calls; the confirmed tool call must include `confirm=true`.

## Hard rules

- **No silent merges.** The MCP server requires `confirm=true` for `grocery_merge`; the skill also previews the plan beforehand.
- **Don't run on an empty list** — surface that and stop.
- **Don't pull pantry shortages onto the list** unless the user opts in via `$ARGUMENTS` (e.g. "with pantry").

## Output

The same `grocery-organizer` deliverable: a tidied, aisle-ordered list with the merge log.

## Next-action chain (suggest only)

- `/family-digest` — weekly audit of the household
- `/plan-week` — proposes meals and asks separately before saving or syncing grocery items
