---
name: chore-fairness
description: Summarise returned task occurrence counts for a chosen household-local date window and compare them with targets the user supplies.
argument-hint: "[optional period, for example last four weeks or this week]"
---

# Chore fairness

Read-only review of the task occurrences returned by Orbrey. Do not change tasks.

## Workflow

1. Use the single household authorised for this MCP connection. Do not ask for or guess a household ID.
2. Determine the date window from the user's request. If not supplied, offer a recent window that fits tasks_list limits (maximum 93 days).
3. Call tasks_list for the window. Call members_list only if names are needed to explain returned member IDs.
4. Summarise only returned occurrences and statuses. Count completed, open, and skipped only when those statuses are present in the response. State the window and any pagination or access limits.
5. Compare distribution with a target only if the user provides the target rule. Do not infer age, effort, capability, allowance, currency, or earned gems.
6. Keep recommendations as options. Ask before making any change; use chore-rotator for a confirmed new schedule.

## Output

| Member | Completed | Open | Skipped | Notes |
|---|---:|---:|---:|---|
| {{member}} | {{returned count}} | {{returned count}} | {{returned count}} | {{only evidence-based note}} |

If no target is provided, describe the counts without labelling them fair or unfair. Never manufacture a sample person or result.
