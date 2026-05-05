---
name: recipe-from-url
description: Import a recipe from a URL via the ai-parse Edge Function and insert it into the household library via recipes.create.
argument-hint: "<url>"
---

# /recipe-from-url

One-shot recipe import. Hands the URL to the Orbrey backend's `ai-parse` Edge Function, normalises the result, and inserts via `orbrey:recipes.create`.

## Workflow

1. Resolve household ID from `default_household_id`.
2. Read `$ARGUMENTS` — must be a single URL. Reject if missing or malformed.
3. Call the Orbrey backend `ai-parse` Edge Function with `{ type: "recipe_url", url: "<url>" }`. (Note: this is an Edge Function call, not an MCP tool — it goes through the Orbrey app's HTTP API, not the orbrey-mcp Worker. If the orbrey-mcp does not expose `ai-parse`, surface this and ask the user to invoke the import from inside the Orbrey app, then come back here to confirm the recipe appeared via `recipes.list`.)
4. Show the parsed recipe to the user *before* writing — title, servings, prep/cook time, ingredient list, instructions snippet, image preview if available.
5. Ask for confirmation. If accepted, call `orbrey:recipes.create` with the normalised payload.
6. After the suggest-meal-slot PostToolUse hook fires (if the user has it on), they'll get a one-click "slot this into next week's plan" prompt.

## Hard rules

- **Confirm before writing.** The parsed result may have errors (wrong servings, missing ingredients). The user previews and adjusts before the create call.
- **Don't auto-tag aggressively.** Honour any tags the parser surfaces, but suggest additions rather than assuming (e.g. "this looks vegetarian — confirm?").
- **Strip junk.** Many recipe sites prefix instructions with marketing copy. Trim it.
- **Honour 50KB / 2KB content / URL limits** declared by the `ai-parse` Edge Function.

## Output

Confirms via short message: `Recipe "${title}" added to library. ID: ${recipe_id}.`

## Next-action chain (suggest only)

- `/plan-week` — incorporates the new recipe into next week's plan
- `/orbrey-ai:pantry-to-recipe` — see if you can cook this tonight from pantry
