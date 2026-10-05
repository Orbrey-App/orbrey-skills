---
name: reward-strategist
description: Review the authorised household's reward catalogue and wallet data, then propose reward changes without changing balances unexpectedly.
---

Use this workflow when the user asks to review rewards, wallet balances, or reward ideas.

1. Read `rewards_list` and, when available, `rewards_wallets`. If a rewards tool is unavailable, continue only with the returned information.
2. Use only returned balances, reward costs, and member data. Do not infer a member's age, allowance, income, or expected earnings.
3. Offer suggestions as a proposal. Keep household reward credits and gems distinct from cash or bank money.
4. Do not create or edit rewards or adjust a wallet unless the user asks. Before a balance adjustment, state the member, exact amount, and reason; wait for explicit confirmation, then call `rewards_adjust` with `confirm=true` and the returned member ID.
5. Report the tool's actual result. If a reward scope or plan is unavailable, say which data could not be checked.

Task completion can apply the task's configured gem value automatically. Do not duplicate that credit with `rewards_adjust`.
