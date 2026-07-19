#!/usr/bin/env node
/**
 * verify_cart.mjs — the only place the spend ceiling and the allergen block are
 * actually enforced.
 *
 * A limit stated in a SKILL.md prompt is not a control. The same prompt
 * injection that redirects a purchase can override an instruction, so every
 * assertion that protects money or health lives here, in code, and the skill is
 * structurally unable to reach checkout without passing through it.
 *
 * Usage:
 *   node verify_cart.mjs --cart <cart.json> --total <aud> [--items <n>]
 *                        [--store <name>] [--mode click-and-collect|delivery]
 *
 * --total is the figure scraped from the retailer's review-order page, NOT a
 * figure computed by the agent. Comparing the agent's arithmetic against itself
 * proves nothing; comparing the retailer's own total against the user's
 * configured ceiling is the assertion that matters.
 *
 * Exit codes:
 *    0  all assertions passed; approval marker written
 *   10  preconditions unreadable (config, profile, cart) — fail closed
 *   20  allergen violation
 *   30  per-item price cap exceeded
 *   40  cart total exceeds max_total_aud
 *   50  substitution policy violation
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { paths } from './lib/paths.mjs';
import {
  collectRestrictions,
  checkItem,
  hasFailClosedRestriction,
  NO_SUBSTITUTION_TIERS,
} from './lib/allergens.mjs';

const EXIT = {
  OK: 0,
  PRECONDITION: 10,
  ALLERGEN: 20,
  ITEM_PRICE: 30,
  TOTAL: 40,
  SUBSTITUTION: 50,
};

const PROFILE_MAX_AGE_DAYS = 90;

function fail(code, message, detail) {
  console.error(`VERIFY FAILED (${code}): ${message}`);
  if (detail) console.error(detail);
  process.exit(code);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    args[key] = next && !next.startsWith('--') ? (i += 1, next) : 'true';
  }
  return args;
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    fail(EXIT.PRECONDITION, `could not read ${label} at ${path}`, err.message);
  }
}

const args = parseArgs(process.argv.slice(2));

if (!args.cart || !args.total) {
  fail(EXIT.PRECONDITION, 'usage: verify_cart.mjs --cart <path> --total <aud>');
}

const scrapedTotal = Number(args.total);
if (!Number.isFinite(scrapedTotal) || scrapedTotal < 0) {
  fail(EXIT.PRECONDITION, `--total must be a non-negative number, got "${args.total}"`);
}

const cart = readJson(args.cart, 'cart');
const config = readJson(paths.config(), 'config (run `setup` first)');

// ---------------------------------------------------------------------------
// Precondition: the spend ceiling must exist. There is no default — a missing
// ceiling means setup never ran, and guessing one on the user's behalf would
// invent an authorisation they never gave.
// ---------------------------------------------------------------------------

const maxTotal = Number(config.max_total_aud);
if (!Number.isFinite(maxTotal) || maxTotal <= 0) {
  fail(
    EXIT.PRECONDITION,
    'config.max_total_aud is missing or invalid — re-run `/orbrey-ai:kitchen-concierge setup`'
  );
}

// ---------------------------------------------------------------------------
// Precondition: dietary profiles. Fail closed.
//
// If any member carries a life-threatening or medical restriction and we cannot
// read a current profile, we abort. Ordering food for someone whose allergy
// record we could not load is the failure mode this whole module exists for.
// ---------------------------------------------------------------------------

let profile;
try {
  profile = JSON.parse(readFileSync(paths.dietaryProfiles(), 'utf8'));
} catch (err) {
  fail(
    EXIT.PRECONDITION,
    'dietary profile is missing or unreadable — refusing to order food without it',
    `Expected at ${paths.dietaryProfiles()}\n` +
      'Run /orbrey-ai:household-onboarder for each member to create it.\n' +
      `(${err.message})`
  );
}

const updatedAt = Date.parse(profile.updated_at ?? '');
const ageDays = Number.isFinite(updatedAt)
  ? (Date.now() - updatedAt) / 86_400_000
  : Infinity;

if (ageDays > PROFILE_MAX_AGE_DAYS && hasFailClosedRestriction(profile)) {
  fail(
    EXIT.PRECONDITION,
    `dietary profile is ${Math.round(ageDays)} days old (limit ${PROFILE_MAX_AGE_DAYS}) ` +
      'and the household has life-threatening or medical restrictions',
    'Re-confirm the profile with /orbrey-ai:household-onboarder before ordering.'
  );
}

const restrictions = collectRestrictions(profile);

// ---------------------------------------------------------------------------
// Assertion 1 — allergens. Runs first: no price is worth skipping this for.
// ---------------------------------------------------------------------------

const allergenViolations = [];
for (const item of cart.items ?? []) {
  allergenViolations.push(
    ...checkItem(
      {
        requestedName: item.name,
        productTitle: item.matched_product ?? null,
        substitutionNote: item.substitution_note ?? null,
      },
      restrictions
    )
  );
}

if (allergenViolations.length) {
  const lines = allergenViolations.map(
    (v) =>
      `  [${v.tier}] "${v.item}"${v.product ? ` → ${v.product}` : ''} ` +
      `matches ${v.member}'s restriction on ${v.ingredient} (matched "${v.matchedTerm}")` +
      (v.crossContaminationRisk ? ' — cross-contamination risk flagged' : '')
  );
  fail(
    EXIT.ALLERGEN,
    `${allergenViolations.length} line item(s) violate a household dietary restriction`,
    lines.join('\n')
  );
}

// ---------------------------------------------------------------------------
// Assertion 2 — substitution policy.
//
// A life-threatening or medical restriction forbids blind substitution outright,
// regardless of what the cart's own policy says. The retailer swapping in a
// "similar product" is exactly how an allergen reaches the table.
// ---------------------------------------------------------------------------

const substitutionViolations = [];
const householdForbidsSubstitution = restrictions.some((r) =>
  NO_SUBSTITUTION_TIERS.has(r.tier)
);

for (const item of cart.items ?? []) {
  if (!item.substituted) continue;
  if (item.substitution === 'deny') {
    substitutionViolations.push(
      `  "${item.name}" was substituted but its policy is "deny"`
    );
  } else if (householdForbidsSubstitution) {
    substitutionViolations.push(
      `  "${item.name}" was substituted, but the household has a life-threatening ` +
        'or medical restriction — substitutions require human review'
    );
  }
}

if (substitutionViolations.length) {
  fail(
    EXIT.SUBSTITUTION,
    `${substitutionViolations.length} substitution(s) are not permitted`,
    substitutionViolations.join('\n')
  );
}

// ---------------------------------------------------------------------------
// Assertion 3 — per-item price caps.
// ---------------------------------------------------------------------------

const overCap = (cart.items ?? []).filter(
  (item) =>
    item.max_price_aud != null &&
    item.unit_price_aud != null &&
    Number(item.unit_price_aud) > Number(item.max_price_aud)
);

if (overCap.length) {
  fail(
    EXIT.ITEM_PRICE,
    `${overCap.length} item(s) exceed their per-item price cap`,
    overCap
      .map(
        (i) =>
          `  "${i.name}" $${Number(i.unit_price_aud).toFixed(2)} > cap $${Number(
            i.max_price_aud
          ).toFixed(2)}`
      )
      .join('\n')
  );
}

// ---------------------------------------------------------------------------
// Assertion 4 — the cart total against the user's configured ceiling.
// ---------------------------------------------------------------------------

if (scrapedTotal > maxTotal) {
  fail(
    EXIT.TOTAL,
    `cart total $${scrapedTotal.toFixed(2)} exceeds your ceiling of $${maxTotal.toFixed(2)} AUD`,
    'Remove items, or raise the ceiling via /orbrey-ai:kitchen-concierge setup.\n' +
      'Do not work around this by splitting the order.'
  );
}

// ---------------------------------------------------------------------------
// All assertions passed — write the approval marker.
//
// The marker records a hash of the exact cart that was verified. gate-order.mjs
// re-reads it at checkout so a cart mutated after verification cannot pass.
// ---------------------------------------------------------------------------

const cartHash = createHash('sha256')
  .update(JSON.stringify(cart.items ?? []))
  .digest('hex')
  .slice(0, 16);

const marker = {
  cart_hash: cartHash,
  total_aud: scrapedTotal,
  item_count: (cart.items ?? []).length,
  created_at: new Date().toISOString(),
  store: args.store ?? cart.store_id ?? null,
  mode: args.mode ?? cart.delivery_mode ?? null,
  max_total_aud: maxTotal,
  verified_members: (profile.members ?? []).length,
};

writeFileSync(paths.approvalMarker(), JSON.stringify(marker, null, 2), 'utf8');

console.log('--- CART VERIFIED ---');
console.log(`Items:        ${marker.item_count}`);
console.log(`Total:        $${scrapedTotal.toFixed(2)} AUD (ceiling $${maxTotal.toFixed(2)})`);
console.log(`Allergens:    checked against ${restrictions.length} restriction(s) across ${marker.verified_members} member(s)`);
console.log(`Cart hash:    ${cartHash}`);
console.log('');
console.log('Approval marker written. The checkout gate will now prompt for your confirmation.');
process.exit(EXIT.OK);
