#!/usr/bin/env bash
# Orbrey — PreToolUse hook for non-dry-run grocery checkout calls.
#
# Fires on Bash invocations of scripts/order_groceries.py that omit --dry-run,
# i.e. the call about to spend real money at a real grocer. Surfaces the
# adapter, mode, and cart file path so the user sees what's about to happen
# before the order is placed.
#
# Soft gate — advisory only. The kitchen-concierge skill itself drives the
# final go/no-go via AskUserQuestion in Phase 3.6; this hook is a second-layer
# safety net for cases where the call is initiated outside the skill flow.
#
# Exit codes:
#   0 — proceed (always; advisory)
#   non-zero — would block (unused)

set -euo pipefail

INPUT=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)

# Only act on Bash calls.
if [ "$TOOL_NAME" != "Bash" ]; then
  exit 0
fi

CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Only act on order_groceries.py invocations.
case "$CMD" in
  *order_groceries.py*) ;;
  *) exit 0 ;;
esac

# Skip if --dry-run is present.
case "$CMD" in
  *--dry-run*) exit 0 ;;
esac

# Skip if --list-adapters is present.
case "$CMD" in
  *--list-adapters*) exit 0 ;;
esac

# Extract adapter name (first non-flag arg after the script path).
ADAPTER=$(echo "$CMD" | sed -nE 's/.*order_groceries\.py[[:space:]]+([a-z_]+)[[:space:]].*/\1/p')
[ -z "$ADAPTER" ] && ADAPTER="<unknown>"

# Extract --mode value.
MODE=$(echo "$CMD" | sed -nE 's/.*--mode[[:space:]]+([a-z-]+).*/\1/p')
[ -z "$MODE" ] && MODE="click-and-collect"

# Extract cart file (first .json arg).
CART=$(echo "$CMD" | grep -oE '[^[:space:]]+\.json' | head -n 1)
[ -z "$CART" ] && CART="<missing>"

SUMMARY="About to PLACE a real grocery order via the '${ADAPTER}' adapter (${MODE}). Cart: ${CART}. The adapter will checkout the dry-run cart and charge the saved payment method. Interrupt now if this isn't expected."

printf '{"systemMessage": %s}\n' "$(printf '%s' "$SUMMARY" | jq -Rs '.')"

exit 0
