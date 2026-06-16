const {
  TMDB_BASE_URL,
  IMAGE_BASE_URL,
  TRAILER_BASE_URL,
  buildRequestUrls,
  buildImageUrl,
  buildTrailerUrl,
  buildDetailUrl,
  buildVideosUrl,
  buildReviewsUrl,
} = require("../lib/requests.utils");

const API_KEY = "test_api_key_123";

describe("buildRequestUrls", () => {
  let urls;

  beforeEach(() => {
    urls = buildRequestUrls(API_KEY);
  });

  test("returns object with all 8 request keys", () => {
    const keys = [
      "fetchTrending",
      "fetchNetflixOriginals",
      "fetchTopRated",
      "fetchActionMovies",
      "fetchComedyMovies",
      "fetchHorrorMovies",
      "fetchRomanceMovies",
      "fetchDocumentaries",
    ];
    keys.forEach((key) => expect(urls).toHaveProperty(key));
  });

  test("fetchTrending uses trending/all/week endpoint", () => {
    expect(urls.fetchTrending).toContain("/trending/all/week");
    expect(urls.fetchTrending).toContain(`api_key=${API_KEY}`);
  });

  test("fetchNetflixOriginals uses with_networks=213", () => {
    expect(urls.fetchNetflixOriginals).toContain("with_networks=213");
  });

  test("fetchTopRated uses movie/top_rated endpoint", () => {
    expect(urls.fetchTopRated).toContain("/movie/top_rated");
  });

  test("fetchActionMovies uses genre id 28", () => {
    expect(urls.fetchActionMovies).toContain("with_genres=28");
  });

  test("fetchComedyMovies uses genre id 35", () => {
    expect(urls.fetchComedyMovies).toContain("with_genres=35");
  });

  test("fetchHorrorMovies uses genre id 27", () => {
    expect(urls.fetchHorrorMovies).toContain("with_genres=27");
  });

  test("fetchRomanceMovies uses genre id 10749", () => {
    expect(urls.fetchRomanceMovies).toContain("with_genres=10749");
  });

  test("fetchDocumentaries uses genre id 99", () => {
    expect(urls.fetchDocumentaries).toContain("with_genres=99");
  });

  test("all URLs start with TMDB base URL", () => {
    Object.values(urls).forEach((url) => {
      expect(url).toContain(TMDB_BASE_URL);
    });
  });
});

describe("buildImageUrl", () => {
  test("prepends IMAGE_BASE_URL to path", () => {
    const result = buildImageUrl("/abc123.jpg");
    expect(result).toBe(`${IMAGE_BASE_URL}/abc123.jpg`);
  });

  test("returns null for empty path", () => {
    expect(buildImageUrl("")).toBeNull();
  });

  test("returns null for null path", () => {
    expect(buildImageUrl(null)).toBeNull();
  });

  test("returns null for undefined path", () => {
    expect(buildImageUrl(undefined)).toBeNull();
  });

  test("constructs correct full URL", () => {
    expect(buildImageUrl("/poster.jpg")).toBe(
      "https://image.tmdb.org/t/p/original/poster.jpg",
    );
  });
});

describe("buildTrailerUrl", () => {
  test("prepends YouTube URL to video key", () => {
    const result = buildTrailerUrl("dQw4w9WgXcQ");
    expect(result).toBe(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
  });

  test("returns null for empty key", () => {
    expect(buildTrailerUrl("")).toBeNull();
  });

  test("returns null for null key", () => {
    expect(buildTrailerUrl(null)).toBeNull();
  });

  test("returns null for undefined key", () => {
    expect(buildTrailerUrl(undefined)).toBeNull();
  });
});

describe("buildDetailUrl", () => {
  test("builds movie detail URL correctly", () => {
    const url = buildDetailUrl("movie", 550, API_KEY);
    expect(url).toContain("/movie/550");
    expect(url).toContain(`api_key=${API_KEY}`);
  });

  test("builds tv detail URL correctly", () => {
    const url = buildDetailUrl("tv", 1399, API_KEY);
    expect(url).toContain("/tv/1399");
  });

  test("returns null when id is missing", () => {
    expect(buildDetailUrl("movie", null, API_KEY)).toBeNull();
  });

  test("returns null when mediaType is missing", () => {
    expect(buildDetailUrl(null, 550, API_KEY)).toBeNull();
  });

  test("includes language en-US", () => {
    const url = buildDetailUrl("movie", 550, API_KEY);
    expect(url).toContain("language=en-US");
  });
});

describe("buildVideosUrl", () => {
  test("includes /videos in path", () => {
    const url = buildVideosUrl("movie", 550, API_KEY);
    expect(url).toContain("/videos");
  });

  test("returns null for missing id", () => {
    expect(buildVideosUrl("movie", null, API_KEY)).toBeNull();
  });

  test("returns null for missing mediaType", () => {
    expect(buildVideosUrl(null, 550, API_KEY)).toBeNull();
  });
});

describe("buildReviewsUrl", () => {
  test("includes /reviews in path", () => {
    const url = buildReviewsUrl("movie", 550, API_KEY);
    expect(url).toContain("/reviews");
  });

  test("includes page=1", () => {
    const url = buildReviewsUrl("movie", 550, API_KEY);
    expect(url).toContain("page=1");
  });

  test("returns null for missing id", () => {
    expect(buildReviewsUrl("movie", null, API_KEY)).toBeNull();
  });

  test("works for tv show", () => {
    const url = buildReviewsUrl("tv", 1399, API_KEY);
    expect(url).toContain("/tv/1399/reviews");
  });
});
