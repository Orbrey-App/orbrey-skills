#!/usr/bin/env node
/**
 * Runner for the `script_cases` tier of suite.yaml.
 *
 * These are the cases that need no browser, no credentials and no MCP — the
 * spend ceiling, the allergen block, and the checkout gate. They are the tests
 * whose absence let 0.2.0 ship a no-op safety layer, so they run headlessly and
 * belong in CI.
 *
 *   node evals/run-script-cases.mjs
 *
 * Exits non-zero if any case fails. Uses a scratch data dir so it never touches
 * real household state.
 */

import { mkdtempSync, writeFileSync, rmSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, '..');
const FIXTURES = join(HERE, 'fixtures');
const VERIFY = join(SKILL, 'scripts', 'verify_cart.mjs');
const GATE = join(SKILL, '..', '..', 'hooks', 'gate-order.mjs');

let DATA;
const results = [];

function setup() {
  DATA = mkdtempSync(join(tmpdir(), 'kc-eval-'));
  process.env.CLAUDE_PLUGIN_DATA = DATA;
}

function reset({ config = { max_total_aud: 150 }, profile = 'profile-tree-nuts.json', ageDays = 0 } = {}) {
  for (const f of ['pending-order.json', 'order-session.json', 'household-dietary-profiles.json', 'config.json']) {
    const p = join(DATA, f);
    if (existsSync(p)) rmSync(p);
  }
  if (config) writeFileSync(join(DATA, 'config.json'), JSON.stringify(config));
  if (profile) {
    const p = JSON.parse(readFileSync(join(FIXTURES, profile), 'utf8'));
    p.updated_at = new Date(Date.now() - ageDays * 86_400_000).toISOString();
    writeFileSync(join(DATA, 'household-dietary-profiles.json'), JSON.stringify(p));
  }
}

function runVerify(cartFixture, total) {
  try {
    const stdout = execFileSync(
      process.execPath,
      [VERIFY, '--cart', join(FIXTURES, cartFixture), '--total', String(total)],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: process.env }
    );
    return { code: 0, stdout, stderr: '' };
  } catch (err) {
    return { code: err.status ?? 99, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
  }
}

function runGate(hookInput) {
  const payload = typeof hookInput === 'string' ? hookInput : JSON.stringify(hookInput);
  try {
    const stdout = execFileSync(process.execPath, [GATE], {
      encoding: 'utf8',
      input: payload,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });
    return { code: 0, stdout };
  } catch (err) {
    return { code: err.status ?? 99, stdout: err.stdout ?? '' };
  }
}

function decisionOf(stdout) {
  if (!stdout.trim()) return null;
  try {
    return JSON.parse(stdout).hookSpecificOutput?.permissionDecision ?? null;
  } catch {
    return null;
  }
}

