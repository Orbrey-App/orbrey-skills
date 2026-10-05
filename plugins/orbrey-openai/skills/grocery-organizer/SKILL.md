---
name: grocery-organizer
description: Review and organise the authorised household grocery list, add requested items, and merge duplicates only after the user reviews and confirms the exact change.
---

Use this workflow when the user asks to review, tidy, or update an Orbrey grocery list.

1. Read the current items with grocery_list. If the user needs to choose among grocery lists, use grocery_list_lists and ask when the target is unclear.
2. For a tidy-up request, identify likely duplicates and propose a clearer grouped view. Keep uncertain matches separate; do not merge items based only on a broad category or similar name.
3. Add items with `grocery_add_items`, using a one-item `items` array for one item, only when the user clearly asked for those additions. Use returned list IDs when the user specified a particular list.
4. Before grocery_merge, show the source item, target item, and any quantity/unit effect. Merge only after explicit confirmation. Use IDs from a current list result, never guessed IDs.
5. Report which list changes succeeded. If a tool is unavailable or an item is ambiguous, say so and leave that change unapplied.

The grocery tools maintain a household list. They do not search retailers, compare live prices, place orders, or process payments.
