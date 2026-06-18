const validateCreate = ({ userId, name } = {}) => {
  if (!userId || !name) return { valid: false, status: 400 };
  if (typeof name !== "string" || name.trim().length === 0)
    return { valid: false, status: 400 };
  return { valid: true, status: 201 };
};

const isValidPlaylistName = (name) =>
  typeof name === "string" && name.trim().length > 0;

const isMovieInPlaylist = (movies, movieId) =>
  movies.some((m) => m.movieId === movieId);

const addMovieToPlaylist = (movies, movie) => {
  if (isMovieInPlaylist(movies, movie.movieId)) return { added: false, movies };
  return {
    added: true,
    movies: [...movies, { ...movie, addedAt: new Date() }],
  };
};

const removeMovieFromPlaylist = (movies, movieId) =>
  movies.filter((m) => m.movieId !== movieId);

const renamePlaylist = (playlist, newName) => {
  if (!isValidPlaylistName(newName)) return { updated: false };
  return { updated: true, playlist: { ...playlist, name: newName.trim() } };
};

module.exports = {
  validateCreate,
  isValidPlaylistName,
  isMovieInPlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  renamePlaylist,
};
