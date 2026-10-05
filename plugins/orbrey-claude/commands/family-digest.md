---
name: family-digest
description: Trigger the household-curator agent on demand to produce the Weekly Digest. Designed for Sunday evening review.
argument-hint: "[--gentle] for low-stakes weeks"
---

# /family-digest

Fires the `household-curator` agent end-to-end and writes the resulting Weekly Digest to a markdown file the family can open Monday morning.

## Workflow

1. Use the single household authorised for this MCP connection; do not ask for a household ID.
2. If `$ARGUMENTS` contains `--gentle`, pass that through to the curator (suppresses non-essential findings — used for hard weeks).
3. Invoke the **`household-curator`** agent.
4. The curator reads only domains allowed by the connection's current scopes. Rewards and pantry may require Plus; omit a domain if it is unavailable and say so.
5. Present the digest in chat. Create a local markdown file only if the user asks for a file or the current environment supports a requested save location.
6. Print a short summary in chat: `Critical: N · Watch: M · Wins: K`.

## Hard rules

- **Read-only.** The curator never mutates state. Findings are advisory.
- **No invented persistence.** Do not claim a digest file was saved unless a file was actually created.
- **Lead with wins** when the week was good. Don't manufacture findings to fill space.

## Suggested cadence

The intent is a **Sunday evening** run. To automate it, the user can set up a `scheduled-tasks` MCP entry:

```
Every Sunday at 18:00 — run /family-digest
```

Without scheduling, this is a manual command the household admin runs as part of Sunday-night reset.

## Next-action chain (suggest only)

After the digest renders, suggest the most actionable follow-up based on its findings:

- If Critical findings on calendar → `/orbrey-ai:calendar-conflict-finder`
- If Critical findings on tasks → `/chore-fairness`
- If grocery is stale → `/grocery-tidy`
- Otherwise → "Have a good Monday."
