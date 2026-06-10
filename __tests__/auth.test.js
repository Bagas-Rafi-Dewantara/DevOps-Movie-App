/**
 * Unit Tests - Authentication & Session
 * Menguji logika validasi sesi dan proteksi akses user.
 */

const {
  getUserFromSession,
  isAuthenticated,
  requireAuth,
} = require("../lib/auth.utils");

// ── isAuthenticated ──────────────────────────────────────────────────────────
describe("isAuthenticated", () => {
  test("harus return false jika session null", () => {
    expect(isAuthenticated(null)).toBe(false);
  });

  test("harus return false jika session undefined", () => {
    expect(isAuthenticated(undefined)).toBe(false);
  });

  test("harus return false jika session.user tidak ada", () => {
    expect(isAuthenticated({})).toBe(false);
  });

  test("harus return false jika session.user.uid tidak ada", () => {
    expect(isAuthenticated({ user: { name: "John" } })).toBe(false);
  });

  test("harus return true jika session lengkap dengan uid", () => {
    const session = { user: { uid: "google-uid-123", name: "John" } };
    expect(isAuthenticated(session)).toBe(true);
  });
});

// ── requireAuth ──────────────────────────────────────────────────────────────
describe("requireAuth", () => {
  test("harus return 401 jika tidak login", () => {
    const result = requireAuth(null);
    expect(result.allowed).toBe(false);
    expect(result.status).toBe(401);
  });

  test("harus return allowed true jika sudah login", () => {
    const session = { user: { uid: "uid-123", name: "John" } };
    expect(requireAuth(session).allowed).toBe(true);
  });
});

// ── getUserFromSession ───────────────────────────────────────────────────────
describe("getUserFromSession", () => {
  test("harus return null jika session null", () => {
    expect(getUserFromSession(null)).toBeNull();
  });

  test("harus return null jika session.user tidak ada", () => {
    expect(getUserFromSession({})).toBeNull();
  });

  test("harus return data user yang benar dari session valid", () => {
    const session = {
      user: {
        uid: "google-123",
        name: "Budi Santoso",
        email: "budi@gmail.com",
        image: "https://photo.url",
      },
    };
    const user = getUserFromSession(session);
    expect(user.uid).toBe("google-123");
    expect(user.name).toBe("Budi Santoso");
    expect(user.email).toBe("budi@gmail.com");
  });

  test("uid harus berasal dari token.sub (Google OAuth)", () => {
    const session = { user: { uid: "token-sub-value", name: "Test" } };
    const user = getUserFromSession(session);
    expect(user.uid).toBe("token-sub-value");
  });
});

// ── Proteksi operasi sensitif ────────────────────────────────────────────────
describe("proteksi aksi yang butuh login", () => {
  const canSubmitReview = (session) => isAuthenticated(session);
  const canCreatePlaylist = (session) => isAuthenticated(session);
  const canSaveFavorite = (session) => isAuthenticated(session);

  test("user tidak login tidak bisa submit review", () => {
    expect(canSubmitReview(null)).toBe(false);
  });

  test("user tidak login tidak bisa buat playlist", () => {
    expect(canCreatePlaylist(undefined)).toBe(false);
  });

  test("user tidak login tidak bisa simpan favorit", () => {
    expect(canSaveFavorite({})).toBe(false);
  });

  test("user yang login bisa melakukan semua aksi", () => {
    const session = { user: { uid: "uid-123" } };
    expect(canSubmitReview(session)).toBe(true);
    expect(canCreatePlaylist(session)).toBe(true);
    expect(canSaveFavorite(session)).toBe(true);
  });
});
