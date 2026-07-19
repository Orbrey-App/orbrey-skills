#!/usr/bin/env node
/**
 * suggest-meal-slot.mjs — PostToolUse nudge after a recipe is created.
 *
 * Purely advisory: suggests slotting the new recipe into the next open
 * meal-plan day. Exits silently when it cannot identify the recipe rather than
 * emitting a vague message.
 *
 * Ported from bash for the same reason as the other hooks — the `jq` dependency
 * meant it never fired on Windows.
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
  process.exit(0);
}

if (input.tool_name !== 'mcp__orbrey__recipes_create') process.exit(0);

// MCP transports shape the response differently — try the common locations.
const r = input.tool_response ?? {};
const first = Array.isArray(r) ? r[0] ?? {} : {};

const id = r.id ?? r.recipe_id ?? r.data?.id ?? first.id ?? null;
const title = r.title ?? r.recipe?.title ?? r.data?.title ?? first.title ?? null;

if (!id && !title) process.exit(0);

const label = title ?? `recipe ${id}`;

process.stdout.write(
  JSON.stringify({
    systemMessage:
      `Recipe "${label}" added to your library. Suggested next steps:\n` +
      `  - /plan-week — generate next week's plan with this recipe in scope\n` +
      `  - /orbrey-ai:pantry-to-recipe — see if you can cook "${label}" tonight from current pantry stock`,
  })
);
