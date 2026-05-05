#!/usr/bin/env bash
# Orbrey — PostToolUse hook fired after recipes.create
#
# When a recipe is freshly added to the household library, surface a suggestion
# to slot it into the next available meal-plan day. Non-destructive — emits a
# systemMessage with a quick next-action chain and the new recipe id.
#
# Exit codes:
#   0 — always (advisory only)

set -euo pipefail

INPUT=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
case "$TOOL_NAME" in
  mcp__orbrey__recipes_create) ;;
  *) exit 0 ;;
esac

# Try to extract the new recipe id from the tool_response payload.
# Different MCP transports shape this differently — try a couple of common
# locations and fall back gracefully if none match.
RID=$(echo "$INPUT" | jq -r '
  (.tool_response.id
   // .tool_response.recipe_id
   // .tool_response.data.id
   // .tool_response[0].id
   // empty)
' 2>/dev/null)

TITLE=$(echo "$INPUT" | jq -r '
  (.tool_response.title
   // .tool_response.recipe.title
   // .tool_response.data.title
   // .tool_response[0].title
   // empty)
' 2>/dev/null)

if [ -z "$TITLE" ] && [ -z "$RID" ]; then
  # Couldn't identify the recipe — exit silently so we don't spam.
  exit 0
fi

LABEL="${TITLE:-recipe ${RID}}"

MESSAGE="Recipe \"${LABEL}\" added to your library. Suggested next steps:\n  - /plan-week — generate next week's plan with this recipe in scope\n  - /orbrey-ai:pantry-to-recipe — see if you can cook \"${LABEL}\" tonight from current pantry stock"

printf '{"systemMessage": %s}\n' "$(printf '%s' "$MESSAGE" | jq -Rs '.')"

exit 0
