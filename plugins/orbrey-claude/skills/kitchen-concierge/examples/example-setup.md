# Kitchen Concierge setup example

> Illustrative workflow only. No live MCP, scheduler, store, or file action was performed.

1. The user chooses the scheduler cadence, stores, order ceiling, substitution policy, and notification preference.
2. Kitchen Concierge calls members_list and shows the returned member IDs and names.
3. The user confirms the food restrictions and preferences for every returned member, including an explicit empty restriction list where appropriate.
4. The skill writes the user-confirmed local dietary profile with current member IDs. It explains that this sensitive file stays in the Claude plugin data directory and does not update Orbrey.
5. Setup remains incomplete if any current roster member lacks a confirmed profile entry, or if the user has not confirmed allergy details.
6. Before an order verification, the skill refreshes members_list and writes a timestamped authorised-roster.json. The verifier rejects a stale or mismatched roster.

The examples in this file are workflow steps, not proof of completed setup.
