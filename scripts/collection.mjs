#!/usr/bin/env node
// Daily-workflow helper for the online sticker collection.
//
// Talks to the deployed app's HTTP API (which persists to Upstash), so it
// works from anywhere without a redeploy and without needing the Upstash
// token locally. Override the target with PANINTI_URL.
//
// Commands:
//   node scripts/collection.mjs get                 Summary of the collection
//   node scripts/collection.mjs status CODE...       Classify codes as owned / new
//   node scripts/collection.mjs collect CODE...      Apply a scan: missing -> new, owned -> duplicate
//   node scripts/collection.mjs extra "Label"        Add one extra sticker
//
// Codes are Panini codes, e.g. MEX8, IRQ7, FWC13.

const BASE = (process.env.PANINTI_URL ?? "https://paninti.jel.be").replace(/\/$/, "");

function codeToId(code) {
  const m = code.toUpperCase().replace(/\s+/g, "").match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  const [, prefix, num] = m;
  return prefix === "FWC" ? `sp-${num}` : `${prefix.toLowerCase()}-${num}`;
}

async function api(path, init) {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} -> HTTP ${res.status}`);
  return res.json();
}

const getState = () => api("/api/state");

async function cmdGet() {
  const s = await getState();
  const collected = Object.keys(s.collected ?? {}).length;
  const dupTotal = Object.values(s.duplicates ?? {}).reduce((a, b) => a + b, 0);
  const extraTotal = (s.extras ?? []).reduce((a, e) => a + e.count, 0);
  console.log(`Collected: ${collected}`);
  console.log(`Duplicates: ${dupTotal} (${Object.keys(s.duplicates ?? {}).length} kinds)`);
  console.log(`Extras: ${extraTotal} (${(s.extras ?? []).length} kinds)`);
}

async function cmdStatus(codes) {
  const s = await getState();
  for (const code of codes) {
    const id = codeToId(code);
    if (!id) { console.log(`${code}: ⚠️  invalid code`); continue; }
    console.log(`${code}: ${s.collected?.[id] ? "✓ owned (would be duplicate)" : "✨ new"}`);
  }
}

async function cmdCollect(codes) {
  const s = await getState();
  const newStickers = [];
  const duplicateStickers = [];
  const invalid = [];
  for (const code of codes) {
    const id = codeToId(code);
    if (!id) { invalid.push(code); continue; }
    (s.collected?.[id] ? duplicateStickers : newStickers).push(id);
  }
  if (invalid.length) console.log(`Skipped invalid codes: ${invalid.join(", ")}`);
  await api("/api/apply-stickers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStickers, duplicateStickers }),
  });
  console.log(`Applied: ${newStickers.length} new, ${duplicateStickers.length} duplicate`);
}

async function cmdExtra(label) {
  if (!label?.trim()) throw new Error('Usage: extra "Label - Country"');
  await api("/api/extras", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", label: label.trim() }),
  });
  console.log(`Added extra: ${label.trim()}`);
}

const [cmd, ...args] = process.argv.slice(2);
const run = {
  get: () => cmdGet(),
  status: () => cmdStatus(args),
  collect: () => cmdCollect(args),
  extra: () => cmdExtra(args.join(" ")),
}[cmd];

if (!run) {
  console.error(`Unknown command "${cmd ?? ""}". Use: get | status | collect | extra`);
  process.exit(1);
}

run().catch((e) => { console.error(String(e.message ?? e)); process.exit(1); });
