#!/usr/bin/env node
/**
 * check-versions.mjs
 *
 * Enforces that every plugin listed in `.claude-plugin/marketplace.json`
 * declares the same `version` as its own `.claude-plugin/plugin.json`.
 *
 * Why: Claude Code's update logic for relative-path plugins reads
 * `plugin.json` as the source of truth and silently wins over whatever
 * is declared in the marketplace entry. If the two drift, published
 * version bumps can appear to "do nothing" on end-user machines.
 *
 * Usage:
 *   node scripts/check-versions.mjs
 *
 * Exit codes:
 *   0 — all versions in sync
 *   1 — mismatch, missing file, or parse error
 */

import { readFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), "..");

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const marketplacePath = join(repoRoot, ".claude-plugin", "marketplace.json");

let marketplace;
try {
  marketplace = JSON.parse(await readFile(marketplacePath, "utf8"));
} catch (err) {
  console.error(red(`✗ Failed to read ${marketplacePath}: ${err.message}`));
  process.exit(1);
}

if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
  console.error(red("✗ marketplace.json has no plugins array or it is empty"));
  process.exit(1);
}

const pluginRoot = marketplace.metadata?.pluginRoot ?? ".";
const failures = [];
const results = [];

for (const entry of marketplace.plugins) {
  const { name, source, version: marketplaceVersion } = entry;

  if (typeof source !== "string") {
    // Non-relative source (github/url/git-subdir/npm) — nothing to cross-check.
    results.push({ name, status: "skipped", reason: "non-relative source" });
    continue;
  }

  if (!marketplaceVersion) {
    failures.push(
      `${name}: marketplace entry is missing "version" (required for relative-path plugins)`,
    );
    continue;
  }

  const pluginDir = join(repoRoot, pluginRoot, source);
  const pluginJsonPath = join(pluginDir, ".claude-plugin", "plugin.json");

  let pluginManifest;
  try {
    pluginManifest = JSON.parse(await readFile(pluginJsonPath, "utf8"));
  } catch (err) {
    failures.push(`${name}: cannot read ${pluginJsonPath} (${err.message})`);
    continue;
  }

  const pluginVersion = pluginManifest.version;

  if (pluginManifest.name !== name) {
    failures.push(
      `${name}: plugin.json "name" is "${pluginManifest.name}", expected "${name}"`,
    );
  }

  if (!pluginVersion) {
    failures.push(`${name}: plugin.json is missing "version"`);
    continue;
  }

  if (pluginVersion !== marketplaceVersion) {
    failures.push(
      `${name}: marketplace=${marketplaceVersion}, plugin.json=${pluginVersion}`,
    );
  } else {
    results.push({ name, status: "ok", version: pluginVersion });
  }
}

console.log(bold(`\nVersion sync check — ${marketplace.name}\n`));
for (const r of results) {
  if (r.status === "ok") {
    console.log(`  ${green("✓")} ${r.name.padEnd(28)} ${r.version}`);
  } else {
    console.log(`  ${yellow("–")} ${r.name.padEnd(28)} (${r.reason})`);
  }
}

if (failures.length > 0) {
  console.error(`\n${red(bold(`✗ ${failures.length} version mismatch(es):`))}`);
  for (const f of failures) console.error(`  ${red("✗")} ${f}`);
  console.error(
    "\nFix: ensure the marketplace entry and the plugin.json declare identical version strings.",
  );
  process.exit(1);
}

console.log(green(bold(`\n✓ All ${results.length} plugin versions in sync.\n`)));
