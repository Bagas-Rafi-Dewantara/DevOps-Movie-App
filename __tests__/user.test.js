const {
  validateUserInput,
  buildUserPayload,
  determineUserAction,
  formatExistingUserResponse,
  formatNewUserResponse,
  formatGetUserResponse,
  isValidEmail,
} = require("../lib/user.utils");

describe("validateUserInput", () => {
  const validBody = {
    userId: "google-uid-123",
    name: "John Doe",
    email: "john@example.com",
  };

  test("returns valid for complete body", () => {
    const result = validateUserInput(validBody);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });

  test("returns invalid for null body", () => {
    const result = validateUserInput(null);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("No request body");
  });

  test("returns invalid when userId is missing", () => {
    const result = validateUserInput({ name: "John", email: "j@j.com" });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("userId");
  });

  test("returns invalid when name is missing", () => {
    const result = validateUserInput({
      userId: "uid-1",
      email: "j@j.com",
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("name");
  });

  test("returns invalid when email is missing", () => {
    const result = validateUserInput({ userId: "uid-1", name: "John" });
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("email");
  });

  test("returns invalid for empty object", () => {
    const result = validateUserInput({});
    expect(result.valid).toBe(false);
  });
});

describe("buildUserPayload", () => {
  const body = {
    userId: "uid-1",
    name: "Alice",
    email: "alice@example.com",
    userPhotoUrl: "https://photo.url/img.jpg",
    country: "US",
  };

  test("extracts all fields correctly", () => {
    const payload = buildUserPayload(body);
    expect(payload.userId).toBe("uid-1");
    expect(payload.name).toBe("Alice");
    expect(payload.email).toBe("alice@example.com");
    expect(payload.userPhotoUrl).toBe("https://photo.url/img.jpg");
    expect(payload.country).toBe("US");
  });

  test("defaults userPhotoUrl to null when missing", () => {
    const payload = buildUserPayload({ ...body, userPhotoUrl: undefined });
    expect(payload.userPhotoUrl).toBeNull();
  });

  test("defaults country to empty string when missing", () => {
    const payload = buildUserPayload({ ...body, country: undefined });
    expect(payload.country).toBe("");
  });
});

describe("determineUserAction", () => {
  test("returns create when no existing user", () => {
    expect(determineUserAction(null)).toBe("create");
    expect(determineUserAction(undefined)).toBe("create");
  });

  test("returns exists when user is found", () => {
    expect(determineUserAction({ userId: "uid-1" })).toBe("exists");
  });

  test("returns exists for any truthy value", () => {
    expect(determineUserAction({})).toBe("exists");
  });
});

describe("formatExistingUserResponse", () => {
  test("returns correct status and error message", () => {
    const user = { userId: "uid-1", name: "Alice" };
    const response = formatExistingUserResponse(user);
    expect(response.status).toBe("exits");
    expect(response.error).toBe("user Already exits");
    expect(response.quote).toBe(user);
  });

  test("quote is the same user object reference", () => {
    const user = { userId: "uid-2" };
    const response = formatExistingUserResponse(user);
    expect(response.quote).toBe(user);
  });
});

describe("formatNewUserResponse", () => {
  test("returns status ok", () => {
    expect(formatNewUserResponse()).toEqual({ status: "ok" });
  });
});

describe("formatGetUserResponse", () => {
  test("returns status ok with user in quote", () => {
    const user = { userId: "uid-3", name: "Bob" };
    const response = formatGetUserResponse(user);
    expect(response.status).toBe("ok");
    expect(response.quote).toBe(user);
  });

  test("handles null user gracefully", () => {
    const response = formatGetUserResponse(null);
    expect(response.status).toBe("ok");
    expect(response.quote).toBeNull();
  });
});

describe("isValidEmail", () => {
  test("returns true for valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  test("returns true for email with subdomain", () => {
    expect(isValidEmail("user@mail.example.co.id")).toBe(true);
  });

  test("returns false for email without @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  test("returns false for email without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("returns false for null", () => {
    expect(isValidEmail(null)).toBe(false);
  });

  test("returns false for non-string", () => {
    expect(isValidEmail(123)).toBe(false);
  });
});
