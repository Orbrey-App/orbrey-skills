# Orbrey AI Marketplace

The official Claude Code plugin marketplace for [Orbrey](https://orbrey.com) — a household management app covering meal planning, grocery, chores, routines, family scheduling, calendar, and rewards.

This marketplace currently ships one plugin: **`orbrey-ai`** (10 skills + 3 agents + 6 commands). It binds the `orbrey-mcp` Cloudflare Worker so Claude can read and write live household data on your behalf.

---

## Quick Start

### Install

```bash
# Add this marketplace
/plugin marketplace add orbrey/orbrey-skills

# Install the plugin
/plugin install orbrey-ai@orbrey-ai-marketplace
```

### Configure

After install, run:

```bash
/plugin config orbrey-ai@orbrey-ai-marketplace
```

Supply:

- **`orbrey_oauth_token`** — bearer token from the Orbrey app (Settings → Integrations → Generate token)
- **`default_household_id`** — *(optional)* the household UUID you usually work with
- **`orbrey_mcp_url`** — *(optional)* override the MCP endpoint (defaults to `https://mcp.orbrey.app/mcp`)

Restart Claude Code so the bundled MCP server picks up the credentials.

### Try it

```bash
/plan-week                  # 7-day meal plan + grocery sync
/grocery-tidy               # dedupe + aisle-order the list
/chore-fairness             # see chore distribution
/family-digest              # weekly household audit
/next-up                    # next 5 events / tasks
```

---

## Plugins

| Plugin | Skills | Agents | Commands | Description |
|---|---:|---:|---:|---|
| [`orbrey-ai`](plugins/orbrey-ai/) | 10 | 3 | 6 | End-to-end household automation on top of the orbrey-mcp worker |

### Skills (`orbrey-ai`)

| Skill | Description |
|---|---|
| [`meal-planner`](plugins/orbrey-ai/skills/meal-planner/) | Build a 7/14/28-day meal plan from the recipe library, respecting dietary tags, household size, busy-night flags from calendar, and pantry stock. Auto-syncs missing ingredients to the grocery list. |
| [`grocery-organizer`](plugins/orbrey-ai/skills/grocery-organizer/) | Dedupe, categorise, and aisle-order the grocery list; fold duplicates via `grocery.merge`. |
| [`chore-rotator`](plugins/orbrey-ai/skills/chore-rotator/) | Generate a fair chore rotation across household members, weighted by effort/age and tied to `rewards.adjust`. |
| [`routine-builder`](plugins/orbrey-ai/skills/routine-builder/) | Build daily routines (morning / school-prep / bedtime) as cascading recurring task occurrences with realistic time budgets. |
| [`calendar-conflict-finder`](plugins/orbrey-ai/skills/calendar-conflict-finder/) | Pull events across all members and providers; flag overlaps, drive-time gaps, double-booked attendees, and orphan events. |
| [`family-week-planner`](plugins/orbrey-ai/skills/family-week-planner/) | Combined fridge-ready weekly view: meals + chores + appointments + school + reminders. |
| [`reward-strategist`](plugins/orbrey-ai/skills/reward-strategist/) | Design reward catalogues; balance allowance vs chore credits; project wallet trajectories 4/8/12 weeks out. |
| [`pantry-to-recipe`](plugins/orbrey-ai/skills/pantry-to-recipe/) | Suggest recipes that minimise new grocery purchases by leaning on what's already in the pantry. |
| [`household-onboarder`](plugins/orbrey-ai/skills/household-onboarder/) | Walk a new member through joining: profile, role, dietary prefs, calendar OAuth, allowance setup. |
| [`recurring-task-author`](plugins/orbrey-ai/skills/recurring-task-author/) | Translate natural-language schedules ("every other Tuesday except school holidays") into RRule patterns. |

### Agents (`orbrey-ai`)

| Agent | Purpose |
|---|---|
| [`household-curator`](plugins/orbrey-ai/agents/household-curator.md) | Long-running weekly auditor — stale tasks, expired pantry, unbalanced chore loads, unused recipes, calendar conflicts. Designed to run on a Sunday-evening schedule. |
| [`meal-plan-orchestrator`](plugins/orbrey-ai/agents/meal-plan-orchestrator.md) | Coordinates the meal-planner ↔ pantry ↔ grocery ↔ calendar handshake. Sub-agent invoked by `meal-planner`. |
| [`routine-coach`](plugins/orbrey-ai/agents/routine-coach.md) | Real-time helper a member can talk to during their morning/bedtime routine. Calls `tasks.set_status` and credits `rewards.adjust` as steps complete. |

### Slash Commands (`orbrey-ai`)

| Command | Purpose |
|---|---|
| [`/plan-week`](plugins/orbrey-ai/commands/plan-week.md) | Run `meal-planner` for the next 7 days with sensible defaults. |
| [`/grocery-tidy`](plugins/orbrey-ai/commands/grocery-tidy.md) | Run `grocery-organizer` against the current list. |
| [`/chore-fairness`](plugins/orbrey-ai/commands/chore-fairness.md) | Show chore distribution by member and suggest rebalance moves. |
| [`/family-digest`](plugins/orbrey-ai/commands/family-digest.md) | Trigger the `household-curator` digest on demand. |
| [`/recipe-from-url`](plugins/orbrey-ai/commands/recipe-from-url.md) | Fast import via the `ai-parse` Edge Function then `recipes.create`. |
| [`/next-up`](plugins/orbrey-ai/commands/next-up.md) | Show the next 5 events / tasks across the household. |

---

## Repository Structure

```
orbrey-skills/
├── .claude-plugin/
│   └── marketplace.json                # Marketplace catalog (name: orbrey-ai-marketplace)
├── plugins/
│   └── orbrey-ai/
│       ├── .claude-plugin/plugin.json  # Plugin manifest (name: orbrey-ai)
│       ├── .mcp.json                   # Bundled orbrey-mcp server binding
│       ├── settings.json               # User-config schema
│       ├── README.md
│       ├── CHANGELOG.md
│       ├── agents/                     # 3 agent definitions
│       ├── commands/                   # 6 slash commands
│       ├── hooks/                      # PreToolUse + PostToolUse hooks
│       └── skills/                     # 10 skills
├── scripts/
│   └── check-versions.mjs              # Verify marketplace ↔ plugin.json version sync
├── LICENSE                             # MIT
└── README.md
```

---

## Conventions

- **Australian English** throughout (colour, organise, optimise, prioritise)
- **DD/MM/YYYY** date format
- **AUD** currency
- **Markdown-first** outputs — every skill produces clean, copy-pasteable markdown
- **Read live** before opining — every skill calls the `orbrey` MCP tools first; nothing is invented
- **Confirm destructive** — deletes, merges, and wallet adjustments surface a confirmation summary via the bundled `confirm-destructive` PreToolUse hook

---

## Disclaimer

This plugin issues **destructive calls** when you ask it to (recipe deletion, list deletion, task deletion, grocery merges, wallet adjustments). The destructive-confirm hook gives you a chance to abort, but always review what a skill is about to do before approving the tool call.

---

## License

MIT — see [`LICENSE`](LICENSE). Per-skill `LICENSE.txt` files are Apache 2.0.
