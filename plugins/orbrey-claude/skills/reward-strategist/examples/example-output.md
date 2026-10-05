# Example reward proposal

Illustrative example only. It does not describe a live household or saved Orbrey data.

## Returned information

- Member names and IDs: not provided in this example.
- Wallet balances: not queried.
- Existing reward catalogue: not queried.
- Task reward settings: not queried.

## Draft proposal

| Reward | Suggested gem cost | Notes |
|---|---:|---|
| Choose a family activity | 20 gems | Example only; ask the household to choose the activity. |
| Pick a weekend dessert | 12 gems | Example only; check dietary needs before choosing. |

These values are suggestions, not product defaults. Gems are Orbrey reward units and are not money. No reward catalogue or wallet has been changed.

## Before making a change

1. Read the current rewards catalogue and any relevant wallet data if the user wants a household-specific proposal and access is available.
2. Confirm the exact catalogue change or wallet adjustment with the user.
3. For `rewards_adjust`, confirm the member, signed integer gem amount, and reason; then call with `confirm=true`.
4. Report the tool result. Never describe a proposal as saved until the tool confirms it.
