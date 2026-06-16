const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
const TRAILER_BASE_URL = "https://www.youtube.com/watch?v=";

/**
 * Build all TMDB homepage request URLs using the given API key.
 */
function buildRequestUrls(apiKey) {
  return {
    fetchTrending: `${TMDB_BASE_URL}/trending/all/week?api_key=${apiKey}&language=en-US`,
    fetchNetflixOriginals: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&with_networks=213`,
    fetchTopRated: `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&language=en-US`,
    fetchActionMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=28`,
    fetchComedyMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=35`,
    fetchHorrorMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=27`,
    fetchRomanceMovies: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=10749`,
    fetchDocumentaries: `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&with_genres=99`,
  };
}

/**
 * Build the full TMDB image URL from a poster/backdrop path.
 */
function buildImageUrl(path) {
  if (!path) return null;
  return `${IMAGE_BASE_URL}${path}`;
}

/**
 * Build the full YouTube trailer URL from a video key.
 */
function buildTrailerUrl(videoKey) {
  if (!videoKey) return null;
  return `${TRAILER_BASE_URL}${videoKey}`;
}

/**
 * Build a TMDB detail URL for a movie or tv show.
 */
function buildDetailUrl(mediaType, id, apiKey) {
  if (!id || !mediaType) return null;
  return `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${apiKey}&language=en-US`;
}

/**
 * Build a TMDB videos (trailers) URL.
 */
function buildVideosUrl(mediaType, id, apiKey) {
  if (!id || !mediaType) return null;
  return `${TMDB_BASE_URL}/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US`;
}

/**
 * Build a TMDB reviews URL.
 */
function buildReviewsUrl(mediaType, id, apiKey) {
  if (!id || !mediaType) return null;
  return `${TMDB_BASE_URL}/${mediaType}/${id}/reviews?api_key=${apiKey}&language=en-US&page=1`;
}

module.exports = {
  TMDB_BASE_URL,
  IMAGE_BASE_URL,
  TRAILER_BASE_URL,
  buildRequestUrls,
  buildImageUrl,
  buildTrailerUrl,
  buildDetailUrl,
  buildVideosUrl,
  buildReviewsUrl,
};
