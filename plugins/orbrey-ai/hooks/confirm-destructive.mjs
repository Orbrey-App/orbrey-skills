#!/usr/bin/env node
/**
 * confirm-destructive.mjs — PreToolUse advisory on destructive orbrey MCP calls.
 *
 * Fires on any orbrey tool whose name contains delete, merge, or adjust, and
 * describes what is about to be removed or moved.
 *
 * Scope note: this one IS advisory. It surfaces intent on reversible-ish
 * household data (a recipe, a list row, a wallet adjustment) where blocking
 * every call would make the plugin unusable. It is deliberately weaker than
 * gate-order.mjs, which guards money and returns a real permission decision.
 * Do not copy this file's posture into anything that spends.
 *
 * Ported from bash because the original called `jq` and silently exited 0 when
 * jq was absent — which is the default on Windows, so it never ran there.
 */

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

let input;
try {
  input = JSON.parse(await readStdin());
} catch {
  process.exit(0); // advisory hook — never obstruct on a parse failure
}

const toolName = input.tool_name ?? '';
if (!toolName.startsWith('mcp__orbrey__')) process.exit(0);

const args = input.tool_input ?? {};
const household = args.household_id ?? '<unknown>';

function summarise() {
  if (toolName.includes('recipes_delete')) {
    return `About to ARCHIVE+DELETE recipe ${args.recipe_id ?? '<missing>'} from household ${household}. This removes it from active lists; the row is permanently archived.`;
  }
  if (toolName.includes('lists_delete')) {
    return `About to PERMANENTLY DELETE shared list ${args.list_id ?? '<missing>'} from household ${household}. This cannot be undone.`;
  }
  if (toolName.includes('tasks_delete_occurrence')) {
    return `About to DELETE task occurrence ${args.occurrence_id ?? '<missing>'} from household ${household}. This removes a single instance — the recurring rule is unaffected.`;
  }
  if (toolName.includes('grocery_merge')) {
    return `About to MERGE grocery item ${args.source_item_id ?? '<missing>'} into ${args.target_item_id ?? '<missing>'} (household ${household}). Source row will be removed; target keeps the combined quantity.`;
  }
  if (toolName.includes('rewards_adjust')) {
    return `About to ADJUST member ${args.member_id ?? '<missing>'}'s wallet by $${args.amount ?? 0} (reason: ${args.reason ?? 'MCP adjustment'}, household ${household}). This appears in the household audit log.`;
  }
  return null;
}

const summary = summarise();
if (!summary) process.exit(0);

process.stdout.write(JSON.stringify({ systemMessage: summary }));
