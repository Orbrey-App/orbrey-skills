# Kitchen Concierge run example

> Illustrative workflow only. Names, products, totals, and results are not real. No live MCP or retailer action was performed.

1. Read the current roster with members_list and compare its member IDs with the local, user-confirmed dietary profile.
2. Plan with the meal-planner skill and the user's confirmed local dietary contract.
3. Read pantry_list when available. State when pantry data could not be read.
4. Show the proposed meal plan and list changes before writing. Ask for approval before any supported list updates.
5. If ordering is requested, use the user's own supported Claude in Chrome session. Never handle credentials or one-time codes.
6. Before verify_cart.mjs, refresh members_list and write a timestamped authorised-roster.json. The verifier requires an exact member-ID match, a fresh roster snapshot, an in-limit retailer total, and a cart that passes the dietary and substitution checks.
7. The checkout hook still asks the human to approve the real total. A successful verifier run does not place the order.

If the local profile is missing, stale under its critical-restriction rule, or does not match the current roster, stop before checkout and use Kitchen Concierge setup.