function check(id, ok, detail = '') {
  results.push({ id, ok, detail });
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${id}${ok || !detail ? '' : `\n          ${detail}`}`);
}

const CLICK = { tool_name: 'mcp__claude-in-chrome__click', tool_input: { text: 'Place order' } };

setup();
console.log(`Scratch data dir: ${DATA}\n`);

// --- spend ceiling ---------------------------------------------------------
console.log('Spend ceiling');

reset();
let r = runVerify('cart-clean.json', 71.4);
check('gate-1-total-under-ceiling', r.code === 0 && existsSync(join(DATA, 'pending-order.json')), `exit=${r.code}`);

reset();
r = runVerify('cart-clean.json', 150.01);
check(
  'gate-2-total-over-ceiling',
  r.code === 40 && !existsSync(join(DATA, 'pending-order.json')),
  `exit=${r.code} (want 40), marker written=${existsSync(join(DATA, 'pending-order.json'))}`
);

reset({ config: { max_total_aud: 500 } });
r = runVerify('cart-over-item-cap.json', 42.0);
check('gate-3-per-item-cap', r.code === 30, `exit=${r.code} (want 30)`);

// --- allergens -------------------------------------------------------------
console.log('\nAllergens');

reset();
r = runVerify('cart-allergen-alias.json', 50.0);
check('allergen-1-alias-match', r.code === 20 && /almond/i.test(r.stderr), `exit=${r.code} (want 20)`);

reset();
r = runVerify('cart-allergen-substituted.json', 50.0);
check('allergen-2-in-substitution', r.code === 20, `exit=${r.code} (want 20)`);

reset({ profile: null });
r = runVerify('cart-clean.json', 50.0);
check('allergen-3-fail-closed-missing-profile', r.code === 10, `exit=${r.code} (want 10)`);

reset({ ageDays: 120 });
r = runVerify('cart-clean.json', 50.0);
check('allergen-4-fail-closed-stale-profile', r.code === 10, `exit=${r.code} (want 10)`);

reset({ profile: 'profile-dislikes-mushrooms.json' });
r = runVerify('cart-with-mushrooms.json', 50.0);
check('allergen-5-dislike-does-not-block', r.code === 0, `exit=${r.code} (want 0 — dislikes must not block)`);

// --- substitution policy ---------------------------------------------------
console.log('\nSubstitution policy');

reset({ profile: 'profile-no-restrictions.json' });
r = runVerify('cart-substituted-deny.json', 50.0);
check('subs-1-deny-honoured', r.code === 50, `exit=${r.code} (want 50)`);

reset({ profile: 'profile-tree-nuts.json' });
r = runVerify('cart-substituted-allow.json', 50.0);
check('subs-2-life-threatening-overrides-allow', r.code === 50, `exit=${r.code} (want 50)`);

// --- checkout gate ---------------------------------------------------------
console.log('\nCheckout gate');

reset();
r = runGate(CLICK);
check('hook-1-no-session-passes-through', r.code === 0 && !r.stdout.trim(), `exit=${r.code} stdout=${r.stdout.slice(0, 60)}`);

writeFileSync(join(DATA, 'order-session.json'), JSON.stringify({ state: 'building' }));
r = runGate(CLICK);
check('hook-2-building-denies-checkout', decisionOf(r.stdout) === 'deny', `decision=${decisionOf(r.stdout)}`);

r = runGate({ tool_name: 'mcp__claude-in-chrome__click', tool_input: { text: 'Add to cart' } });
check('hook-3-building-allows-normal-clicks', r.code === 0 && !r.stdout.trim(), `stdout=${r.stdout.slice(0, 60)}`);

writeFileSync(join(DATA, 'order-session.json'), JSON.stringify({ state: 'verified' }));
r = runGate(CLICK);
check('hook-4-verified-without-marker-denies', decisionOf(r.stdout) === 'deny', `decision=${decisionOf(r.stdout)}`);

// Fresh, matching marker — the load-bearing case.
reset();
runVerify('cart-clean.json', 71.4);
const marker = JSON.parse(readFileSync(join(DATA, 'pending-order.json'), 'utf8'));
writeFileSync(
  join(DATA, 'order-session.json'),
  JSON.stringify({ state: 'verified', cart_hash: marker.cart_hash })
);
r = runGate(CLICK);
let d = decisionOf(r.stdout);
check(
  'hook-5-verified-asks-never-allows',
  d === 'ask' && /REAL grocery order/.test(r.stdout) && /71\.40/.test(r.stdout),
  `decision=${d} (MUST be "ask", never "allow")`
);

writeFileSync(
  join(DATA, 'order-session.json'),
  JSON.stringify({ state: 'verified', cart_hash: 'deadbeefdeadbeef' })
);
r = runGate(CLICK);
check('hook-6-mutated-cart-denies', decisionOf(r.stdout) === 'deny', `decision=${decisionOf(r.stdout)}`);

const stale = { ...marker, created_at: new Date(Date.now() - 20 * 60_000).toISOString() };
writeFileSync(join(DATA, 'pending-order.json'), JSON.stringify(stale));
writeFileSync(
  join(DATA, 'order-session.json'),
  JSON.stringify({ state: 'verified', cart_hash: marker.cart_hash })
);
r = runGate(CLICK);
check('hook-7-stale-marker-denies', decisionOf(r.stdout) === 'deny', `decision=${decisionOf(r.stdout)}`);

writeFileSync(join(DATA, 'order-session.json'), JSON.stringify({ state: 'building' }));
r = runGate('{not json');
check('hook-8-unparseable-input-fails-closed', decisionOf(r.stdout) === 'deny', `decision=${decisionOf(r.stdout)}`);

// --- report ----------------------------------------------------------------
const failed = results.filter((x) => !x.ok);
console.log(`\n${'='.repeat(52)}`);
console.log(`${results.length - failed.length}/${results.length} passed`);
rmSync(DATA, { recursive: true, force: true });

if (failed.length) {
  console.log(`\nFAILED: ${failed.map((f) => f.id).join(', ')}`);
  process.exit(1);
}
console.log('All script-tier safety cases pass.');
