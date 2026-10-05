---
name: pantry-to-recipe
description: Suggest meals grounded in saved household recipes and available pantry items without inventing stock or allergy safety.
---

Use this workflow when the user asks what they can cook from their pantry.

1. Call `pantry_list` when the pantry scope is available, and `recipes_list` for saved recipes. Use `recipes_get` for ingredient details when needed. If pantry access is unavailable, continue with saved recipes only.
2. Compare only returned stock and recipe ingredients. Treat quantities, expiry dates, or ingredients not returned as unknown; do not claim that an item is available.
3. If food preferences or allergies matter, read `members_list` when the `profile:read` scope is available. It does not provide severity tiers or ingredient aliases. Do not claim a recipe is allergy-safe; flag uncertainty for the user to check in Orbrey.
4. Suggest recipes that use the most confirmed pantry items and clearly list missing ingredients. Do not create a meal plan or change a grocery list unless the user asks.
5. If the user asks to save a meal or sync ingredients, preview the exact changes and get confirmation. Use the appropriate meal-plan tool; `meal_plan_sync_to_grocery` requires `confirm=true`.

If pantry data is inaccessible, continue with saved recipes only and say pantry availability was not checked.
