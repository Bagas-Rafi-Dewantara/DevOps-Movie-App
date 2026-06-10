const filterByGenre = (movies, genreId) =>
  movies.filter((m) => m.genre_ids.includes(genreId));

const filterByYear = (movies, year) =>
  movies.filter((m) => new Date(m.release_date).getFullYear() === year);

const sortByRatingDesc = (movies) =>
  [...movies].sort((a, b) => b.vote_average - a.vote_average);

const sortByRatingAsc = (movies) =>
  [...movies].sort((a, b) => a.vote_average - b.vote_average);

const sortByYearDesc = (movies) =>
  [...movies].sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date),
  );

const filterByQuery = (movies, query) => {
  if (!query || query.trim() === "") return movies;
  const q = query.toLowerCase();
  return movies.filter((m) => m.title && m.title.toLowerCase().includes(q));
};

const applyFilters = (movies, { genreId, year, sortBy, query } = {}) => {
  let result = [...movies];
  if (query) result = filterByQuery(result, query);
  if (genreId) result = filterByGenre(result, genreId);
  if (year) result = filterByYear(result, year);
  if (sortBy === "rating_desc") result = sortByRatingDesc(result);
  if (sortBy === "rating_asc") result = sortByRatingAsc(result);
  if (sortBy === "year_desc") result = sortByYearDesc(result);
  return result;
};

module.exports = {
  filterByGenre,
  filterByYear,
  sortByRatingDesc,
  sortByRatingAsc,
  sortByYearDesc,
  filterByQuery,
  applyFilters,
};
