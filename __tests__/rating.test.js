const {
  formatRating,
  getProgressValue,
  getRatingColor,
  popularityToRating,
  formatRatingDisplay,
} = require("../lib/rating.utils");

describe("formatRating", () => {
  test("floors to one decimal place", () => {
    expect(formatRating(7.56)).toBe(7.5);
  });

  test("whole numbers return .0 equivalent", () => {
    expect(formatRating(8)).toBe(8);
  });

  test("returns 0 for null", () => {
    expect(formatRating(null)).toBe(0);
  });

  test("returns 0 for undefined", () => {
    expect(formatRating(undefined)).toBe(0);
  });

  test("returns 0 for non-number input", () => {
    expect(formatRating("7.5")).toBe(0);
  });

  test("handles 0 correctly", () => {
    expect(formatRating(0)).toBe(0);
  });

  test("handles 10 correctly", () => {
    expect(formatRating(10)).toBe(10);
  });

  test("does not round up (.49 stays as .4)", () => {
    expect(formatRating(7.49)).toBe(7.4);
  });

  test("handles decimal precision correctly", () => {
    expect(formatRating(6.3)).toBe(6.3);
  });
});

describe("getProgressValue", () => {
  test("converts 7.5 to 75", () => {
    expect(getProgressValue(7.5)).toBe(75);
  });

  test("converts 10 to 100", () => {
    expect(getProgressValue(10)).toBe(100);
  });

  test("converts 0 to 0", () => {
    expect(getProgressValue(0)).toBe(0);
  });

  test("returns 0 for non-number input", () => {
    expect(getProgressValue("8")).toBe(0);
  });

  test("converts 5 to 50", () => {
    expect(getProgressValue(5)).toBe(50);
  });
});

describe("getRatingColor", () => {
  test("returns good for rating 7 or above", () => {
    expect(getRatingColor(7)).toBe("good");
    expect(getRatingColor(9.5)).toBe("good");
    expect(getRatingColor(10)).toBe("good");
  });

  test("returns average for rating between 5 and 6.9", () => {
    expect(getRatingColor(5)).toBe("average");
    expect(getRatingColor(6.9)).toBe("average");
  });

  test("returns poor for rating below 5", () => {
    expect(getRatingColor(4.9)).toBe("poor");
    expect(getRatingColor(0)).toBe("poor");
  });

  test("returns poor for non-number input", () => {
    expect(getRatingColor("7")).toBe("poor");
    expect(getRatingColor(null)).toBe("poor");
  });
});

describe("popularityToRating", () => {
  test("divides popularity by 10", () => {
    expect(popularityToRating(50)).toBe(5);
  });

  test("caps at 10 for very high popularity", () => {
    expect(popularityToRating(200)).toBe(10);
  });

  test("returns 0 for 0 popularity", () => {
    expect(popularityToRating(0)).toBe(0);
  });

  test("returns 0 for non-number", () => {
    expect(popularityToRating("100")).toBe(0);
  });

  test("returns exactly 10 when popularity is 100", () => {
    expect(popularityToRating(100)).toBe(10);
  });
});

describe("formatRatingDisplay", () => {
  test("formats 7.5 as '7.5 / 10'", () => {
    expect(formatRatingDisplay(7.5)).toBe("7.5 / 10");
  });

  test("formats 8.0 as '8 / 10'", () => {
    expect(formatRatingDisplay(8.0)).toBe("8 / 10");
  });

  test("formats 0 as '0 / 10'", () => {
    expect(formatRatingDisplay(0)).toBe("0 / 10");
  });

  test("formats 10 as '10 / 10'", () => {
    expect(formatRatingDisplay(10)).toBe("10 / 10");
  });
});
