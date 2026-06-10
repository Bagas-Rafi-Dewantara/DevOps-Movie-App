const validateSaveMovie = ({ userId, movieId } = {}) => {
  if (!userId || !movieId) {
    return { valid: false, status: 400, message: "userId dan movieId wajib ada" };
  }
  return { valid: true };
};

const isMovieFavorited = (favorites, userId, movieId) =>
  favorites.some((f) => f.userId === userId && f.movieId === movieId);

const toggleFavorite = (favorites, userId, movieId, movieData = {}) => {
  const already = isMovieFavorited(favorites, userId, movieId);
  if (already) {
    return {
      action: "removed",
      favorites: favorites.filter(
        (f) => !(f.userId === userId && f.movieId === movieId)
      ),
    };
  }
  return {
    action: "added",
    favorites: [...favorites, { userId, movieId, ...movieData, savedAt: new Date() }],
  };
};

const getUserFavorites = (favorites, userId) =>
  favorites.filter((f) => f.userId === userId);

const formatMovieForSave = (movie, userId) => ({
  userId,
  movieId: movie.id,
  title: movie.title || movie.name,
  poster_path: movie.poster_path || "",
  backdrop_path: movie.backdrop_path || "",
  vote_average: movie.vote_average || 0,
  media_type: movie.media_type || "movie",
  savedAt: new Date(),
});

module.exports = {
  validateSaveMovie,
  isMovieFavorited,
  toggleFavorite,
  getUserFavorites,
  formatMovieForSave,
};
