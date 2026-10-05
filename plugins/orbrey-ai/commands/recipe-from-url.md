---
name: recipe-from-url
description: Help the user add a recipe from a URL, without claiming the MCP can fetch or parse webpages.
argument-hint: "<url or pasted recipe>"
---

# /recipe-from-url

The Orbrey MCP server does not expose a recipe-URL fetch or parsing tool.

## Workflow

1. Read `$ARGUMENTS`. If it is a URL only, explain that this plugin cannot fetch or parse the page; ask the user to import it in the Orbrey app or paste the recipe content here.
2. If the user provides recipe details, prepare a draft with the title and only the ingredients, steps, and metadata that are actually present. Do not invent quantities, timings, tags, or instructions.
3. Show the complete draft and ask the user to confirm adding it to the authorised household's recipe library.
4. After confirmation, call `recipes_create` with the recipe payload. Report the returned result, and do not claim the recipe was saved if the call fails.

## Hard rules

- Do not call undocumented Edge Functions or claim to read an external URL.
- Do not send a create tool call until the user has approved the exact draft.
- Respect the server's scopes, household binding, plan access, and any tool error.

## Next actions

- `/plan-week` to consider the saved recipe in a meal plan.
- `pantry-to-recipe` to compare saved recipes with available pantry items.
