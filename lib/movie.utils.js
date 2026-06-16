const REQUIRED_SAVE_FIELDS = ["movieId", "userId", "title"];

/**
 * Validate that a save-movie request body has the required fields.
 */
function validateSaveMovieInput(body) {
  if (!body) return { valid: false, reason: "No request body" };

  for (const field of REQUIRED_SAVE_FIELDS) {
    if (!body[field]) {
      return { valid: false, reason: `Missing required field: ${field}` };
    }
  }

  return { valid: true, reason: null };
}

/**
 * Determine whether to 'like' or 'dislike' based on whether the movie
 * already exists in the database (toggle behaviour).
 */
function determineSaveAction(existingMovie) {
  return existingMovie ? "dislike" : "like";
}

/**
 * Extract the safe movie fields from a request body for DB storage.
 */
function buildMoviePayload(body) {
  return {
    userId: body.userId,
    movieId: body.movieId,
    title: body.title,
    overview: body.overview || "",
    name: body.name || "",
    backdrop_path: body.backdrop_path || null,
    poster_path: body.poster_path || null,
    original_name: body.original_name || "",
    vote_average: body.vote_average || 0,
  };
}

/**
 * Check if a movie is already in a user's favourites list.
 */
function isMovieFavorited(movieId, likedMovieIds) {
  if (!Array.isArray(likedMovieIds)) return false;
  return likedMovieIds.includes(movieId);
}

/**
 * Get display title from a movie object (title takes priority over name).
 */
function getMovieDisplayTitle(movie) {
  if (!movie) return "";
  return movie.title || movie.name || movie.original_name || "";
}

/**
 * Format a save-movie API response object.
 */
function formatSaveResponse(action) {
  return { status: action === "like" ? "like" : "disLike" };
}

module.exports = {
  validateSaveMovieInput,
  determineSaveAction,
  buildMoviePayload,
  isMovieFavorited,
  getMovieDisplayTitle,
  formatSaveResponse,
};
