---
name: weekly-household-planner
description: Build a practical household week overview from authorised tasks and calendar events, and flag schedule conflicts without inventing household data.
---

Use this workflow when the user asks to plan, review, or coordinate a household week.

1. Confirm the date range if it is ambiguous. Use the household's local dates when returned by Orbrey.
2. Read the relevant occurrences with tasks_list and calendar_list. Reuse a result already fetched for the same dates in this conversation.
3. Group events and tasks by day. Call out overlaps or tight transitions only when the returned times support that conclusion; do not invent travel time or availability.
4. Offer a concise week view and a small number of practical adjustments. Distinguish suggestions from changes already made.
5. Do not create, edit, complete, or delete tasks or calendar events unless the user clearly asks. Before a multi-item change, show the exact proposed changes and get confirmation. Resolve member names to IDs with members_list when assignment requires it; never guess an ID.
6. If the account cannot read a required domain, say which part of the overview is missing and continue only with available data.

Use today_snapshot for a same-day overview. Use meal-planner when the request is specifically about meal choices or adding meals to a plan.
