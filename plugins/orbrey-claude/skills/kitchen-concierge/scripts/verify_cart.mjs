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
 *   node verify_cart.mjs --cart <cart.json> --total <aud> [--data-dir <path>]
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
import { paths, setDataDirectory } from './lib/paths.mjs';
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
const ROSTER_MAX_AGE_MINUTES = 15;

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

if (args['data-dir'] && args['data-dir'] !== 'true') {
  setDataDirectory(args['data-dir']);
}

if (!args.cart || !args.total) {
  fail(EXIT.PRECONDITION, 'usage: verify_cart.mjs --cart <path> --total <aud> [--data-dir <path>]');
}

const scrapedTotal = Number(args.total);
if (!Number.isFinite(scrapedTotal) || scrapedTotal < 0) {
  fail(EXIT.PRECONDITION, `--total must be a non-negative number, got "${args.total}"`);
}

const cart = readJson(args.cart, 'cart');
if (!cart || typeof cart !== 'object' || Array.isArray(cart) || !Array.isArray(cart.items)) {
  fail(EXIT.PRECONDITION, 'cart must be a JSON object with an items array');
}
const config = readJson(paths.config(), 'config (run `setup` first)');
if (!config || typeof config !== 'object' || Array.isArray(config)) {
  fail(EXIT.PRECONDITION, 'config is not a JSON object — re-run Kitchen Concierge setup');
}

// ---------------------------------------------------------------------------
// Precondition: the spend ceiling must exist. There is no default — a missing
// ceiling means setup never ran, and guessing one on the user's behalf would
// invent an authorisation they never gave.
// ---------------------------------------------------------------------------

const maxTotal = Number(config.max_total_aud);
if (!Number.isFinite(maxTotal) || maxTotal <= 0) {
  fail(
    EXIT.PRECONDITION,
    'config.max_total_aud is missing or invalid — re-run `/orbrey:kitchen-concierge setup`'
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
      'Use Kitchen Concierge setup to create a profile for every current member.\n' +
      `(${err.message})`
  );
}

if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
  fail(EXIT.PRECONDITION, 'dietary profile is not a JSON object');
}
const roster = readJson(paths.authorisedRoster(), 'fresh authorised member roster (refresh with members_list before ordering)');
if (!roster || typeof roster !== 'object' || Array.isArray(roster)) {
  fail(EXIT.PRECONDITION, 'authorised member roster is not a JSON object');
}
const rosterRefreshedAt = Date.parse(roster.refreshed_at ?? '');
const rosterAgeMinutes = (Date.now() - rosterRefreshedAt) / 60_000;
if (!Number.isFinite(rosterAgeMinutes) || rosterAgeMinutes < 0 || rosterAgeMinutes > ROSTER_MAX_AGE_MINUTES) {
  fail(EXIT.PRECONDITION, 'authorised member roster is missing a valid, fresh timestamp', 'Call members_list and refresh authorised-roster.json immediately before cart verification.');
}

const rosterIds = Array.isArray(roster.member_ids) ? roster.member_ids : [];
const profileIds = Array.isArray(profile.members)
  ? profile.members.map((member) => member && typeof member === 'object' ? member.member_id : undefined)
  : [];
const validIds = (ids) => ids.length > 0
  && ids.every((id) => typeof id === 'string' && id.trim().length > 0)
  && new Set(ids).size === ids.length;
if (!validIds(rosterIds) || !validIds(profileIds)) {
  fail(EXIT.PRECONDITION, 'authorised roster or dietary profile has missing or duplicate member IDs', 'Use Kitchen Concierge setup to check every current member.');
}
const sortedRosterIds = [...rosterIds].sort();
const sortedProfileIds = [...profileIds].sort();
if (sortedRosterIds.length !== sortedProfileIds.length || sortedRosterIds.some((id, index) => id !== sortedProfileIds[index])) {
  fail(EXIT.PRECONDITION, 'current members_list roster does not match the local dietary profile', 'Review the member IDs and food information in Kitchen Concierge setup; do not guess or order until they match.');
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
    'Re-confirm the local profile in Kitchen Concierge setup before ordering.'
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
    'Remove items, or raise the ceiling via /orbrey:kitchen-concierge setup.\n' +
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
