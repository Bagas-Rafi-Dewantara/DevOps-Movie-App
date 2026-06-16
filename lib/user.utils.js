const REQUIRED_USER_FIELDS = ["userId", "name", "email"];

/**
 * Validate the minimum required fields for creating a user.
 */
function validateUserInput(body) {
  if (!body) return { valid: false, reason: "No request body" };

  for (const field of REQUIRED_USER_FIELDS) {
    if (!body[field]) {
      return { valid: false, reason: `Missing required field: ${field}` };
    }
  }

  return { valid: true, reason: null };
}

/**
 * Extract safe user fields from a request body for DB storage.
 */
function buildUserPayload(body) {
  return {
    userId: body.userId,
    name: body.name,
    email: body.email,
    userPhotoUrl: body.userPhotoUrl || null,
    country: body.country || "",
  };
}

/**
 * Decide whether to create or return an existing user.
 */
function determineUserAction(existingUser) {
  return existingUser ? "exists" : "create";
}

/**
 * Format the server response when a user already exists.
 */
function formatExistingUserResponse(user) {
  return {
    status: "exits",
    error: "user Already exits",
    quote: user,
  };
}

/**
 * Format the server response when a user is successfully created.
 */
function formatNewUserResponse() {
  return { status: "ok" };
}

/**
 * Format the server response for getUserData.
 */
function formatGetUserResponse(user) {
  return { status: "ok", quote: user };
}

/**
 * Validate an email address format (basic check).
 */
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
  validateUserInput,
  buildUserPayload,
  determineUserAction,
  formatExistingUserResponse,
  formatNewUserResponse,
  formatGetUserResponse,
  isValidEmail,
};
