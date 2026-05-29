/**
 * Single source of truth for the product brand.
 *
 * Everything user-facing (page titles, auth screens, sidebar logo,
 * webhook error copy) reads from here so a future rebrand is a
 * one-file change. Keep these strings short — they show up in tight
 * UI spots (sidebar, browser tab).
 */

export const BRAND_NAME = "Pro WhatsApp PDB";

/** Compact form used where space is tight (mobile tab title, etc.). */
export const BRAND_SHORT = "Pro WhatsApp PDB";

/** One-liner shown under the logo on the auth screens. */
export const BRAND_TAGLINE = "La plateforme CRM WhatsApp pour l'Afrique";

/** <meta name="description"> and OG description. */
export const BRAND_DESCRIPTION =
  "Pro WhatsApp PDB — CRM WhatsApp tout-en-un : messagerie partagée, " +
  "contacts, pipelines de vente, diffusions et automatisations sans code.";
