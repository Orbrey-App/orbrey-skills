#!/usr/bin/env bash
# Orbrey — PreToolUse hook for destructive MCP calls
#
# Fires on any orbrey MCP tool whose name contains "delete", "merge", or "adjust"
# (e.g. recipes.delete, lists.delete, tasks.delete_occurrence, grocery.merge,
# rewards.adjust). Surfaces a confirmation summary describing exactly what is
# about to be removed or moved before allowing the call through.
#
# This is a soft gate — it cannot block the call itself (Claude Code does not
# yet support interactive Yes/No prompts inside hooks), but it appends a clear
# advisory message to the systemMessage stream so the user sees what is about
# to happen and can interrupt mid-stream if needed.
#
# Exit codes:
#   0 — proceed (always; the gate is advisory, not blocking)
#   non-zero — would block (we don't use this; reserved for future hard gates)

set -euo pipefail

INPUT=$(cat)

# Graceful degradation if jq is missing.
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input // {}' 2>/dev/null)

# Only act on orbrey MCP tools.
case "$TOOL_NAME" in
  mcp__orbrey__*) ;;
  *) exit 0 ;;
esac

# Build a human summary of what's about to happen.
HOUSEHOLD_ID=$(echo "$TOOL_INPUT" | jq -r '.household_id // "<unknown>"' 2>/dev/null)
SUMMARY=""

case "$TOOL_NAME" in
  *recipes_delete*)
    RID=$(echo "$TOOL_INPUT" | jq -r '.recipe_id // "<missing>"')
    SUMMARY="About to ARCHIVE+DELETE recipe ${RID} from household ${HOUSEHOLD_ID}. This removes it from active lists; the row is permanently archived."
    ;;
  *lists_delete*)
    LID=$(echo "$TOOL_INPUT" | jq -r '.list_id // "<missing>"')
    SUMMARY="About to PERMANENTLY DELETE shared list ${LID} from household ${HOUSEHOLD_ID}. This cannot be undone."
    ;;
  *tasks_delete_occurrence*)
    OID=$(echo "$TOOL_INPUT" | jq -r '.occurrence_id // "<missing>"')
    SUMMARY="About to DELETE task occurrence ${OID} from household ${HOUSEHOLD_ID}. This removes a single instance — the recurring rule is unaffected."
    ;;
  *grocery_merge*)
    SRC=$(echo "$TOOL_INPUT" | jq -r '.source_item_id // "<missing>"')
    TGT=$(echo "$TOOL_INPUT" | jq -r '.target_item_id // "<missing>"')
    SUMMARY="About to MERGE grocery item ${SRC} into ${TGT} (household ${HOUSEHOLD_ID}). Source row will be removed; target keeps the combined quantity."
    ;;
  *rewards_adjust*)
    MID=$(echo "$TOOL_INPUT" | jq -r '.member_id // "<missing>"')
    AMT=$(echo "$TOOL_INPUT" | jq -r '.amount // 0')
    REASON=$(echo "$TOOL_INPUT" | jq -r '.reason // "MCP adjustment"')
    SUMMARY="About to ADJUST member ${MID}'s wallet by \$${AMT} (reason: ${REASON}, household ${HOUSEHOLD_ID}). This appears in the household audit log."
    ;;
  *)
    # Tool name didn't match a known destructive pattern — let it through silently.
    exit 0
    ;;
esac

# Emit a systemMessage so the user sees the intent before the call completes.
# JSON-encode safely.
printf '{"systemMessage": %s}\n' "$(printf '%s' "$SUMMARY" | jq -Rs '.')"

exit 0
