---
name: chore-fairness
description: Show chore distribution by member for the current rotation period and suggest rebalance moves.
argument-hint: "[optional-period — e.g. 'last 4 weeks' or 'this week']"
---

# /chore-fairness

Diagnostic-only command. Reads `tasks.list` history and surfaces who's actually been doing what — without modifying the rotation.

## Workflow

1. Resolve household ID from `default_household_id`.
2. Determine the analysis window from `$ARGUMENTS`. Default: last 4 weeks.
3. Pull `orbrey:tasks.list` for the window with chore tasks filtered (look for chore-tier metadata or chore-category tags).
4. Pull `orbrey:rewards.wallets` for member ages and weekly_allowance context.
5. Compute per-member:
   - Chores completed (count)
   - Chore effort points (using the same scale as `chore-rotator`: light 2, medium 5, heavy 9)
   - Chore credits earned (AUD)
   - Skip rate (skipped / total assigned)
6. Compare to the **target effort budget** for each member's age:

   | Age band | Target weekly effort points |
   |---|---:|
   | 6–8 | 5 |
   | 9–11 | 10 |
   | 12–14 | 18 |
   | 15–17 | 25 |
   | Adult | 35 |

7. Flag imbalances (>20% over or under target).

## Output

Markdown table grouped by member:

```
| Member | Completed | Skipped | Effort pts | Target | Variance | Earned |
|---|---:|---:|---:|---:|---|---:|
| Aria (14) | 12 | 1 | 64 | 72 | -11% | $48 |
| Maya (11) | 10 | 2 | 28 | 40 | -30% ⚠ | $20 |
```

Plus a **Suggested rebalance** section:

- "Aria is at 89% of target — add 1 medium chore back into rotation"
- "Maya skipped violin-prep 2× — consider moving that out of chore list (it's a routine task, not a chore)"

## Hard rules

- **Read-only.** Do not call `tasks.set_status`, `rewards.adjust`, or any mutation. Surface recommendations only.
- **Don't shame.** Variance is data; the family decides what to act on.
- **Don't propose a new rotation here.** Refer them to `/orbrey-ai:chore-rotator` for that.

## Next-action chain (suggest only)

- `/orbrey-ai:chore-rotator` — generate a rebalanced rotation
- `/family-digest` — full Sunday-evening curated audit
