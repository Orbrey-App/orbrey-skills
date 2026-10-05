# Orbrey Plugin for Claude Code

Orbrey connects Claude Code to the household selected during Orbrey authorisation. Its 12 skills, 3 agents, and 6 commands help with meal planning, household tasks and routines, shared groceries, recipes, calendars, pantry inventory, and rewards. It uses the hosted Orbrey MCP server and only the household and scopes authorised for that connection.

The separate ChatGPT package is [`../orbrey-openai`](../orbrey-openai). It shares the hosted MCP server and portable skills, but excludes Claude Code commands, agents, hooks, and Chrome-based grocery ordering.

## Skills

| Skill | Purpose |
|---|---|
| `meal-planner` | Draft meal plans from saved recipes and returned household context. Review the proposed grocery changes before writing them. |
| `grocery-organizer` | Review shared grocery items and propose duplicate merges; destructive changes require confirmation. |
| `chore-rotator` | Suggest a task rotation using returned member and task data; do not infer ages, effort scores, or reward values. |
| `routine-builder` | Create supported recurring task occurrences. Orbrey recurrence uses dates and day-part buckets; it does not store exact times or task dependencies. |
| `calendar-conflict-finder` | Review returned calendar events for overlapping dates and times; do not infer travel time or events outside the connected scope. |
| `family-week-planner` | Assemble a week view from available meal, task, and calendar data, noting missing sources. |
| `reward-strategist` | Explain reward options and returned wallet balances in Orbrey gems; wallet adjustments need explicit confirmation and may be plan-gated. |
| `pantry-to-recipe` | Match saved recipes to returned pantry inventory and show the ingredient gaps. |
| `household-onboarder` | Guide a user through checking household setup and explain which steps must be completed in the Orbrey app; it cannot create members or change permissions. |
| `recurring-task-author` | Translate a request into the supported recurrence fields and confirm before creating tasks; unsupported exceptions and exact times are not represented. |
| `kitchen-concierge` | Claude Code-only, optional workflow that uses the user's Chrome session to prepare a grocery order; every checkout requires a human decision. |
| `live-artifact-builder` | Build interactive HTML artifacts from user-provided or authorised household context. |

## Agents

| Agent | Purpose |
|---|---|
| `household-curator` | Review current household data returned by available tools and surface actionable findings without inventing missing history or dates. |
| `meal-plan-orchestrator` | Coordinate meal planning with the available pantry, grocery, and calendar tools. |
| `routine-coach` | Help a member review today's returned tasks; task completion uses Orbrey's configured task reward behaviour. |

## Commands

| Command | Purpose |
|---|---|
| `/plan-week` | Start a seven-day meal-planning workflow. |
| `/orbrey-ai:kitchen-concierge` | Run its setup, planning, approval, or status flow. It is Claude Code-only. |
| `/grocery-tidy` | Review and organise the current shared grocery list. |
| `/chore-fairness` | Summarise returned task distribution and suggest possible changes. |
| `/family-digest` | Request a household summary from available tools. |
| `/recipe-from-url <url>` | Explain the supported in-app import flow; the MCP does not parse recipe URLs. |
| `/next-up` | Show upcoming returned tasks and calendar events. |

## Installation

```text
/plugin marketplace add orbrey/orbrey-ai-marketplace
/plugin install orbrey-ai@orbrey-ai-marketplace
```

The bundled MCP server is `https://mcp.orbrey.com/`. On first use, run `/mcp` and complete Claude Code's OAuth flow. Claude Code keeps its authorisation separate from Claude.ai.

Each connection is authorised for one household. Re-authorise to change households; there is no household discovery or default-household selector tool.

## Tool and data boundaries

The current MCP registry exposes 63 tools. The [tool inventory](https://github.com/Orbrey-App/orbrey-mcp/blob/main/docs/tool-inventory.md) lists their scopes, read/write behavior, confirmation gates, and MCP App resources. The available tool list is filtered by the current connection's granted scopes. Use returned records and tool descriptions as the source of truth. `household_id` is optional for many tools; supplying a different household ID does not switch the authorisation. Some meal-planning, pantry, and rewards tools may require Orbrey Plus.

Rewards are denominated in gems. Task completion applies the configured task reward automatically; wallet adjustments are separate, consequential actions and require explicit user confirmation. Grocery and shared-list tools update Orbrey records only; they do not search retailers or purchase goods.

The `kitchen-concierge` skill is separate and uses the user's own Chrome session. It keeps its dietary profile on the Claude device, rebuilds the cart before checkout, applies a code-enforced order limit, and requires a human checkout decision. It is not included in the ChatGPT package. Retailer terms place restrictions on site use, and do not establish permission for browser automation. Read the skill's disclosure and the current [Woolworths terms](https://www.woolworths.com.au/shop/services/terms-and-conditions) or [Coles website terms](https://www.coles.com.au/important-information/terms/website-terms-conditions) before enabling it.

## Safety hooks

The plugin includes three Node.js hooks: an advisory prompt for destructive tool calls, an advisory recipe reminder, and a fail-closed checkout gate for Kitchen Concierge. Only the checkout gate blocks a tool call. The final checkout still requires a Claude permission prompt.

## Development

- Skills live under `skills/`.
- Agent definitions live under `agents/`.
- Commands live under `commands/`.
- The separate portable ChatGPT package is `../orbrey-openai/`.
