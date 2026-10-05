---
name: meal-planner
description: Plan meals from the household's saved recipes and schedule, check recorded food preferences, and add meals only after the user approves the proposed plan.
---

Use this workflow when the user asks to plan meals or review a household meal plan.

1. Confirm the week if it is unclear. Use recipes_list for saved recipes, calendar_list for the requested dates, and meal_plan_week to see any existing plan. If a tool reports that a feature is unavailable, continue only with the data and actions that are available.
2. When dietary constraints matter, read the recorded member preferences with members_list if permitted. Use recorded restrictions as returned; do not assume missing or incomplete records mean there are no allergies.
3. Recommend meals grounded in returned recipes and schedule data. Identify when the library lacks enough information; do not fabricate saved recipes, ingredients, preparation times, or pantry stock. Use pantry_list only when available and relevant.
4. Present the complete proposal, dates, recipe names, substitutions, and any grocery implications. Planning in chat is not approval to change the saved meal plan.
5. Only after the user confirms, write the agreed meals with meal_plan_add_meals. If the user also asks to sync missing ingredients, show the items first and call meal_plan_sync_to_grocery only after explicit confirmation. Honour any additional confirmation requested by the MCP server.
6. Report the actual tool result. Never say a meal was saved or groceries were added if the call did not succeed.

This workflow does not order groceries or process payments.
