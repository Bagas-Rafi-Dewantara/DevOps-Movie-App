/**
 * Unit Tests - Movie Feature
 * Menguji logika save movie, find favorit, dan toggle favorit.
 */

const {
  validateSaveMovie,
  isMovieFavorited,
  toggleFavorite,
  getUserFavorites,
  formatMovieForSave,
} = require("../lib/movie.utils");

// ── validateSaveMovie ────────────────────────────────────────────────────────
describe("validateSaveMovie - validasi input", () => {
  test("harus gagal jika userId tidak ada", () => {
    expect(validateSaveMovie({ movieId: 101 }).valid).toBe(false);
    expect(validateSaveMovie({ movieId: 101 }).status).toBe(400);
  });

  test("harus gagal jika movieId tidak ada", () => {
    expect(validateSaveMovie({ userId: "uid-1" }).valid).toBe(false);
  });

  test("harus gagal jika keduanya tidak ada", () => {
    expect(validateSaveMovie({}).valid).toBe(false);
  });

  test("harus berhasil jika userId dan movieId ada", () => {
    expect(validateSaveMovie({ userId: "uid-1", movieId: 101 }).valid).toBe(true);
  });
});

// ── isMovieFavorited ─────────────────────────────────────────────────────────
describe("isMovieFavorited - cek status favorit", () => {
  const favorites = [
    { userId: "uid-1", movieId: 101 },
    { userId: "uid-1", movieId: 202 },
    { userId: "uid-2", movieId: 101 },
  ];

  test("harus return true jika film sudah difavoritkan user ini", () => {
    expect(isMovieFavorited(favorites, "uid-1", 101)).toBe(true);
  });

  test("harus return false jika film belum difavoritkan user ini", () => {
    expect(isMovieFavorited(favorites, "uid-1", 999)).toBe(false);
  });

  test("favorit user berbeda tidak boleh saling mempengaruhi", () => {
    expect(isMovieFavorited(favorites, "uid-2", 202)).toBe(false);
    expect(isMovieFavorited(favorites, "uid-2", 101)).toBe(true);
  });

  test("harus return false jika daftar favorit kosong", () => {
    expect(isMovieFavorited([], "uid-1", 101)).toBe(false);
  });
});

// ── toggleFavorite ───────────────────────────────────────────────────────────
describe("toggleFavorite - tambah atau hapus favorit", () => {
  const favorites = [{ userId: "uid-1", movieId: 101 }];

  test("harus menambah film baru ke favorit (action: added)", () => {
    const result = toggleFavorite(favorites, "uid-1", 202);
    expect(result.action).toBe("added");
    expect(result.favorites).toHaveLength(2);
  });

  test("harus menghapus film yang sudah difavoritkan (action: removed)", () => {
    const result = toggleFavorite(favorites, "uid-1", 101);
    expect(result.action).toBe("removed");
    expect(result.favorites).toHaveLength(0);
  });

  test("film yang ditambah harus punya savedAt", () => {
    const result = toggleFavorite([], "uid-1", 101);
    expect(result.favorites[0].savedAt).toBeDefined();
  });

  test("toggle dua kali harus kembali ke kondisi awal", () => {
    const step1 = toggleFavorite(favorites, "uid-1", 202);
    const step2 = toggleFavorite(step1.favorites, "uid-1", 202);
    expect(step2.favorites).toHaveLength(favorites.length);
  });

  test("menghapus favorit tidak boleh mempengaruhi favorit user lain", () => {
    const mixed = [
      { userId: "uid-1", movieId: 101 },
      { userId: "uid-2", movieId: 101 },
    ];
    const result = toggleFavorite(mixed, "uid-1", 101);
    expect(result.favorites).toHaveLength(1);
    expect(result.favorites[0].userId).toBe("uid-2");
  });
});

// ── getUserFavorites ──────────────────────────────────────────────────────────
describe("getUserFavorites - ambil favorit per user", () => {
  const favorites = [
    { userId: "uid-1", movieId: 101 },
    { userId: "uid-1", movieId: 202 },
    { userId: "uid-2", movieId: 303 },
  ];

  test("harus return semua favorit milik user", () => {
    const result = getUserFavorites(favorites, "uid-1");
    expect(result).toHaveLength(2);
  });

  test("tidak boleh return favorit milik user lain", () => {
    const result = getUserFavorites(favorites, "uid-1");
    expect(result.every((f) => f.userId === "uid-1")).toBe(true);
  });

  test("harus return array kosong jika user belum punya favorit", () => {
    expect(getUserFavorites(favorites, "uid-999")).toHaveLength(0);
  });
});

// ── formatMovieForSave ───────────────────────────────────────────────────────
describe("formatMovieForSave - format data sebelum disimpan", () => {
  const movie = {
    id: 101,
    title: "Inception",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    vote_average: 8.8,
    media_type: "movie",
  };

  test("harus menyertakan userId dari parameter", () => {
    const result = formatMovieForSave(movie, "uid-1");
    expect(result.userId).toBe("uid-1");
  });

  test("harus menggunakan movie.id sebagai movieId", () => {
    const result = formatMovieForSave(movie, "uid-1");
    expect(result.movieId).toBe(101);
  });

  test("harus menggunakan title jika ada, name jika tidak", () => {
    const tvShow = { id: 5, name: "Breaking Bad" };
    const result = formatMovieForSave(tvShow, "uid-1");
    expect(result.title).toBe("Breaking Bad");
  });

  test("vote_average default ke 0 jika tidak ada", () => {
    const result = formatMovieForSave({ id: 1, title: "Test" }, "uid-1");
    expect(result.vote_average).toBe(0);
  });

  test("harus punya field savedAt", () => {
    const result = formatMovieForSave(movie, "uid-1");
    expect(result.savedAt).toBeDefined();
  });
});
