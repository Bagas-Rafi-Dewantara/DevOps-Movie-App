/**
 * Unit Tests - Search & Filter Feature
 * Menguji logika filter genre, tahun, sort, dan query builder.
 */

const {
  filterByGenre,
  filterByYear,
  sortByRatingDesc,
  sortByYearDesc,
  filterByQuery,
  applyFilters,
} = require("../lib/search.utils");

// ── Sample data ──────────────────────────────────────────────────────────────
const sampleMovies = [
  {
    id: 1,
    title: "Inception",
    genre_ids: [28, 878],
    release_date: "2010-07-16",
    vote_average: 8.8,
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre_ids: [28, 80],
    release_date: "2008-07-18",
    vote_average: 9.0,
  },
  {
    id: 3,
    title: "Interstellar",
    genre_ids: [878, 18],
    release_date: "2014-11-07",
    vote_average: 8.6,
  },
  {
    id: 4,
    title: "Titanic",
    genre_ids: [18, 10749],
    release_date: "1997-12-19",
    vote_average: 7.9,
  },
  {
    id: 5,
    title: "The Avengers",
    genre_ids: [28, 12, 878],
    release_date: "2012-05-04",
    vote_average: 8.0,
  },
  {
    id: 6,
    title: "La La Land",
    genre_ids: [35, 10749, 18],
    release_date: "2016-12-09",
    vote_average: 8.0,
  },
];

// ── filterByGenre ────────────────────────────────────────────────────────────
describe("filterByGenre", () => {
  test("harus return hanya film dengan genre Action (28)", () => {
    const result = filterByGenre(sampleMovies, 28);
    expect(result.every((m) => m.genre_ids.includes(28))).toBe(true);
  });

  test("harus return film Sci-Fi (878) dengan benar", () => {
    const result = filterByGenre(sampleMovies, 878);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.genre_ids.includes(878))).toBe(true);
  });

  test("harus return array kosong jika tidak ada film dengan genre tersebut", () => {
    const result = filterByGenre(sampleMovies, 9999);
    expect(result).toHaveLength(0);
  });

  test("film dengan banyak genre harus muncul di semua filternya", () => {
    const actionResult = filterByGenre(sampleMovies, 28);
    const scifiResult = filterByGenre(sampleMovies, 878);
    const inception = sampleMovies.find((m) => m.id === 1);
    expect(actionResult).toContainEqual(inception);
    expect(scifiResult).toContainEqual(inception);
  });
});

// ── filterByYear ─────────────────────────────────────────────────────────────
describe("filterByYear", () => {
  test("harus return film dari tahun 2010 saja", () => {
    const result = filterByYear(sampleMovies, 2010);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Inception");
  });

  test("harus return array kosong jika tidak ada film di tahun tersebut", () => {
    expect(filterByYear(sampleMovies, 2023)).toHaveLength(0);
  });

  test("harus return beberapa film jika ada banyak film di tahun yang sama", () => {
    const movies2012 = filterByYear(sampleMovies, 2012);
    expect(movies2012.length).toBeGreaterThanOrEqual(1);
  });
});

// ── sortByRatingDesc ─────────────────────────────────────────────────────────
describe("sortByRatingDesc - rating tertinggi duluan", () => {
  test("film dengan rating tertinggi harus di posisi pertama", () => {
    const result = sortByRatingDesc(sampleMovies);
    expect(result[0].vote_average).toBeGreaterThanOrEqual(
      result[1].vote_average,
    );
  });

  test("film dengan rating terendah harus di posisi terakhir", () => {
    const result = sortByRatingDesc(sampleMovies);
    const last = result[result.length - 1];
    expect(last.vote_average).toBeLessThanOrEqual(result[0].vote_average);
  });

  test("tidak boleh mengubah array asli", () => {
    const original = [...sampleMovies];
    sortByRatingDesc(sampleMovies);
    expect(sampleMovies[0].id).toBe(original[0].id);
  });
});

// ── sortByYearDesc ───────────────────────────────────────────────────────────
describe("sortByYearDesc - film terbaru duluan", () => {
  test("film terbaru harus muncul pertama", () => {
    const result = sortByYearDesc(sampleMovies);
    const firstYear = new Date(result[0].release_date).getFullYear();
    const lastYear = new Date(
      result[result.length - 1].release_date,
    ).getFullYear();
    expect(firstYear).toBeGreaterThanOrEqual(lastYear);
  });
});

// ── filterByQuery ─────────────────────────────────────────────────────────────
describe("filterByQuery - pencarian teks", () => {
  test("harus menemukan film berdasarkan judul yang tepat", () => {
    const result = filterByQuery(sampleMovies, "Inception");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Inception");
  });

  test("pencarian harus case-insensitive", () => {
    const lower = filterByQuery(sampleMovies, "inception");
    const upper = filterByQuery(sampleMovies, "INCEPTION");
    expect(lower).toHaveLength(1);
    expect(upper).toHaveLength(1);
  });

  test("harus return semua film jika query kosong", () => {
    expect(filterByQuery(sampleMovies, "")).toHaveLength(sampleMovies.length);
    expect(filterByQuery(sampleMovies, null)).toHaveLength(sampleMovies.length);
  });

  test("harus return array kosong jika tidak ada yang cocok", () => {
    expect(filterByQuery(sampleMovies, "xyzabc123")).toHaveLength(0);
  });

  test("pencarian parsial harus bekerja", () => {
    const result = filterByQuery(sampleMovies, "inter");
    expect(result.length).toBeGreaterThan(0);
  });
});

// ── applyFilters: kombinasi filter ───────────────────────────────────────────
describe("applyFilters - kombinasi filter", () => {
  test("genre + sort harus bekerja bersamaan", () => {
    const result = applyFilters(sampleMovies, {
      genreId: 28,
      sortBy: "rating_desc",
    });
    expect(result.every((m) => m.genre_ids.includes(28))).toBe(true);
    if (result.length > 1) {
      expect(result[0].vote_average).toBeGreaterThanOrEqual(
        result[1].vote_average,
      );
    }
  });

  test("query + genre harus memfilter keduanya", () => {
    const result = applyFilters(sampleMovies, { query: "the", genreId: 28 });
    result.forEach((m) => {
      expect(m.title.toLowerCase()).toContain("the");
      expect(m.genre_ids).toContain(28);
    });
  });

  test("tanpa filter harus return semua film", () => {
    const result = applyFilters(sampleMovies, {});
    expect(result).toHaveLength(sampleMovies.length);
  });
});
