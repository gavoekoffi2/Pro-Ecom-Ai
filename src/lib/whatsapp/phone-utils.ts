/**
 * Default country dialing code for the deployment. Togo (+228) — the
 * product's home market — so locally-typed subscriber numbers (the
 * 8-digit Togolese format, e.g. "90 12 34 56") get completed to a
 * full international number automatically. Override per deployment via
 * NEXT_PUBLIC_DEFAULT_COUNTRY_CODE if you serve another country.
 */
export const DEFAULT_COUNTRY_CODE =
  process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE?.replace(/\D/g, '') || '228'

/**
 * Sanitize phone number for Meta WhatsApp API.
 * Meta requires digits only — no + prefix, no spaces, no dashes.
 * e.g. "+370 63949836" → "37063949836"
 */
export function sanitizePhoneForMeta(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Complete a phone number to full international digits (no +), applying
 * the default country code when the user typed only a local subscriber
 * number. WhatsApp/Meta always needs the country code, but people in
 * Togo (and across francophone Africa) routinely type just the local
 * 8-digit number — this bridges that gap so first-time users don't have
 * to remember "+228".
 *
 * Rules, in order:
 *   - "00…" international access prefix is dropped (the rest carries a CC).
 *   - already-international numbers (start with the default CC, or are
 *     long enough to clearly include some other CC) are kept as-is.
 *   - a leading trunk "0" is stripped, then the default CC is prepended
 *     to short local numbers.
 *
 * e.g. (default CC 228)
 *   "90 12 34 56"      → "22890123456"
 *   "+228 90 12 34 56" → "22890123456"
 *   "0022890123456"    → "22890123456"
 *   "+233 24 123 4567" → "233241234567"  (kept — foreign CC)
 */
export function toInternationalDigits(
  phone: string,
  defaultCountryCode: string = DEFAULT_COUNTRY_CODE
): string {
  let d = (phone || '').replace(/\D/g, '')
  if (!d) return ''

  // "00" international access prefix → strip; remainder already has a CC.
  if (d.startsWith('00')) d = d.slice(2)

  // Already carries the default country code (and enough subscriber
  // digits to be plausible) — leave it untouched.
  if (d.startsWith(defaultCountryCode) && d.length >= defaultCountryCode.length + 6) {
    return d
  }

  // Drop a domestic trunk "0" before deciding on length.
  d = d.replace(/^0+/, '')

  // Short enough to be a bare local subscriber number → add the CC.
  // Longer numbers are assumed to already include some country code.
  if (d.length <= 9) return defaultCountryCode + d

  return d
}

/**
 * Normalize phone number by removing all non-digit characters.
 * Used for comparing phone numbers in different formats.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Compare two phone numbers accounting for trunk prefix differences.
 * e.g. "370063949836" (with trunk 0) matches "37063949836" (without trunk 0)
 * by comparing the last 8 digits.
 */
export function phonesMatch(phone1: string, phone2: string): boolean {
  const n1 = normalizePhone(phone1)
  const n2 = normalizePhone(phone2)
  if (n1 === n2) return true
  if (n1.length >= 8 && n2.length >= 8) {
    return n1.slice(-8) === n2.slice(-8)
  }
  return false
}

/**
 * Validate phone number is E.164-like format (7-15 digits starting with non-zero).
 * Accepts with or without + prefix.
 */
export function isValidE164(phone: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(phone)
}

/**
 * Generate plausible phone number variants for retry when Meta's
 * sandbox rejects a number with error #131030 ("not in allowed list").
 *
 * Many countries use a "trunk prefix" 0 for domestic dialing that is
 * meant to be dropped in international format (e.g. Lithuanian
 * "+370 063 949 836" domestically → "+370 63 949 836" international).
 * But some sandboxes register the number with the trunk 0 included,
 * causing sends to the correct international format to fail.
 *
 * This helper yields up to 3 variants:
 *   1. The original sanitized number (first attempt)
 *   2. With a trunk 0 inserted after the country code
 *   3. With a trunk 0 removed after the country code
 *
 * Country-code lengths of 1, 2, and 3 digits are tried because we
 * don't know the user's country ahead of time.
 *
 * @param sanitized - digits-only phone number (from sanitizePhoneForMeta)
 * @returns deduplicated list of variants, original first
 */
export function phoneVariants(sanitized: string): string[] {
  if (!sanitized) return []
  const seen = new Set<string>()
  const push = (v: string) => {
    if (v && !seen.has(v)) seen.add(v)
  }

  // 1. Original
  push(sanitized)

  // 2. Insert a 0 after each plausible country-code length
  for (const ccLen of [1, 2, 3]) {
    if (sanitized.length <= ccLen) continue
    const cc = sanitized.slice(0, ccLen)
    const rest = sanitized.slice(ccLen)
    if (!rest.startsWith('0')) {
      push(cc + '0' + rest)
    }
  }

  // 3. Remove a leading 0 after each plausible country-code length
  for (const ccLen of [1, 2, 3]) {
    if (sanitized.length <= ccLen + 1) continue
    const cc = sanitized.slice(0, ccLen)
    const rest = sanitized.slice(ccLen)
    if (rest.startsWith('0')) {
      push(cc + rest.slice(1))
    }
  }

  return [...seen]
}

/**
 * Returns true when the Meta API error indicates the recipient
 * phone number isn't in the allowed list (sandbox restriction).
 * Detected via error code 131030 or the standard error text.
 */
export function isRecipientNotAllowedError(message: string): boolean {
  return /131030|not in allowed list|not in the allowed list/i.test(message)
}
