/**
 * Allergen matching against the household dietary profile.
 *
 * This is the module that decides whether a grocery line item is safe to buy.
 * It is deliberately conservative: it matches on substrings and declared
 * aliases, and it treats "I could not tell" as "unsafe".
 */

/** Restriction tiers, most severe first. Order matters — see BLOCKING_TIERS. */
export const TIERS = [
  'life_threatening',
  'medical_avoid',
  'ethical_religious',
  'dislike',
];

/**
 * Tiers that block a purchase outright. `ethical_religious` blocks the product
 * too, but a missing profile only warns for it — see FAIL_CLOSED_TIERS.
 */
export const BLOCKING_TIERS = new Set([
  'life_threatening',
  'medical_avoid',
  'ethical_religious',
]);

/**
 * Tiers where absent or stale profile data must abort the run rather than
 * proceed. Getting this wrong risks anaphylaxis, so it fails closed.
 */
export const FAIL_CLOSED_TIERS = new Set(['life_threatening', 'medical_avoid']);

/** Tiers that forbid accepting a substitution, no matter the cart policy. */
export const NO_SUBSTITUTION_TIERS = new Set([
  'life_threatening',
  'medical_avoid',
]);

function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Every search term for one restriction: the ingredient plus its aliases.
 *
 * aliases[] is load-bearing. Retailer product titles say "almond meal", never
 * "tree nuts" — matching on the ingredient name alone misses the actual
 * product on the shelf.
 */
function termsFor(restriction) {
  const terms = [restriction.ingredient, ...(restriction.aliases ?? [])];
  return terms.map(normalise).filter((t) => t.length >= 3);
}

/**
 * Collect every blocking restriction across all members, tagged with who it
 * belongs to so the abort message can name them.
 */
export function collectRestrictions(profile) {
  const out = [];
  for (const member of profile.members ?? []) {
    for (const restriction of member.restrictions ?? []) {
      if (!BLOCKING_TIERS.has(restriction.tier)) continue;
      out.push({
        ...restriction,
        member: member.display_name ?? member.member_id ?? 'unknown member',
      });
    }
  }
  return out;
}

/**
 * Check one line item against every blocking restriction.
 *
 * `text` should be everything known about what will actually be bought — the
 * requested name, the matched product title, and any substitution note. A
 * substitution is where allergens sneak in, so it must be included.
 *
 * Returns an array of violations (empty means clear).
 */
export function checkItem({ requestedName, productTitle, substitutionNote }, restrictions) {
  const haystack = normalise(
    [requestedName, productTitle, substitutionNote].filter(Boolean).join(' ')
  );
  const violations = [];

  for (const restriction of restrictions) {
    for (const term of termsFor(restriction)) {
      // Word-boundary-ish match on the normalised string. Substring matching is
      // intentional: "almondmilk" and "almond milk" must both trip "almond".
      if (haystack.includes(term)) {
        violations.push({
          tier: restriction.tier,
          ingredient: restriction.ingredient,
          matchedTerm: term,
          member: restriction.member,
          crossContaminationRisk: Boolean(restriction.cross_contamination_risk),
          item: requestedName,
          product: productTitle ?? null,
        });
        break; // one hit per restriction is enough
      }
    }
  }

  return violations;
}

/**
 * True when the profile carries any restriction that must abort the run rather
 * than proceed on missing/stale data.
 */
export function hasFailClosedRestriction(profile) {
  return (profile.members ?? []).some((member) =>
    (member.restrictions ?? []).some((r) => FAIL_CLOSED_TIERS.has(r.tier))
  );
}
