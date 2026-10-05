---
name: recipe-from-url
description: Prepare and save a recipe from content available in the conversation, without claiming that Orbrey's MCP can fetch or parse a URL.
---

Use this workflow when the user wants to add a recipe from a link or recipe text.

1. Use only recipe content actually present in the conversation or supplied by the user. Orbrey's MCP does not fetch or parse recipe webpages. If the user supplied only a URL and its contents are unavailable, explain that and ask them to paste the recipe or import it through the Orbrey app.
2. Prepare a draft using only details provided: title, ingredients and amounts, method, and any supplied notes or labels. Do not invent missing quantities, steps, timings, nutrition, or tags.
3. Show the complete draft and ask the user to confirm saving that exact recipe to the authorised household.
4. After confirmation, call `recipes_create` with the supported recipe fields. Respect connection scopes and plan access; report the actual result and do not claim it was saved if the call fails.
5. If Orbrey reports an allergy conflict, surface it plainly. Do not claim a recipe is allergy-safe based on incomplete profile matching.

Do not call undocumented functions or claim that a URL was fetched by Orbrey. Saving a recipe does not add it to a meal plan or grocery list.
