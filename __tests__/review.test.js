/**
 * Unit Tests - Review Feature
 * Menguji logika validasi review, kalkulasi rating,
 * dan penentuan create vs update.
 */

const {
  validateReview,
  calcAvgRating,
  determineReviewAction,
} = require("../lib/review.utils");

// ── validateReview: field wajib ──────────────────────────────────────────────
describe("validateReview - field wajib", () => {
  const valid = {
    userId: "uid-1",
    movieId: 101,
    rating: 8,
    content: "Film yang sangat bagus!",
  };

  test("harus gagal jika userId tidak ada", () => {
    const { userId, ...rest } = valid;
    expect(validateReview(rest).valid).toBe(false);
    expect(validateReview(rest).status).toBe(400);
  });

  test("harus gagal jika movieId tidak ada", () => {
    const { movieId, ...rest } = valid;
    expect(validateReview(rest).valid).toBe(false);
  });

  test("harus gagal jika rating tidak ada", () => {
    const { rating, ...rest } = valid;
    expect(validateReview(rest).valid).toBe(false);
  });

  test("harus gagal jika content tidak ada", () => {
    const { content, ...rest } = valid;
    expect(validateReview(rest).valid).toBe(false);
  });

  test("harus gagal jika content kosong string", () => {
    expect(validateReview({ ...valid, content: "" }).valid).toBe(false);
  });

  test("harus gagal jika content hanya spasi", () => {
    expect(validateReview({ ...valid, content: "   " }).valid).toBe(false);
  });

  test("harus berhasil jika semua field valid", () => {
    const result = validateReview(valid);
    expect(result.valid).toBe(true);
    expect(result.status).toBe(201);
  });
});

// ── validateReview: rating range ─────────────────────────────────────────────
describe("validateReview - range rating (1-10)", () => {
  const base = { userId: "u1", movieId: 1, content: "Bagus" };

  test("rating 0 harus ditolak", () => {
    expect(validateReview({ ...base, rating: 0 }).valid).toBe(false);
  });

  test("rating 11 harus ditolak", () => {
    expect(validateReview({ ...base, rating: 11 }).valid).toBe(false);
  });

  test("rating negatif harus ditolak", () => {
    expect(validateReview({ ...base, rating: -1 }).valid).toBe(false);
  });

  test("rating 1 (minimum) harus diterima", () => {
    expect(validateReview({ ...base, rating: 1 }).valid).toBe(true);
  });

  test("rating 10 (maksimum) harus diterima", () => {
    expect(validateReview({ ...base, rating: 10 }).valid).toBe(true);
  });

  test("rating 5 (tengah) harus diterima", () => {
    expect(validateReview({ ...base, rating: 5 }).valid).toBe(true);
  });
});

// ── calcAvgRating ────────────────────────────────────────────────────────────
describe("calcAvgRating - kalkulasi rata-rata", () => {
  test("harus return null jika tidak ada review", () => {
    expect(calcAvgRating([])).toBeNull();
  });

  test("harus return null jika reviews undefined", () => {
    expect(calcAvgRating(undefined)).toBeNull();
  });

  test("harus return rating yang tepat untuk 1 review", () => {
    expect(calcAvgRating([{ rating: 7 }])).toBe(7.0);
  });

  test("harus menghitung rata-rata dengan benar (bilangan bulat)", () => {
    expect(calcAvgRating([{ rating: 8 }, { rating: 6 }])).toBe(7.0);
  });

  test("harus menghitung rata-rata dengan benar (desimal)", () => {
    expect(calcAvgRating([{ rating: 7 }, { rating: 8 }])).toBe(7.5);
  });

  test("harus dibulatkan 1 angka di belakang koma", () => {
    const reviews = [{ rating: 7 }, { rating: 8 }, { rating: 9 }];
    expect(calcAvgRating(reviews)).toBe(8.0);
  });

  test("semua rating maksimum harus return 10", () => {
    const reviews = [{ rating: 10 }, { rating: 10 }, { rating: 10 }];
    expect(calcAvgRating(reviews)).toBe(10.0);
  });

  test("semua rating minimum harus return 1", () => {
    const reviews = [{ rating: 1 }, { rating: 1 }];
    expect(calcAvgRating(reviews)).toBe(1.0);
  });
});

// ── determineReviewAction: create vs update ──────────────────────────────────
describe("determineReviewAction - create atau update", () => {
  const newData = { rating: 9, content: "Luar biasa!" };

  test("harus 'create' jika user belum pernah review film ini", () => {
    const result = determineReviewAction(null, newData);
    expect(result.action).toBe("create");
  });

  test("harus 'update' jika user sudah pernah review film ini", () => {
    const existing = { userId: "u1", movieId: 1, rating: 7, content: "Oke" };
    const result = determineReviewAction(existing, newData);
    expect(result.action).toBe("update");
  });

  test("update harus memperbarui rating dan content", () => {
    const existing = { userId: "u1", movieId: 1, rating: 7, content: "Oke" };
    const result = determineReviewAction(existing, newData);
    expect(result.data.rating).toBe(9);
    expect(result.data.content).toBe("Luar biasa!");
  });

  test("update harus mempertahankan userId dan movieId", () => {
    const existing = { userId: "u1", movieId: 101, rating: 7, content: "Oke" };
    const result = determineReviewAction(existing, newData);
    expect(result.data.userId).toBe("u1");
    expect(result.data.movieId).toBe(101);
  });

  test("create harus punya field createdAt", () => {
    const result = determineReviewAction(null, newData);
    expect(result.data.createdAt).toBeDefined();
  });

  test("update harus punya field updatedAt", () => {
    const existing = { userId: "u1", movieId: 1, rating: 5, content: "Biasa" };
    const result = determineReviewAction(existing, newData);
    expect(result.data.updatedAt).toBeDefined();
  });
});
