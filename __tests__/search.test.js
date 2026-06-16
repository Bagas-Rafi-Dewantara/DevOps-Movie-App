const {
  getGenreList,
  buildSearchUrl,
  buildDiscoverUrl,
  buildFetchUrl,
  getNavigationPath,
  hasActiveFilters,
  clearFilters,
  findGenreName,
  MOVIE_GENRES,
  TV_GENRES,
  SORT_OPTIONS,
  DEFAULT_SORT,
} = require("../lib/search.utils");

const API_KEY = "test_api_key";

describe("getGenreList", () => {
  test("returns TV_GENRES for tv option", () => {
    expect(getGenreList("tv")).toBe(TV_GENRES);
  });

  test("returns MOVIE_GENRES for movie option", () => {
    expect(getGenreList("movie")).toBe(MOVIE_GENRES);
  });

  test("returns MOVIE_GENRES as default for unknown option", () => {
    expect(getGenreList("person")).toBe(MOVIE_GENRES);
  });

  test("MOVIE_GENRES contains Action with id 28", () => {
    const action = MOVIE_GENRES.find((g) => g.name === "Action");
    expect(action).toBeDefined();
    expect(action.id).toBe(28);
  });

  test("TV_GENRES contains Kids genre", () => {
    const kids = TV_GENRES.find((g) => g.name === "Kids");
    expect(kids).toBeDefined();
  });
});

describe("buildSearchUrl", () => {
  test("builds correct URL for movie search", () => {
    const url = buildSearchUrl("movie", "Avengers", API_KEY);
    expect(url).toContain("/search/movie");
    expect(url).toContain("query=Avengers");
    expect(url).toContain(`api_key=${API_KEY}`);
  });

  test("builds correct URL for tv search", () => {
    const url = buildSearchUrl("tv", "Breaking Bad", API_KEY);
    expect(url).toContain("/search/tv");
    expect(url).toContain("query=Breaking%20Bad");
  });

  test("encodes special characters in search term", () => {
    const url = buildSearchUrl("movie", "Spider-Man: No Way Home", API_KEY);
    expect(url).toContain("Spider-Man%3A%20No%20Way%20Home");
  });

  test("includes include_adult=false", () => {
    const url = buildSearchUrl("movie", "test", API_KEY);
    expect(url).toContain("include_adult=false");
  });

  test("includes page=1", () => {
    const url = buildSearchUrl("movie", "test", API_KEY);
    expect(url).toContain("page=1");
  });
});

describe("buildDiscoverUrl", () => {
  test("builds URL with default sort when no filters", () => {
    const url = buildDiscoverUrl("movie", {}, API_KEY);
    expect(url).toContain("/discover/movie");
    expect(url).toContain("sort_by=popularity.desc");
  });

  test("appends genre filter when selectedGenre provided", () => {
    const url = buildDiscoverUrl("movie", { selectedGenre: "28" }, API_KEY);
    expect(url).toContain("with_genres=28");
  });

  test("appends primary_release_year for movie with year", () => {
    const url = buildDiscoverUrl("movie", { selectedYear: "2022" }, API_KEY);
    expect(url).toContain("primary_release_year=2022");
  });

  test("appends first_air_date_year for tv with year", () => {
    const url = buildDiscoverUrl("tv", { selectedYear: "2021" }, API_KEY);
    expect(url).toContain("first_air_date_year=2021");
  });

  test("uses custom sortBy when provided", () => {
    const url = buildDiscoverUrl(
      "movie",
      { sortBy: "vote_average.desc" },
      API_KEY,
    );
    expect(url).toContain("sort_by=vote_average.desc");
  });

  test("omits genre param when selectedGenre is empty", () => {
    const url = buildDiscoverUrl("movie", { selectedGenre: "" }, API_KEY);
    expect(url).not.toContain("with_genres");
  });

  test("handles null filters gracefully", () => {
    const url = buildDiscoverUrl("movie", null, API_KEY);
    expect(url).toContain("sort_by=popularity.desc");
  });
});

