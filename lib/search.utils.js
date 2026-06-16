const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 37, name: "Western" },
];

const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 53, name: "Thriller" },
  { id: 37, name: "Western" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

const DEFAULT_SORT = "popularity.desc";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Return the genre list for the given media option (movie or tv).
 */
function getGenreList(option) {
  return option === "tv" ? TV_GENRES : MOVIE_GENRES;
}

/**
 * Build a TMDB text-search URL.
 */
function buildSearchUrl(option, searchTerms, apiKey) {
  const encoded = encodeURIComponent(searchTerms.trim());
  return `${BASE_URL}/search/${option}?api_key=${apiKey}&language=en-US&query=${encoded}&page=1&include_adult=false`;
}

/**
 * Build a TMDB discover URL with optional genre, year, sort filters.
 */
function buildDiscoverUrl(option, filters, apiKey) {
  const {
    selectedGenre = "",
    selectedYear = "",
    sortBy = DEFAULT_SORT,
  } = filters || {};

  const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
  const yearParam = selectedYear
    ? option === "movie"
      ? `&primary_release_year=${selectedYear}`
      : `&first_air_date_year=${selectedYear}`
    : "";

  return `${BASE_URL}/discover/${option}?api_key=${apiKey}&language=en-US&sort_by=${sortBy}${genreParam}${yearParam}&include_adult=false&page=1`;
}

/**
 * Decide which TMDB URL to call based on option, searchTerms and filters.
 */
function buildFetchUrl(option, searchTerms, filters, apiKey) {
  const trimmed = (searchTerms || "").trim();

  if (option === "person") {
    if (!trimmed) return null;
    return `${BASE_URL}/search/person?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(trimmed)}&page=1&include_adult=false`;
  }

  if (trimmed) {
    return buildSearchUrl(option, trimmed, apiKey);
  }

  return buildDiscoverUrl(option, filters, apiKey);
}

/**
 * Get the frontend navigation path for a result item.
 */
function getNavigationPath(option, id) {
  if (!id) return null;
  if (option === "movie") return `/details/movie${id}`;
  if (option === "tv") return `/details/${id}`;
  if (option === "person") return `/cast/${id}`;
  return null;
}

/**
 * Return true when any non-default filter is active.
 */
function hasActiveFilters(selectedGenre, selectedYear, sortBy) {
  return !!(selectedGenre || selectedYear || sortBy !== DEFAULT_SORT);
}

/**
 * Return the default (cleared) filter state.
 */
function clearFilters() {
  return { selectedGenre: "", selectedYear: "", sortBy: DEFAULT_SORT };
}

/**
 * Find a genre name by its id within the given option's genre list.
 */
function findGenreName(option, genreId) {
  const list = getGenreList(option);
  const found = list.find((g) => String(g.id) === String(genreId));
  return found ? found.name : null;
}

module.exports = {
  MOVIE_GENRES,
  TV_GENRES,
  SORT_OPTIONS,
  DEFAULT_SORT,
  getGenreList,
  buildSearchUrl,
  buildDiscoverUrl,
  buildFetchUrl,
  getNavigationPath,
  hasActiveFilters,
  clearFilters,
  findGenreName,
};
