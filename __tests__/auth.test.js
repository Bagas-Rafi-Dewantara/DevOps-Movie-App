const {
  generateUsername,
  buildSession,
  isAuthenticated,
  extractUid,
  validateSessionUser,
} = require("../lib/auth.utils");

describe("generateUsername", () => {
  test("converts full name to lowercase no-space username", () => {
    expect(generateUsername("John Doe")).toBe("johndoe");
  });

  test("single word name stays the same (lowercased)", () => {
    expect(generateUsername("Alice")).toBe("alice");
  });

  test("handles three-word name", () => {
    expect(generateUsername("John Michael Doe")).toBe("johnmichaeldoe");
  });

  test("already lowercase name is unchanged", () => {
    expect(generateUsername("john doe")).toBe("johndoe");
  });

  test("returns empty string for empty input", () => {
    expect(generateUsername("")).toBe("");
  });

  test("returns empty string for null input", () => {
    expect(generateUsername(null)).toBe("");
  });

  test("returns empty string for non-string input", () => {
    expect(generateUsername(123)).toBe("");
  });

  test("uppercased name is fully lowercased", () => {
    expect(generateUsername("JOHN DOE")).toBe("johndoe");
  });
});

describe("buildSession", () => {
  const baseSession = {
    user: { name: "John Doe", email: "john@example.com" },
  };
  const token = { sub: "uid-123" };

  test("adds username to session user", () => {
    const result = buildSession(baseSession, token);
    expect(result.user.username).toBe("johndoe");
  });

  test("adds uid from token.sub", () => {
    const result = buildSession(baseSession, token);
    expect(result.user.uid).toBe("uid-123");
  });

  test("does not mutate original session", () => {
    const original = { user: { name: "Jane Doe", email: "jane@example.com" } };
    buildSession(original, token);
    expect(original.user.username).toBeUndefined();
  });

  test("returns session unchanged when no user object", () => {
    const emptySession = {};
    const result = buildSession(emptySession, token);
    expect(result).toEqual(emptySession);
  });

  test("uid is null when token has no sub", () => {
    const result = buildSession(baseSession, {});
    expect(result.user.uid).toBeNull();
  });

  test("uid is null when token is null", () => {
    const result = buildSession(baseSession, null);
    expect(result.user.uid).toBeNull();
  });

  test("returns session as-is when session is null", () => {
    expect(buildSession(null, token)).toBeNull();
  });
});

describe("isAuthenticated", () => {
  test("returns true for valid session with user and email", () => {
    expect(isAuthenticated({ user: { email: "a@b.com", name: "Alice" } })).toBe(
      true,
    );
  });

  test("returns false for null session", () => {
    expect(isAuthenticated(null)).toBe(false);
  });

  test("returns false for session without user", () => {
    expect(isAuthenticated({})).toBe(false);
  });

  test("returns false for session with user but no email", () => {
    expect(isAuthenticated({ user: { name: "Alice" } })).toBe(false);
  });

  test("returns false for undefined session", () => {
    expect(isAuthenticated(undefined)).toBe(false);
  });
});

describe("extractUid", () => {
  test("extracts sub from token", () => {
    expect(extractUid({ sub: "uid-456" })).toBe("uid-456");
  });

  test("returns null when token has no sub", () => {
    expect(extractUid({})).toBeNull();
  });

  test("returns null for null token", () => {
    expect(extractUid(null)).toBeNull();
  });

  test("returns null for undefined token", () => {
    expect(extractUid(undefined)).toBeNull();
  });
});

describe("validateSessionUser", () => {
  test("valid user returns valid true", () => {
    const result = validateSessionUser({
      name: "Alice",
      email: "alice@example.com",
    });
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });

  test("null user returns invalid", () => {
    const result = validateSessionUser(null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("No user in session");
  });

  test("missing name returns invalid", () => {
    const result = validateSessionUser({ email: "alice@example.com" });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing name");
  });

  test("missing email returns invalid", () => {
    const result = validateSessionUser({ name: "Alice" });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing email");
  });
});
