# Orbrey Plugin

Run your household from inside Claude Code. Ten domain skills, three agents, and six slash commands wrap the [Orbrey](https://orbrey.app) MCP server so Claude can plan meals, organise the grocery list, rotate chores fairly, build family routines, find calendar conflicts, and manage rewards — all backed by live household data.

This plugin assumes you already have an Orbrey household and an OAuth token for the orbrey-mcp Cloudflare Worker.

---

## Skills

| # | Skill | Purpose |
|---|---|---|
| 1 | `meal-planner` | Generate a 7/14/28-day meal plan from the recipe library, respecting dietary tags, household size, calendar busy-nights, and pantry stock. Auto-syncs missing ingredients to the grocery list. |
| 2 | `grocery-organizer` | Dedupe, categorise, and aisle-order the grocery list; fold duplicates via `grocery.merge`. |
| 3 | `chore-rotator` | Generate a fair chore rotation across household members, weighted by effort/age and tied to `rewards.adjust`. |
| 4 | `routine-builder` | Build daily routines (morning / school-prep / bedtime) as recurring task occurrences. |
| 5 | `calendar-conflict-finder` | Pull events across all connected providers/members; flag overlaps, drive-time gaps, and double-bookings. |
| 6 | `family-week-planner` | Combined fridge-ready weekly view: meals + chores + appointments + school + reminders. |
| 7 | `reward-strategist` | Design a reward catalogue and earning rules; balance allowance vs chore credits; project wallet trajectories. |
| 8 | `pantry-to-recipe` | Suggest recipes that minimise new grocery purchases by leaning on what's already in the pantry. |
| 9 | `household-onboarder` | Walk a new member through joining: profile, role, dietary prefs, calendar OAuth, allowance setup. |
| 10 | `recurring-task-author` | Translate natural-language schedules ("every other Tuesday except school holidays") into RRule patterns and create the task occurrences. |

---

## Agents

| Agent | Purpose |
|---|---|
| `household-curator` | Long-running weekly auditor — stale tasks, expired pantry, unbalanced chore loads, unused recipes, calendar conflicts. Designed to run on a schedule. |
| `meal-plan-orchestrator` | Coordinates the meal-planner ↔ pantry ↔ grocery ↔ calendar handshake when generating a plan. Sub-agent invoked by `meal-planner` for complex constraint solving. |
| `routine-coach` | Real-time helper a member can talk to during their morning/bedtime routine — calls `tasks.set_status` and credits `rewards.adjust` as steps complete. |

---

## Slash Commands

| Command | What it does |
|---|---|
| `/plan-week` | Run `meal-planner` for the next 7 days with sensible defaults. |
| `/grocery-tidy` | Run `grocery-organizer` against the current list. |
| `/chore-fairness` | Show chore distribution by member and suggest rebalance moves. |
| `/family-digest` | Trigger the `household-curator` digest on demand. |
| `/recipe-from-url <url>` | Fast import via the `ai-parse` Edge Function then `recipes.create`. |
| `/next-up` | Show the next 5 events / tasks across the household. |

---

## Installation

```bash
# Add the orbrey marketplace if you have not already
/plugin marketplace add orbrey/orbrey-claude-plugins

# Install the plugin
/plugin install orbrey@orbrey
```

After install, open `/plugin config orbrey@orbrey` and supply:

- **`orbrey_oauth_token`** — bearer token from the Orbrey app (Settings → Integrations → Generate token)
- **`default_household_id`** — *(optional)* the household UUID you usually work with
- **`orbrey_mcp_url`** — *(optional)* override the MCP endpoint (defaults to `https://mcp.orbrey.app/mcp`)

Then restart Claude Code so the bundled MCP server picks up the credentials.

---

## Quick Start

```text
/plan-week                                       # 7-day meal plan + grocery sync
/grocery-tidy                                    # dedupe + aisle-order list
/chore-fairness                                  # see chore distribution
/orbrey:routine-builder bedtime routine for 6yo  # interactive build
/orbrey:calendar-conflict-finder next 14 days    # flag overlaps
/family-digest                                   # weekly household audit
```

If a skill needs more context it will ask. All skills accept `$ARGUMENTS` for fast invocation.

---

## How the skills connect

```
recipe library  +  pantry  +  calendar busy-nights
      ↓                ↓               ↓
            meal-planner
                  ↓
        grocery-organizer  ← (auto-sync ingredients)
                  ↓
            family-week-planner

household members
      ↓
chore-rotator  →  routine-builder  →  routine-coach
                                          ↓
                                  rewards.adjust  →  reward-strategist
```

Each skill's output is markdown-first and can be passed verbatim into another skill as context.

---

## MCP tool surface

The plugin binds the **orbrey** MCP server, which exposes 14 tools covering tasks, lists, calendar, recipes, grocery, and rewards. All tools take a `household_id` UUID and respect OAuth scopes (`tasks:read/write`, `lists:read/write`, `calendar:read/write`, `recipes:read/write`, `grocery:read/write`, `rewards:read/write`).

For the authoritative tool list, see [`workers/orbrey-mcp/src/mcp/toolRegistry.ts`](https://github.com/orbrey/orbrey/blob/main/workers/orbrey-mcp/src/mcp/toolRegistry.ts) in the Orbrey monorepo.

---

## Hooks

The plugin ships two safety/UX hooks:

- **`confirm-destructive`** — PreToolUse hook on `*_delete*` and `grocery.merge` calls. Surfaces what's about to be removed before execution.
- **`suggest-meal-slot`** — PostToolUse hook after `recipes.create`. Suggests slotting the new recipe into the next open meal-plan day.

Hooks are pure bash and live under `hooks/scripts/`.

---

## Conventions

- **Australian English** throughout (colour, organise, optimise, prioritise)
- **DD/MM/YYYY** dates
- **AUD** currency where reward amounts are surfaced
- **Markdown-first** outputs — copy-pasteable
- Skills never invent household data — they always call the MCP server first

---

## Disclaimer

This plugin issues **destructive calls** when you ask it to (recipe deletion, list deletion, task deletion, grocery merges, wallet adjustments). The destructive-confirm hook gives you a chance to abort, but always review what a skill is about to do before approving the tool call.

---

## License

MIT — see the marketplace root [`LICENSE`](../../LICENSE). Per-skill `LICENSE.txt` files are Apache 2.0.

This plugin is published independently of (and not affiliated with) any other Claude plugin marketplace.
