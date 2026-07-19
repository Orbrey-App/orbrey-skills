# Orbrey Plugin

Run your household from inside Claude Code. Twelve domain skills, three agents, and six slash commands wrap the [Orbrey](https://orbrey.app) MCP server so Claude can plan meals, organise the grocery list, rotate chores fairly, build family routines, find calendar conflicts, manage rewards, and — with `kitchen-concierge` — order the groceries.

> ### ⚠️ `kitchen-concierge` spends real money
>
> It drives your own Chrome session to build a grocery order at a real retailer
> and charges the card saved on your retailer account. Read
> [Grocery ordering](#grocery-ordering-kitchen-concierge) before enabling it.

This plugin assumes you already have an Orbrey household. Authentication is handled by Claude Code's built-in OAuth flow against the orbrey-mcp Cloudflare Worker — you do not need to generate or paste a bearer token.

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
| 11 | `kitchen-concierge` | **Spends money.** Scheduled end-to-end food cycle: plan → pantry diff → shopping list → notify → order at Woolworths/Coles via your own Chrome session. |
| 12 | `live-artifact-builder` | Build interactive HTML artifacts from household data. |

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
| `/orbrey-ai:kitchen-concierge` | `setup` · `run` · `approve` · `status` — the scheduled food cycle. |
| `/grocery-tidy` | Run `grocery-organizer` against the current list. |
| `/chore-fairness` | Show chore distribution by member and suggest rebalance moves. |
| `/family-digest` | Trigger the `household-curator` digest on demand. |
| `/recipe-from-url <url>` | Fast import via the `ai-parse` Edge Function then `recipes.create`. |
| `/next-up` | Show the next 5 events / tasks across the household. |

---

## Installation

```bash
# Add the orbrey marketplace if you have not already
/plugin marketplace add orbrey/orbrey-ai-marketplace

# Install the plugin
/plugin install orbrey-ai@orbrey-ai-marketplace
```

That's it. The plugin bundles the `orbrey` MCP server pointing at `https://mcp.orbrey.com/mcp` — no manual token paste required.

### First-time authentication

The first time a skill or command needs the MCP, run `/mcp` and follow the browser OAuth flow. Claude Code stores the access token securely (system keychain, or `~/.claude/.credentials.json` where the keychain is unavailable) and refreshes it automatically.

> **Note** — if you've already authorised Orbrey via Claude.ai's web Settings → Connectors, you'll still be asked to authorise once more in Claude Code. The two products keep separate token stores; this is expected. After the first `/mcp` flow you won't be asked again.

### Optional configuration

Open `/plugin config orbrey-ai@orbrey-ai-marketplace` to set:

- **`default_household_id`** — *(optional)* the household UUID you usually work with. Skip this and the worker auto-resolves the household from your active OAuth grants. For a persistent server-side default that survives plugin reinstalls, call the `households.set_default` MCP tool instead.

---

## Quick Start

```text
/plan-week                                       # 7-day meal plan + grocery sync
/grocery-tidy                                    # dedupe + aisle-order list
/chore-fairness                                  # see chore distribution
/orbrey-ai:routine-builder bedtime routine for 6yo  # interactive build
/orbrey-ai:calendar-conflict-finder next 14 days    # flag overlaps
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

The plugin binds the **orbrey** MCP server at `https://mcp.orbrey.com/mcp`, which exposes 21 tools across:

- **Discovery** — `households.list`, `households.set_default`
- **Tasks** — `tasks.list`, `tasks.set_status`, `tasks.delete_occurrence`
- **Lists** — `lists.list`, `lists.create`, `lists.add_item`, `lists.delete`
- **Calendar** — `calendar.list`, `calendar.create_event`, `calendar.sync_import`, `calendar.sync_export`
- **Recipes** — `recipes.list`, `recipes.create`, `recipes.delete`
- **Grocery** — `grocery.list`, `grocery.add_item`, `grocery.merge`
- **Rewards** — `rewards.wallets`, `rewards.adjust`

`household_id` is optional on every tool — the worker resolves it from your active OAuth grants (default household if set, otherwise the only authorised household). The bearer's grant scopes determine what's callable; paid scopes (`pantry:*`, `rewards:*`, `household:admin`) require an Orbrey Plus subscription on the resolved household.

For the authoritative tool list, see [`workers/orbrey-mcp/src/mcp/toolRegistry.ts`](https://github.com/orbrey/orbrey/blob/main/workers/orbrey-mcp/src/mcp/toolRegistry.ts) in the Orbrey monorepo.

---

## Hooks

Three hooks, all Node (`hooks/*.mjs`). They were bash + `jq` before 0.3.0, which
meant they silently did nothing on Windows, where `jq` is not installed.

| Hook | Event | Posture |
|---|---|---|
| `confirm-destructive` | PreToolUse on `*delete*` / `*merge*` / `*adjust*` | **Advisory** — describes what's about to be removed |
| `suggest-meal-slot` | PostToolUse on `recipes_create` | Advisory nudge |
| `gate-order` | PreToolUse on `mcp__claude-in-chrome__*` | **Blocking, fail-closed** — the grocery spend gate |

`gate-order` is the only one that can stop a call. It denies checkout until
`verify_cart.mjs` has passed, and then returns `ask` — never `allow` — so the
final spend always reaches a real permission prompt. Run `/reload-plugins` after
editing anything under `hooks/`; only `SKILL.md` files hot-reload.

---

## Grocery ordering (`kitchen-concierge`)

This is the one skill that spends money. What it does and does not do:

**How it reaches the store.** Through **your own Chrome**, via Claude in Chrome
(`claude --chrome`). It does not launch a headless browser, does not store your
retailer password, and **never logs in or handles a verification code** — if it
lands on a login, OTP or CAPTCHA screen it stops and hands control back. Your
bank and Woolworths both tell you never to share a one-time code; a tool that
asks for one is teaching you to be defrauded.

**How it pays.** It doesn't. Payment is the card saved on your retailer account,
held by the retailer under their PCI compliance. This plugin never sees, stores
or types a card number. **Never put card details in a config file** — PCI DSS
3.3.1 prohibits storing CVV outright, and card digits read into an AI agent's
context flow into transcripts and logs. If you want a hard financial ceiling,
make the card on file a Revolut or Wise virtual card with a monthly cap (both
available to an Australian individual, no ABN needed).

**What stops a mistake.** Three independent layers:
1. `verify_cart.mjs` asserts your per-order spend ceiling, per-item price caps
   and the household allergen list — in code, before checkout is reachable.
2. `gate-order` denies checkout unless that verification passed, is under 15
   minutes old, and matches the exact cart that was verified.
3. That gate returns `ask`, so you approve the real total at a real prompt.

Scheduled runs **never buy**. They plan, build the list, notify you, and stop.

**Allergies are a hard precondition.** Ordering refuses to run without a current
dietary profile covering every member (`/orbrey-ai:household-onboarder` writes
it). A scheduled run has nobody to ask, so it fails closed rather than guessing.

**Terms of service — read this.** Woolworths' site terms prohibit using "any
robot, spider... or other mechanism to retrieve or index any portion of the
Site". Driving your own authenticated browser with you approving each order is
materially different from scraping, but high-frequency automated ordering may
still be argued to breach those terms. The mitigation is that a human approves
every order — not that the clause stops applying. **Account suspension is a real
risk and it would hit your actual grocery account.** Decide with that in mind.

On native Windows there is no Bash sandbox — permission rules and these hooks
are the entire safety boundary.

---

## Conventions

- **Australian English** throughout (colour, organise, optimise, prioritise)
- **DD/MM/YYYY** dates
- **AUD** currency where reward amounts are surfaced
- **Markdown-first** outputs — copy-pasteable
- Skills never invent household data — they always call the MCP server first

---

## Disclaimer

This plugin issues **destructive calls** when you ask it to (recipe deletion, list deletion, task deletion, grocery merges, wallet adjustments). The destructive-confirm hook is advisory only — it describes what is about to happen, it does not block. Always review what a skill is about to do before approving the tool call.

`kitchen-concierge` additionally **spends real money** and carries a terms-of-service and account-suspension risk. See [Grocery ordering](#grocery-ordering-kitchen-concierge).

---

## License

MIT — see the marketplace root [`LICENSE`](../../LICENSE). Per-skill `LICENSE.txt` files are Apache 2.0.

This plugin is published independently of (and not affiliated with) any other Claude plugin marketplace.
