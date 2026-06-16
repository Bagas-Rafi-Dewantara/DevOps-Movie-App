const {
  validateSaveMovieInput,
  determineSaveAction,
  buildMoviePayload,
  isMovieFavorited,
  getMovieDisplayTitle,
  formatSaveResponse,
} = require("../lib/movie.utils");

describe("validateSaveMovieInput", () => {
  const validBody = {
    movieId: "tt1234567",
    userId: "user-abc",
    title: "Inception",
  };

  test("returns valid for a complete body", () => {
    const result = validateSaveMovieInput(validBody);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });

  test("returns invalid when body is null", () => {
    const result = validateSaveMovieInput(null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("No request body");
  });

  test("returns invalid when movieId is missing", () => {
    const result = validateSaveMovieInput({ userId: "u1", title: "Movie" });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("movieId");
  });

  test("returns invalid when userId is missing", () => {
    const result = validateSaveMovieInput({ movieId: "m1", title: "Movie" });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("userId");
  });

  test("returns invalid when title is missing", () => {
    const result = validateSaveMovieInput({ movieId: "m1", userId: "u1" });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("title");
  });

  test("returns invalid for empty object", () => {
    const result = validateSaveMovieInput({});
    expect(result.valid).toBe(false);
  });
});

describe("determineSaveAction", () => {
  test("returns like when no existing movie (null)", () => {
    expect(determineSaveAction(null)).toBe("like");
  });

  test("returns like when no existing movie (undefined)", () => {
    expect(determineSaveAction(undefined)).toBe("like");
  });

  test("returns dislike when existing movie is present", () => {
    expect(determineSaveAction({ movieId: "m1" })).toBe("dislike");
  });

  test("returns dislike for any truthy existing movie", () => {
    expect(determineSaveAction({})).toBe("dislike");
  });
});

describe("buildMoviePayload", () => {
  const body = {
    userId: "user-1",
    movieId: "movie-1",
    title: "Inception",
    overview: "A mind-bending thriller",
    name: "Inception",
    backdrop_path: "/backdrop.jpg",
    poster_path: "/poster.jpg",
    original_name: "Inception",
    vote_average: 8.8,
  };

  test("extracts all movie fields correctly", () => {
    const payload = buildMoviePayload(body);
    expect(payload.userId).toBe("user-1");
    expect(payload.movieId).toBe("movie-1");
    expect(payload.title).toBe("Inception");
    expect(payload.vote_average).toBe(8.8);
  });

  test("defaults overview to empty string when missing", () => {
    const payload = buildMoviePayload({ ...body, overview: undefined });
    expect(payload.overview).toBe("");
  });

  test("defaults backdrop_path to null when missing", () => {
    const payload = buildMoviePayload({ ...body, backdrop_path: undefined });
    expect(payload.backdrop_path).toBeNull();
  });

  test("defaults poster_path to null when missing", () => {
    const payload = buildMoviePayload({ ...body, poster_path: undefined });
    expect(payload.poster_path).toBeNull();
  });

  test("defaults vote_average to 0 when missing", () => {
    const payload = buildMoviePayload({ ...body, vote_average: undefined });
    expect(payload.vote_average).toBe(0);
  });

  test("defaults name to empty string when missing", () => {
    const payload = buildMoviePayload({ ...body, name: undefined });
    expect(payload.name).toBe("");
  });
});

describe("isMovieFavorited", () => {
  const likedMovies = ["m1", "m2", "m3"];

  test("returns true when movie is in favorites", () => {
    expect(isMovieFavorited("m1", likedMovies)).toBe(true);
  });

  test("returns false when movie is not in favorites", () => {
    expect(isMovieFavorited("m99", likedMovies)).toBe(false);
  });

  test("returns false for empty favorites list", () => {
    expect(isMovieFavorited("m1", [])).toBe(false);
  });

  test("returns false when favorites is not an array", () => {
    expect(isMovieFavorited("m1", null)).toBe(false);
    expect(isMovieFavorited("m1", undefined)).toBe(false);
  });
});

describe("getMovieDisplayTitle", () => {
  test("returns title when available", () => {
    expect(
      getMovieDisplayTitle({ title: "Inception", name: "Inception" }),
    ).toBe("Inception");
  });

  test("falls back to name when title is missing", () => {
    expect(getMovieDisplayTitle({ name: "Breaking Bad" })).toBe("Breaking Bad");
  });

  test("falls back to original_name when both title and name are missing", () => {
    expect(getMovieDisplayTitle({ original_name: "Dark" })).toBe("Dark");
  });

  test("returns empty string for null movie", () => {
    expect(getMovieDisplayTitle(null)).toBe("");
  });

  test("returns empty string when all title fields are missing", () => {
    expect(getMovieDisplayTitle({})).toBe("");
  });
});

describe("formatSaveResponse", () => {
  test("returns status like for like action", () => {
    expect(formatSaveResponse("like")).toEqual({ status: "like" });
  });

  test("returns status disLike for dislike action", () => {
    expect(formatSaveResponse("dislike")).toEqual({ status: "disLike" });
  });

  test("returns status disLike for any non-like action", () => {
    expect(formatSaveResponse("remove")).toEqual({ status: "disLike" });
  });
});
