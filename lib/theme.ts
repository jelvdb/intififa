// Central color tokens — FIFA World Cup 2026 campaign palette, light theme.
// Every foreground/background pairing used in the app is verified WCAG AA
// (>= 4.5:1 for normal text, >= 3:1 for large/decorative). See scripts/check-contrast.mjs.
export const c = {
  // Surfaces
  bg: "#F4F6FB",
  surface: "#FFFFFF",
  surfaceMuted: "#EDF0F8",
  surfaceAccent: "#E6EAF6",
  border: "#D3D9EA",
  borderStrong: "#AEB6D4",

  // Text
  text: "#14173A",
  textMuted: "#474D72",
  textSubtle: "#5A6087",
  white: "#FFFFFF",

  // Accent "ink" — vivid campaign colors darkened enough to read as text on light
  tealInk: "#086D77",
  purpleInk: "#4F3FC4",
  redInk: "#C42330",
  orangeInk: "#9A5200",
  greenInk: "#0F7A43",
  goldInk: "#8A6400",

  // Solid fills that carry white text (AA verified)
  primary: "#5B4BD6", // campaign purple
  success: "#0F7A43",
  successBright: "#1E9E5A", // decorative / borders only
  danger: "#D12E3C",

  // Light tints — chip/badge backgrounds, paired with their matching *Ink text
  tealTint: "#E0F5F7",
  purpleTint: "#ECE9FB",
  redTint: "#FCE8EA",
  orangeTint: "#FBEAD6",
  greenTint: "#E2F5EA",
  goldTint: "#FBF0D2",
} as const;

// Per-sticker-type accent (text/ink) + tint background
export const typeInk: Record<string, string> = {
  foil: c.goldInk,
  player: c.tealInk,
  "team-photo": c.purpleInk,
  special: c.orangeInk,
  insert: c.redInk,
};
export const typeTint: Record<string, string> = {
  foil: c.goldTint,
  player: c.tealTint,
  "team-photo": c.purpleTint,
  special: c.orangeTint,
  insert: c.redTint,
};
