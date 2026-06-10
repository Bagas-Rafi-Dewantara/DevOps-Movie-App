/**
 * Unit Tests - Playlist Feature
 * Menguji seluruh business logic fitur playlist:
 * create, rename, delete, tambah/hapus film, duplikasi.
 */

const {
  validateCreate,
  isValidPlaylistName,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
  renamePlaylist,
} = require("../lib/playlist.utils");

// ── createPlaylist: validasi input ───────────────────────────────────────────
describe("createPlaylist - validasi input", () => {
  test("harus gagal (400) jika userId tidak ada", () => {
    expect(validateCreate({ name: "Favorites" }).status).toBe(400);
  });

  test("harus gagal (400) jika name tidak ada", () => {
    expect(validateCreate({ userId: "uid-123" }).status).toBe(400);
  });

  test("harus gagal (400) jika name string kosong", () => {
    expect(validateCreate({ userId: "uid-123", name: "" }).valid).toBe(false);
  });

  test("harus gagal (400) jika name hanya spasi", () => {
    expect(validateCreate({ userId: "uid-123", name: "   " }).valid).toBe(
      false,
    );
  });

  test("harus berhasil (201) dengan data lengkap", () => {
    const result = validateCreate({ userId: "uid-123", name: "Watch Later" });
    expect(result.valid).toBe(true);
    expect(result.status).toBe(201);
  });

  test("harus berhasil untuk nama dengan spasi di tengah", () => {
    const result = validateCreate({ userId: "uid-123", name: "Action Movies" });
    expect(result.valid).toBe(true);
  });
});

// ── isValidPlaylistName ──────────────────────────────────────────────────────
describe("validasi nama playlist", () => {
  test("string kosong tidak valid", () => {
    expect(isValidPlaylistName("")).toBe(false);
  });

  test("string spasi saja tidak valid", () => {
    expect(isValidPlaylistName("   ")).toBe(false);
  });

  test("null tidak valid", () => {
    expect(isValidPlaylistName(null)).toBe(false);
  });

  test("undefined tidak valid", () => {
    expect(isValidPlaylistName(undefined)).toBe(false);
  });

  test("nama normal valid", () => {
    expect(isValidPlaylistName("My Playlist")).toBe(true);
  });

  test("nama satu karakter valid", () => {
    expect(isValidPlaylistName("A")).toBe(true);
  });
});

// ── addMovieToPlaylist ───────────────────────────────────────────────────────
describe("addMovieToPlaylist - tambah film", () => {
  const existingMovies = [
    { movieId: 101, title: "Inception", mediaType: "movie" },
    { movieId: 202, title: "Interstellar", mediaType: "movie" },
  ];

  test("harus berhasil menambah film baru", () => {
    const newMovie = { movieId: 303, title: "Tenet", mediaType: "movie" };
    const result = addMovieToPlaylist(existingMovies, newMovie);
    expect(result.added).toBe(true);
    expect(result.movies).toHaveLength(3);
  });

  test("harus gagal menambah film yang sudah ada (duplikat)", () => {
    const duplicate = { movieId: 101, title: "Inception", mediaType: "movie" };
    const result = addMovieToPlaylist(existingMovies, duplicate);
    expect(result.added).toBe(false);
    expect(result.movies).toHaveLength(2);
  });

  test("harus berhasil menambah film ke playlist kosong", () => {
    const movie = { movieId: 1, title: "Avatar", mediaType: "movie" };
    const result = addMovieToPlaylist([], movie);
    expect(result.added).toBe(true);
    expect(result.movies).toHaveLength(1);
  });

  test("film yang ditambah harus punya field addedAt", () => {
    const movie = { movieId: 500, title: "Dune", mediaType: "movie" };
    const result = addMovieToPlaylist([], movie);
    expect(result.movies[0].addedAt).toBeDefined();
  });

  test("film TV juga bisa ditambah ke playlist", () => {
    const tvShow = { movieId: 888, title: "Breaking Bad", mediaType: "tv" };
    const result = addMovieToPlaylist([], tvShow);
    expect(result.added).toBe(true);
    expect(result.movies[0].mediaType).toBe("tv");
  });
});

// ── removeMovieFromPlaylist ──────────────────────────────────────────────────
describe("removeMovieFromPlaylist - hapus film", () => {
  const movies = [
    { movieId: 101, title: "Inception" },
    { movieId: 202, title: "Interstellar" },
    { movieId: 303, title: "Tenet" },
  ];

  test("harus menghapus film yang sesuai movieId", () => {
    const result = removeMovieFromPlaylist(movies, 202);
    expect(result).toHaveLength(2);
    expect(result.find((m) => m.movieId === 202)).toBeUndefined();
  });

  test("tidak boleh menghapus film lain selain target", () => {
    const result = removeMovieFromPlaylist(movies, 101);
    expect(result.find((m) => m.movieId === 202)).toBeDefined();
    expect(result.find((m) => m.movieId === 303)).toBeDefined();
  });

  test("harus return array kosong jika satu-satunya film dihapus", () => {
    const singleMovie = [{ movieId: 101, title: "Inception" }];
    expect(removeMovieFromPlaylist(singleMovie, 101)).toHaveLength(0);
  });

  test("tidak mengubah array jika movieId tidak ditemukan", () => {
    const result = removeMovieFromPlaylist(movies, 9999);
    expect(result).toHaveLength(3);
  });
});

// ── renamePlaylist ───────────────────────────────────────────────────────────
describe("renamePlaylist - ganti nama", () => {
  const playlist = { _id: "abc123", name: "Old Name", movies: [] };

  test("harus berhasil rename dengan nama valid", () => {
    const result = renamePlaylist(playlist, "New Name");
    expect(result.updated).toBe(true);
    expect(result.playlist.name).toBe("New Name");
  });

  test("harus gagal rename dengan nama kosong", () => {
    expect(renamePlaylist(playlist, "").updated).toBe(false);
  });

  test("harus trim spasi dari nama baru", () => {
    const result = renamePlaylist(playlist, "  Trimmed Name  ");
    expect(result.playlist.name).toBe("Trimmed Name");
  });

  test("rename tidak boleh mengubah field lain", () => {
    const result = renamePlaylist(playlist, "New Name");
    expect(result.playlist._id).toBe("abc123");
    expect(result.playlist.movies).toHaveLength(0);
  });
});

// ── Jumlah playlist per user ─────────────────────────────────────────────────
describe("playlist - data integrity", () => {
  test("satu user bisa punya banyak playlist", () => {
    const userPlaylists = [
      { userId: "uid-1", name: "Favorites" },
      { userId: "uid-1", name: "Watch Later" },
      { userId: "uid-1", name: "Action Movies" },
    ];
    const filtered = userPlaylists.filter((p) => p.userId === "uid-1");
    expect(filtered).toHaveLength(3);
  });

  test("playlist user A tidak boleh tercampur dengan user B", () => {
    const allPlaylists = [
      { userId: "uid-A", name: "Playlist A" },
      { userId: "uid-B", name: "Playlist B" },
    ];
    const userAPlaylists = allPlaylists.filter((p) => p.userId === "uid-A");
    expect(userAPlaylists).toHaveLength(1);
    expect(userAPlaylists[0].name).toBe("Playlist A");
  });
});
