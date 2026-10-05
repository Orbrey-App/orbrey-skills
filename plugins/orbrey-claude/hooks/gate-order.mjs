#!/usr/bin/env node
/**
 * gate-order.mjs — PreToolUse gate on the grocery checkout action.
 *
 * ============================================================================
 * THIS HOOK RETURNS "ask", NEVER "allow". DO NOT "OPTIMISE" THAT AWAY.
 * ============================================================================
 *
 * The approval marker this hook checks is a file the agent itself can write.
 * It proves that verify_cart.mjs ran and the cart passed its assertions. It
 * does NOT prove a human agreed to spend the money. Those are different claims.
 *
 * Returning "allow" on a valid marker would let the agent satisfy its own spend
 * authorisation end to end, with no human in the loop at any point — which is
 * precisely the control this file exists to prevent. The marker's job is to
 * force the verification step and to put the real total in front of the user;
 * the permission prompt's job is to get consent. Collapsing the two silently
 * removes the second one.
 *
 * A hook `ask` is floored at a real prompt — it cannot be auto-accepted by
 * permission mode. That is the property we are buying here.
 *
 * ---------------------------------------------------------------------------
 * Why Node and not bash: the previous version of this gate was a bash script
 * that called `jq`, and silently `exit 0`-ed when jq was absent. jq is not
 * installed on a stock Windows box, so the gate emitted nothing and nobody
 * noticed. Node ships with the plugin's toolchain and needs no shell.
 *
 * Failure policy: this hook fails CLOSED. If it cannot parse its input, cannot
 * read the marker, or hits an unexpected error during an active order session,
 * it denies. A gate that errors open is not a gate.
 * ---------------------------------------------------------------------------
 */

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { paths, MARKER_TTL_MINUTES } from '../skills/kitchen-concierge/scripts/lib/paths.mjs';

/** Emit a PreToolUse decision and exit. */
function decide(permissionDecision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision,
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

/** Stand aside — this call is none of our business. */
function passThrough() {
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const raw = await readStdin();

let input;
try {
  input = JSON.parse(raw);
} catch {
  // We could not read the hook payload. If an order session is active we cannot
  // tell whether this is the checkout click, so we deny.
  if (existsSync(paths.orderSession())) {
    decide(
      'deny',
      'Order gate could not parse the tool payload during an active grocery order. ' +
        'Denying rather than guessing. Re-run the order step.'
    );
  }
  passThrough();
}

// ---------------------------------------------------------------------------
// Is a kitchen-concierge ordering run in progress?
//
// Outside one, the user is just browsing and every claude-in-chrome call is
// their own business. We only gate inside a session we started.
// ---------------------------------------------------------------------------

if (!existsSync(paths.orderSession())) passThrough();

let session;
try {
  session = JSON.parse(readFileSync(paths.orderSession(), 'utf8'));
} catch (err) {
  decide(
    'deny',
    `Order gate could not read the order session file (${err.message}). ` +
      'Denying rather than proceeding with an unknown order state.'
  );
}

// ---------------------------------------------------------------------------
// State machine.
//
//   building  — agent is adding items to the cart. Browser actions pass, but a
//               checkout-looking action is denied: verify_cart.mjs has not run.
//   verified  — verify_cart.mjs has passed. The NEXT interaction is the
//               checkout click, so it gets "ask" with the real total.
//
// The "verified → next action is checkout" transition is deterministic and does
// not depend on recognising a button. The text heuristic below is a second,
// independent layer for the `building` state, where we do have to guess.
// ---------------------------------------------------------------------------

const CHECKOUT_PATTERNS = [
  /place\s*order/i,
  /pay\s*now/i,
  /complete\s*(the\s*)?order/i,
  /submit\s*(the\s*)?order/i,
  /confirm\s*(and\s*)?pay/i,
  /confirm\s*(the\s*)?order/i,
  /proceed\s*to\s*pay/i,
  /buy\s*now/i,
];

const toolInputText = JSON.stringify(input.tool_input ?? {});
const looksLikeCheckout = CHECKOUT_PATTERNS.some((p) => p.test(toolInputText));

if (session.state === 'building') {
  if (looksLikeCheckout) {
    decide(
      'deny',
      'This looks like a checkout action, but the cart has not been verified yet. ' +
        'Run scripts/verify_cart.mjs with the review-page total first — it checks the ' +
        'spend ceiling and the household allergen list. Do not click through to payment ' +
        'without it.'
    );
  }
  passThrough();
}

if (session.state !== 'verified') {
  decide(
    'deny',
    `Order gate saw an unrecognised session state "${session.state}". Denying. ` +
      'Restart the order step.'
  );
}

// ---------------------------------------------------------------------------
// state === 'verified' — the approval marker must be present, fresh, and match
// the cart that was actually verified.
// ---------------------------------------------------------------------------

if (!existsSync(paths.approvalMarker())) {
  decide(
    'deny',
    'The order session is marked verified but no approval marker exists. ' +
      'Re-run scripts/verify_cart.mjs before attempting checkout.'
  );
}

let marker;
try {
  marker = JSON.parse(readFileSync(paths.approvalMarker(), 'utf8'));
} catch (err) {
  decide('deny', `Approval marker is unreadable (${err.message}). Re-run verify_cart.mjs.`);
}

const ageMinutes = (Date.now() - Date.parse(marker.created_at)) / 60_000;

if (!Number.isFinite(ageMinutes)) {
  decide('deny', 'Approval marker has no valid timestamp. Re-run verify_cart.mjs.');
}

if (ageMinutes > MARKER_TTL_MINUTES) {
  decide(
    'deny',
    `Approval marker is ${Math.round(ageMinutes)} minutes old (limit ${MARKER_TTL_MINUTES}). ` +
      'Prices and stock may have moved. Re-run verify_cart.mjs against a fresh review-page total.'
  );
}

// The session records the cart hash it expects. If the agent rebuilt or mutated
// the cart after verification, the hashes diverge and we deny.
if (session.cart_hash && session.cart_hash !== marker.cart_hash) {
  decide(
    'deny',
    'The cart changed after it was verified (hash mismatch). Re-run verify_cart.mjs ' +
      'against the current cart before checking out.'
  );
}

// ---------------------------------------------------------------------------
// Everything checks out. Hand the decision to the human, with the number that
// matters in front of them.
//
// Again: "ask", not "allow". See the header comment.
// ---------------------------------------------------------------------------

const total = Number(marker.total_aud).toFixed(2);
const ceiling = Number(marker.max_total_aud).toFixed(2);

decide(
  'ask',
  `About to place a REAL grocery order.\n\n` +
    `  Total:  $${total} AUD (your ceiling: $${ceiling})\n` +
    `  Items:  ${marker.item_count}\n` +
    `  Store:  ${marker.store ?? 'unknown'}\n` +
    `  Mode:   ${marker.mode ?? 'unknown'}\n\n` +
    `Cart verified ${Math.round(ageMinutes)} min ago against ${marker.verified_members} ` +
    `household dietary profile(s). Approving this charges your saved payment method.`
);
