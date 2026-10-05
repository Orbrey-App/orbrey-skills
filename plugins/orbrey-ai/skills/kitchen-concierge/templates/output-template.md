# Kitchen Concierge planning brief

Show this brief in the current Claude Code session. The Orbrey MCP has no household messaging tool; do not claim a household member received it.

## Kitchen Concierge — {{date}}

**Period:** {{period and dates}}
**Dietary profile:** {{N}}/{{N}} current members matched; confirmed {{date}}

### Meals planned

| Date | Meal | Saved recipe | Notes |
|---|---|---|---|
| {{date}} | {{meal type}} | {{returned recipe title}} | {{returned plan notes, if any}} |

### Pantry and grocery list

- Pantry status: {{items checked, or explain if inventory was unavailable}}
- Items to add: {{name, quantity, unit, and recipe source from returned data}}
- Existing grocery list: {{returned items, or unavailable}}
- Store and fulfilment mode: {{user-configured choice}}
- Estimated price: {{only if supported by a source; otherwise not available}}

Do not invent expiry, stock, or price details. Before any order is built, rebuild the live cart in the user's Chrome session, read the retailer's total, run `verify_cart.mjs`, and obtain the required human checkout decision. Scheduled runs defer without placing an order.

### Outcome

{{planned / deferred-awaiting-approval / placed / cancelled / failed}}

No order was placed unless the recorded checkout flow and human permission confirmed it.
