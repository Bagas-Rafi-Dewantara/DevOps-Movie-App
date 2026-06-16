/**
 * Format a TMDB vote_average to one decimal place.
 * e.g. 7.56 -> 7.5, 8.0 -> 8.0
 */
function formatRating(value) {
  if (value === null || value === undefined || typeof value !== "number")
    return 0;
  return Math.floor(value * 10) / 10;
}

/**
 * Convert vote_average (0-10) to a percentage for CircularProgress (0-100).
 */
function getProgressValue(value) {
  if (typeof value !== "number") return 0;
  return value * 10;
}

/**
 * Map a rating value to a colour category.
 * >= 7  -> "good"
 * >= 5  -> "average"
 * < 5   -> "poor"
 */
function getRatingColor(value) {
  if (typeof value !== "number") return "poor";
  if (value >= 7) return "good";
  if (value >= 5) return "average";
  return "poor";
}

/**
 * Convert a person popularity score to a displayable rating (divide by 10, cap at 10).
 */
function popularityToRating(popularity) {
  if (typeof popularity !== "number") return 0;
  return Math.min(popularity / 10, 10);
}

/**
 * Return a display string for a rating, e.g. "7.5 / 10".
 */
function formatRatingDisplay(value) {
  const formatted = formatRating(value);
  return `${formatted} / 10`;
}

module.exports = {
  formatRating,
  getProgressValue,
  getRatingColor,
  popularityToRating,
  formatRatingDisplay,
};
