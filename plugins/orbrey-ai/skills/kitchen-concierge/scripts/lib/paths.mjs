/**
 * Resolves the persistent data directory shared by the kitchen-concierge
 * scripts and the order gate hook.
 *
 * Everything mutable lives here — never under CLAUDE_PLUGIN_ROOT, which is
 * replaced when the plugin updates.
 */

import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

/**
 * CLAUDE_PLUGIN_DATA is the documented persistent location, but it is not
 * guaranteed to be set in every host (scheduled runs, older CLI versions,
 * direct `node` invocation during testing). Fall back to a stable path under
 * the user's home rather than writing into the plugin directory.
 */
export function dataDir() {
  const base =
    process.env.CLAUDE_PLUGIN_DATA ||
    join(homedir(), '.claude', 'orbrey-ai', 'kitchen-concierge');
  mkdirSync(base, { recursive: true });
  return base;
}

export const paths = {
  /** Written by verify_cart.mjs once a cart passes every assertion. */
  approvalMarker: () => join(dataDir(), 'pending-order.json'),
  /** Written by the skill at the start of an ordering run, removed at the end. */
  orderSession: () => join(dataDir(), 'order-session.json'),
  /** Written by household-onboarder, read fail-closed by the skills. */
  dietaryProfiles: () => join(dataDir(), 'household-dietary-profiles.json'),
  /** Setup answers — cadence, stores, max_total_aud, substitution policy. */
  config: () => join(dataDir(), 'config.json'),
  /** Append-only per-run audit log. */
  runsDir: () => join(dataDir(), 'runs'),
};

/** Minutes an approval marker stays valid before the cart must be re-verified. */
export const MARKER_TTL_MINUTES = 15;
