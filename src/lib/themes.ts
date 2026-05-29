/**
 * Single source of truth for the color-theme catalog.
 *
 * The CSS variables themselves live in `src/app/globals.css` under
 * `html[data-theme="..."]` blocks — that file is the one we paste
 * theme tokens into. This module only carries the metadata the UI
 * (settings picker, no-flash boot script) needs.
 *
 * Adding a new theme is a two-step change:
 *   1. Append the new `html[data-theme="<id>"]` block in globals.css
 *      with every token from an existing theme (use whatsapp as the
 *      shape reference).
 *   2. Add an entry below. The order here drives the picker grid.
 */

export const THEME_IDS = [
  "whatsapp",
  "emerald",
  "cobalt",
  "amber",
  "rose",
  "violet",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: ThemeId = "whatsapp";

export const STORAGE_KEY = "pwpdb.theme";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  /**
   * Static swatch color for the picker chip. Hard-coded so the boot
   * script / picker cards don't need a getComputedStyle round trip
   * before the page settles. Must mirror `--primary` of the same
   * theme in globals.css.
   */
  swatch: string;
}

export const THEMES: ReadonlyArray<ThemeMeta> = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    tagline: "Le vert officiel de WhatsApp — l'identité de la messagerie.",
    swatch: "oklch(0.7 0.17 156)",
  },
  {
    id: "emerald",
    name: "Émeraude",
    tagline: "Un vert plus doux, orienté croissance.",
    swatch: "oklch(0.62 0.16 162)",
  },
  {
    id: "cobalt",
    name: "Cobalt",
    tagline: "Bleu SaaS B2B — calme et professionnel.",
    swatch: "oklch(0.585 0.2 254)",
  },
  {
    id: "amber",
    name: "Ambre",
    tagline: "Chaleureux et accueillant — idéal pour les PME.",
    swatch: "oklch(0.745 0.16 65)",
  },
  {
    id: "rose",
    name: "Rose",
    tagline: "Audacieux et moderne — D2C, créateurs, lifestyle.",
    swatch: "oklch(0.645 0.22 16)",
  },
  {
    id: "violet",
    name: "Violet",
    tagline: "Le thème d'origine — sûr de lui, un brin ludique.",
    swatch: "oklch(0.526 0.247 293)",
  },
];

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" &&
    (THEME_IDS as ReadonlyArray<string>).includes(value)
  );
}
