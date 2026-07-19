#!/usr/bin/env node
/**
 * lint-skill-tools.mjs — cross-check every SKILL.md body against its frontmatter.
 *
 * Catches the two defects that shipped in 0.2.0 and went unnoticed:
 *
 *   1. Tools referenced in a skill body that are NOT granted in allowed-tools.
 *      meal-planner declared `Read Write Edit` and no MCP grants at all, while
 *      its body mandated recipes.list / calendar.list / grocery.list.
 *
 *   2. Tools granted in allowed-tools that DO NOT EXIST on the MCP server.
 *      kitchen-concierge declared pantry_list, meal_plan_week,
 *      meal_plan_sync_to_grocery and two more. None of them are real — they
 *      failed at dispatch, which nothing caught because nothing checked.
 *
 * The known-tool list below is the authority. Update it when the worker's tool
 * registry changes, and treat an addition as a deliberate act rather than a
 * convenience — a typo here reintroduces defect 2.
 *
 *   node scripts/lint-skill-tools.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'plugins', 'orbrey-ai', 'skills');

/** The orbrey MCP server's actual tool surface — 21 tools. See plugin README. */
const ORBREY_TOOLS = new Set([
  'households_list', 'households_set_default',
  'tasks_list', 'tasks_set_status', 'tasks_delete_occurrence',
  'lists_list', 'lists_create', 'lists_add_item', 'lists_delete',
  'calendar_list', 'calendar_create_event', 'calendar_sync_import', 'calendar_sync_export',
  'recipes_list', 'recipes_create', 'recipes_delete',
  'grocery_list', 'grocery_add_item', 'grocery_merge',
  'rewards_wallets', 'rewards_adjust',
]);

/** Non-orbrey MCP namespaces a skill may legitimately reference. */
const ALLOWED_NAMESPACES = ['scheduled-tasks', 'claude-in-chrome'];

let problems = 0;

function report(skill, kind, detail) {
  console.log(`  ${kind}  ${skill}: ${detail}`);
  problems += 1;
}

for (const skill of readdirSync(SKILLS)) {
  const path = join(SKILLS, skill, 'SKILL.md');
  if (!existsSync(path)) continue;

  // Normalise line endings — a CRLF file must not read as "no frontmatter".
  const src = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').replace(/^﻿/, '');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    report(skill, 'FAIL', 'no frontmatter');
    continue;
  }

  const [frontmatter, body] = [fm[1], src.slice(fm[0].length)];

  const granted = new Set(
    (frontmatter.match(/mcp__[a-z0-9_-]+__[a-z0-9_]+/gi) ?? []).map((t) => t.trim())
  );

  // --- defect 2: granted tools that do not exist -------------------------
  for (const tool of granted) {
    const m = tool.match(/^mcp__([a-z0-9-]+)__([a-z0-9_]+)$/i);
    if (!m) {
      report(skill, 'FAIL', `malformed tool name in allowed-tools: ${tool}`);
      continue;
    }
    const [, ns, name] = m;
    if (ns === 'orbrey' && !ORBREY_TOOLS.has(name)) {
      report(skill, 'FAIL', `allowed-tools grants NONEXISTENT tool: ${tool}`);
    } else if (ns !== 'orbrey' && !ALLOWED_NAMESPACES.includes(ns)) {
      report(skill, 'WARN', `unrecognised MCP namespace: ${tool}`);
    }
  }

  // --- defect 1: body references that are not granted ---------------------
  // Only count fully-qualified mcp__ references — bare prose like "grocery_list"
  // is ambiguous and would produce noise.
  const referenced = new Set(
    (body.match(/mcp__[a-z0-9_-]+__[a-z0-9_]+/gi) ?? []).map((t) => t.trim())
  );

  for (const tool of referenced) {
    if (!granted.has(tool)) {
      report(skill, 'FAIL', `body uses ${tool} but allowed-tools does not grant it`);
    }
  }
}

console.log('');
if (problems) {
  console.log(`${problems} problem(s) found.`);
  process.exit(1);
}
console.log('All skill tool declarations check out.');
