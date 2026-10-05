#!/usr/bin/env node
/**
 * confirm-destructive.mjs — PreToolUse advisory on destructive orbrey MCP calls.
 *
 * Fires on selected Orbrey tools whose name contains delete or merge, and
 * describes what is about to be removed or moved.
 *
 * Scope note: this one IS advisory. It surfaces intent on reversible-ish
 * household data (a recipe or a list) where blocking
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
const toolSuffix = toolName.slice(toolName.lastIndexOf('__') + 2);
const handledTools = new Set([
  'recipes_delete_items',
  'lists_delete_lists',
  'tasks_delete_occurrences',
  'tasks_delete_items',
  'calendar_delete_events',
  'grocery_delete_items',
  'grocery_delete_lists',
  'pantry_delete_items',
  'grocery_merge',
  'pantry_merge',
]);
if (!handledTools.has(toolSuffix)) process.exit(0);

const args = input.tool_input ?? {};
const household = args.household_id ?? '<unknown>';
const ids = (key) => Array.isArray(args[key]) ? args[key].join(', ') : '<missing>';
const itemIds = (key) => Array.isArray(args.items)
  ? args.items.map((item) => item?.[key]).filter(Boolean).join(', ') || '<missing>'
  : '<missing>';

function summarise() {
  if (toolSuffix === 'recipes_delete_items') {
    return `About to ARCHIVE+DELETE recipes ${itemIds('recipe_id')} from household ${household}. They can be restored from Recently Deleted for 30 days.`;
  }
  if (toolSuffix === 'lists_delete_lists') {
    return `About to archive shared lists ${itemIds('list_id')} from household ${household}. They can be restored from Recently Deleted for 30 days.`;
  }
  if (toolSuffix === 'tasks_delete_occurrences') {
    return `About to permanently skip task occurrences ${ids('occurrence_ids')} in household ${household}. Their recurring tasks are unaffected.`;
  }
  if (toolSuffix === 'tasks_delete_items') {
    return `About to archive tasks ${itemIds('task_id')} from household ${household}. They can be restored from Recently Deleted for 30 days.`;
  }
  if (toolSuffix === 'calendar_delete_events') {
    return `About to archive calendar events ${itemIds('event_id')} from household ${household}. They can be restored from Recently Deleted for 30 days.`;
  }
  if (toolSuffix === 'grocery_delete_items' || toolSuffix === 'pantry_delete_items') {
    return `About to remove ${toolSuffix.startsWith('grocery') ? 'grocery' : 'pantry'} items ${ids('item_ids')} from household ${household}.`;
  }
  if (toolSuffix === 'grocery_delete_lists') {
    return `About to archive grocery lists ${itemIds('list_id')} and their items from household ${household}. They can be restored from Recently Deleted for 30 days.`;
  }
  if (toolSuffix === 'grocery_merge' || toolSuffix === 'pantry_merge') {
    const category = toolSuffix === 'grocery_merge' ? 'grocery' : 'pantry';
    return `About to MERGE ${category} item ${args.source_item_id ?? '<missing>'} into ${args.target_item_id ?? '<missing>'} (household ${household}). Source row will be removed; target keeps the combined quantity.`;
  }
  return null;
}

const summary = summarise();
if (!summary) process.exit(0);

process.stdout.write(JSON.stringify({ systemMessage: summary }));
