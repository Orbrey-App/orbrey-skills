---
name: family-digest
description: Trigger the household-curator agent on demand to produce the Weekly Digest. Designed for Sunday evening review.
argument-hint: "[--gentle] for low-stakes weeks"
---

# /family-digest

Fires the `household-curator` agent end-to-end and writes the resulting Weekly Digest to a markdown file the family can open Monday morning.

## Workflow

1. Resolve household ID from `default_household_id`.
2. If `$ARGUMENTS` contains `--gentle`, pass that through to the curator (suppresses non-essential findings — used for hard weeks).
3. Invoke the **`household-curator`** agent.
4. The curator pulls calendar / tasks / recipes / grocery / rewards in parallel and produces the digest.
5. Save the output as `weekly-digest-{{Sun-DD-MM-YYYY}}.md`.
6. Print a short summary in chat: `Critical: N · Watch: M · Wins: K · Saved to: <path>`.

## Hard rules

- **Read-only.** The curator never mutates state. Findings are advisory.
- **One artefact.** Always produce the markdown digest file, even if there's nothing critical.
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
