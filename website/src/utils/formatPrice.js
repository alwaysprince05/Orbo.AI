/**
 * Format a USD price as Indian Rupees (₹).
 *
 * Conversion: 1 USD ≈ ₹83 (fixed rate for display purposes).
 * The backend stores prices in USD; this function is display-only.
 *
 * @param {number} usdPrice - Price in USD
 * @param {object} [opts]
 * @param {boolean} [opts.compact=false] - Use ₹1,667 instead of ₹1,667.00
 * @returns {string} Formatted price string, e.g. "₹1,667"
 */
const USD_TO_INR = 83;

export function formatPrice(usdPrice, { compact = false } = {}) {
  if (usdPrice == null || isNaN(usdPrice)) return '₹0';
  const inr = Math.round(usdPrice * USD_TO_INR);
  if (compact) {
    return `₹${inr.toLocaleString('en-IN')}`;
  }
  return `₹${inr.toLocaleString('en-IN')}`;
}

/**
 * Format a discount percentage.
 */
export function formatDiscount(pct) {
  if (!pct) return '';
  return `${pct}% OFF`;
}
