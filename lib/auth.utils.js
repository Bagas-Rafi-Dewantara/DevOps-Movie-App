/**
 * Transform a full name into a lowercase username with no spaces.
 * e.g. "John Doe" -> "johndoe"
 */
function generateUsername(name) {
  if (!name || typeof name !== "string") return "";
  return name.split(" ").join("").toLocaleLowerCase();
}

/**
 * Enrich a NextAuth session object with username and uid from token.
 */
function buildSession(session, token) {
  if (!session || !session.user) return session;
  const enriched = { ...session, user: { ...session.user } };
  enriched.user.username = generateUsername(session.user.name);
  enriched.user.uid = token?.sub ?? null;
  return enriched;
}

/**
 * Return true when a valid session with user data exists.
 */
function isAuthenticated(session) {
  return !!(session && session.user && session.user.email);
}

/**
 * Extract the uid from a NextAuth token.
 */
function extractUid(token) {
  return token?.sub ?? null;
}

/**
 * Validate that a session user object has the required fields.
 */
function validateSessionUser(user) {
  if (!user) return { valid: false, reason: "No user in session" };
  if (!user.name) return { valid: false, reason: "Missing name" };
  if (!user.email) return { valid: false, reason: "Missing email" };
  return { valid: true, reason: null };
}

module.exports = {
  generateUsername,
  buildSession,
  isAuthenticated,
  extractUid,
  validateSessionUser,
};
