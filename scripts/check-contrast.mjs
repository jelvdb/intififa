// WCAG AA contrast check for the FIFA-campaign light palette in lib/theme.ts.
// Run: node scripts/check-contrast.mjs   (exits non-zero on any failure)
const C = {
  bg: "#F4F6FB", surface: "#FFFFFF", surfaceMuted: "#EDF0F8", surfaceAccent: "#E6EAF6",
  border: "#D3D9EA", borderStrong: "#AEB6D4",
  text: "#14173A", textMuted: "#474D72", textSubtle: "#5A6087", white: "#FFFFFF",
  tealInk: "#086D77", purpleInk: "#4F3FC4", redInk: "#C42330", orangeInk: "#9A5200",
  greenInk: "#0F7A43", goldInk: "#8A6400",
  primary: "#5B4BD6", success: "#0F7A43", danger: "#D12E3C",
};
const hex = (h) => { h = h.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = L(a), l2 = L(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

// [fg, bg, label, large?]
const checks = [
  ["text", "bg", "body on bg"], ["text", "surface", "body on card"],
  ["textMuted", "bg", "muted on bg"], ["textMuted", "surface", "muted on card"],
  ["textMuted", "surfaceMuted", "muted on input"],
  ["textSubtle", "surface", "subtle on card"], ["textSubtle", "bg", "subtle on bg"],
  ["tealInk", "surface", "player code"], ["purpleInk", "surface", "team code / accent"],
  ["redInk", "surface", "insert / error"], ["orangeInk", "surface", "special / dup"],
  ["greenInk", "surface", "collected text"], ["goldInk", "surface", "foil code"],
  ["purpleInk", "bg", "active tab on bg"], ["greenInk", "surfaceMuted", "counter on muted"],
  ["white", "primary", "white on primary"], ["white", "success", "white on success"],
  ["white", "danger", "white on danger"],
  ["tealInk", "tealTint", "player chip"], ["purpleInk", "purpleTint", "team chip"],
  ["redInk", "redTint", "insert chip"], ["orangeInk", "orangeTint", "special chip"],
  ["greenInk", "greenTint", "new/collected chip"], ["goldInk", "goldTint", "foil chip"],
].map((x) => x);
const tints = { tealTint: "#E0F5F7", purpleTint: "#ECE9FB", redTint: "#FCE8EA", orangeTint: "#FBEAD6", greenTint: "#E2F5EA", goldTint: "#FBF0D2" };
Object.assign(C, tints);

let fail = 0;
for (const [fg, bg, label, large] of checks) {
  const r = ratio(C[fg], C[bg]);
  const ok = r >= (large ? 3 : 4.5);
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}  ${label}`);
}
console.log(fail ? `\n${fail} FAILURE(S)` : "\nALL PASS");
process.exit(fail ? 1 : 0);