describe("buildFetchUrl", () => {
  test("returns person search URL when option is person with query", () => {
    const url = buildFetchUrl("person", "Tom Hanks", {}, API_KEY);
    expect(url).toContain("/search/person");
    expect(url).toContain("Tom%20Hanks");
  });

  test("returns null for person option with empty search term", () => {
    const url = buildFetchUrl("person", "", {}, API_KEY);
    expect(url).toBeNull();
  });

  test("returns search URL when movie option has search term", () => {
    const url = buildFetchUrl("movie", "Inception", {}, API_KEY);
    expect(url).toContain("/search/movie");
  });

  test("returns discover URL when movie option has no search term", () => {
    const url = buildFetchUrl("movie", "", {}, API_KEY);
    expect(url).toContain("/discover/movie");
  });

  test("returns search URL when tv option has search term", () => {
    const url = buildFetchUrl("tv", "Friends", {}, API_KEY);
    expect(url).toContain("/search/tv");
  });

  test("returns discover URL when tv option has no search term", () => {
    const url = buildFetchUrl("tv", "  ", {}, API_KEY);
    expect(url).toContain("/discover/tv");
  });
});

describe("getNavigationPath", () => {
  test("returns /details/movieID for movie option", () => {
    expect(getNavigationPath("movie", 123)).toBe("/details/movie123");
  });

  test("returns /details/ID for tv option", () => {
    expect(getNavigationPath("tv", 456)).toBe("/details/456");
  });

  test("returns /cast/ID for person option", () => {
    expect(getNavigationPath("person", 789)).toBe("/cast/789");
  });

  test("returns null for unknown option", () => {
    expect(getNavigationPath("unknown", 1)).toBeNull();
  });

  test("returns null when id is falsy", () => {
    expect(getNavigationPath("movie", 0)).toBeNull();
    expect(getNavigationPath("movie", null)).toBeNull();
  });
});

describe("hasActiveFilters", () => {
  test("returns false with default values", () => {
    expect(hasActiveFilters("", "", DEFAULT_SORT)).toBe(false);
  });

  test("returns true when genre is selected", () => {
    expect(hasActiveFilters("28", "", DEFAULT_SORT)).toBe(true);
  });

  test("returns true when year is selected", () => {
    expect(hasActiveFilters("", "2022", DEFAULT_SORT)).toBe(true);
  });

  test("returns true when sort is non-default", () => {
    expect(hasActiveFilters("", "", "vote_average.desc")).toBe(true);
  });

  test("returns true when all filters are active", () => {
    expect(hasActiveFilters("28", "2022", "revenue.desc")).toBe(true);
  });
});

describe("clearFilters", () => {
  test("returns default empty genre", () => {
    expect(clearFilters().selectedGenre).toBe("");
  });

  test("returns default empty year", () => {
    expect(clearFilters().selectedYear).toBe("");
  });

  test("returns default sort", () => {
    expect(clearFilters().sortBy).toBe(DEFAULT_SORT);
  });
});

describe("findGenreName", () => {
  test("finds Action genre by id for movie", () => {
    expect(findGenreName("movie", 28)).toBe("Action");
  });

  test("finds Kids genre by id for tv", () => {
    expect(findGenreName("tv", 10762)).toBe("Kids");
  });

  test("returns null for unknown genre id", () => {
    expect(findGenreName("movie", 9999)).toBeNull();
  });

  test("works with string genre id", () => {
    expect(findGenreName("movie", "28")).toBe("Action");
  });
});

describe("SORT_OPTIONS", () => {
  test("has 5 sort options", () => {
    expect(SORT_OPTIONS.length).toBe(5);
  });

  test("first option is Most Popular", () => {
    expect(SORT_OPTIONS[0].label).toBe("Most Popular");
    expect(SORT_OPTIONS[0].value).toBe("popularity.desc");
  });
});
