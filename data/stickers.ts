export type StickerType = "foil" | "player" | "team-photo" | "special" | "insert";

export interface Sticker {
  id: string;
  number: number;
  label: string;
  type: StickerType;
}

export interface Section {
  id: string;
  name: string;
  flag: string;
  stickers: Sticker[];
}

const countries: { name: string; flag: string; id: string }[] = [
  { id: "alg", name: "Algeria", flag: "🇩🇿" },
  { id: "arg", name: "Argentina", flag: "🇦🇷" },
  { id: "aus", name: "Australia", flag: "🇦🇺" },
  { id: "aut", name: "Austria", flag: "🇦🇹" },
  { id: "bel", name: "Belgium", flag: "🇧🇪" },
  { id: "bih", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { id: "bra", name: "Brazil", flag: "🇧🇷" },
  { id: "can", name: "Canada", flag: "🇨🇦" },
  { id: "cpv", name: "Cape Verde", flag: "🇨🇻" },
  { id: "col", name: "Colombia", flag: "🇨🇴" },
  { id: "cod", name: "Congo DR", flag: "🇨🇩" },
  { id: "cro", name: "Croatia", flag: "🇭🇷" },
  { id: "cze", name: "Czechia", flag: "🇨🇿" },
  { id: "cur", name: "Curaçao", flag: "🇨🇼" },
  { id: "ecu", name: "Ecuador", flag: "🇪🇨" },
  { id: "egy", name: "Egypt", flag: "🇪🇬" },
  { id: "eng", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "fra", name: "France", flag: "🇫🇷" },
  { id: "ger", name: "Germany", flag: "🇩🇪" },
  { id: "gha", name: "Ghana", flag: "🇬🇭" },
  { id: "hai", name: "Haiti", flag: "🇭🇹" },
  { id: "irn", name: "Iran", flag: "🇮🇷" },
  { id: "irq", name: "Iraq", flag: "🇮🇶" },
  { id: "civ", name: "Ivory Coast", flag: "🇨🇮" },
  { id: "jpn", name: "Japan", flag: "🇯🇵" },
  { id: "jor", name: "Jordan", flag: "🇯🇴" },
  { id: "mex", name: "Mexico", flag: "🇲🇽" },
  { id: "mar", name: "Morocco", flag: "🇲🇦" },
  { id: "ned", name: "Netherlands", flag: "🇳🇱" },
  { id: "nzl", name: "New Zealand", flag: "🇳🇿" },
  { id: "nor", name: "Norway", flag: "🇳🇴" },
  { id: "pan", name: "Panama", flag: "🇵🇦" },
  { id: "par", name: "Paraguay", flag: "🇵🇾" },
  { id: "por", name: "Portugal", flag: "🇵🇹" },
  { id: "qat", name: "Qatar", flag: "🇶🇦" },
  { id: "ksa", name: "Saudi Arabia", flag: "🇸🇦" },
  { id: "sco", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "sen", name: "Senegal", flag: "🇸🇳" },
  { id: "rsa", name: "South Africa", flag: "🇿🇦" },
  { id: "kor", name: "South Korea", flag: "🇰🇷" },
  { id: "esp", name: "Spain", flag: "🇪🇸" },
  { id: "swe", name: "Sweden", flag: "🇸🇪" },
  { id: "sui", name: "Switzerland", flag: "🇨🇭" },
  { id: "tun", name: "Tunisia", flag: "🇹🇳" },
  { id: "tur", name: "Türkiye", flag: "🇹🇷" },
  { id: "uru", name: "Uruguay", flag: "🇺🇾" },
  { id: "usa", name: "USA", flag: "🇺🇸" },
  { id: "uzb", name: "Uzbekistan", flag: "🇺🇿" },
];

function buildCountryStickers(countryId: string, startNumber: number): Sticker[] {
  return [
    { id: `${countryId}-1`, number: startNumber, label: "Logo (Foil)", type: "foil" },
    ...Array.from({ length: 18 }, (_, i) => ({
      id: `${countryId}-${i + 2}`,
      number: startNumber + i + 1,
      label: `Speler ${i + 1}`,
      type: "player" as StickerType,
    })),
    { id: `${countryId}-20`, number: startNumber + 19, label: "Teamfoto", type: "team-photo" },
  ];
}

const specialStickers: Sticker[] = [
  { id: "sp-1", number: 1, label: "Panini Logo", type: "special" },
  { id: "sp-2", number: 2, label: "Officieel Embleem", type: "special" },
  { id: "sp-3", number: 3, label: "Mascotte", type: "special" },
  { id: "sp-4", number: 4, label: "Slogan", type: "special" },
  { id: "sp-5", number: 5, label: "Bal", type: "special" },
  { id: "sp-6", number: 6, label: "Gastland: Canada", type: "special" },
  { id: "sp-7", number: 7, label: "Gastland: Mexico", type: "special" },
  { id: "sp-8", number: 8, label: "Gastland: USA", type: "special" },
  { id: "sp-9", number: 9, label: "WK Geschiedenis: Italië 1934", type: "special" },
  { id: "sp-10", number: 10, label: "WK Geschiedenis: Uruguay 1950", type: "special" },
  { id: "sp-11", number: 11, label: "WK Geschiedenis: W-Duitsland 1954", type: "special" },
  { id: "sp-12", number: 12, label: "WK Geschiedenis: Brazilië 1962", type: "special" },
  { id: "sp-13", number: 13, label: "WK Geschiedenis: W-Duitsland 1974", type: "special" },
  { id: "sp-14", number: 14, label: "WK Geschiedenis: Argentinië 1986", type: "special" },
  { id: "sp-15", number: 15, label: "WK Geschiedenis: Brazilië 1994", type: "special" },
  { id: "sp-16", number: 16, label: "WK Geschiedenis: Brazilië 2002", type: "special" },
  { id: "sp-17", number: 17, label: "WK Geschiedenis: Italië 2006", type: "special" },
  { id: "sp-18", number: 18, label: "WK Geschiedenis: Duitsland 2014", type: "special" },
  { id: "sp-19", number: 19, label: "WK Geschiedenis: Argentinië 2022", type: "special" },
  { id: "sp-20", number: 20, label: "WK Geschiedenis: Extra", type: "special" },
];

const countryStart = 21;
const countrySections: Section[] = countries.map((country, index) => ({
  id: country.id,
  name: country.name,
  flag: country.flag,
  stickers: buildCountryStickers(country.id, countryStart + index * 20),
}));

const insertStickers: Sticker[] = Array.from({ length: 12 }, (_, i) => ({
  id: `cc-${i + 1}`,
  number: countryStart + 48 * 20 + i,
  label: `Coca-Cola USA ${i + 1}`,
  type: "insert" as StickerType,
}));

export const sections: Section[] = [
  {
    id: "special",
    name: "Speciaal",
    flag: "🏆",
    stickers: specialStickers,
  },
  ...countrySections,
  {
    id: "coca-cola",
    name: "Coca-Cola USA Set",
    flag: "🥤",
    stickers: insertStickers,
  },
];

export const totalStickers = sections.reduce((sum, s) => sum + s.stickers.length, 0);
