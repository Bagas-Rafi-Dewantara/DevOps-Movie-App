const getUserFromSession = (session) => {
  if (!session || !session.user) return null;
  return {
    uid: session.user.uid,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
};

const isAuthenticated = (session) =>
  !!(session && session.user && session.user.uid);

const requireAuth = (session) => {
  if (!isAuthenticated(session)) {
    return { allowed: false, status: 401, message: "Unauthorized" };
  }
  return { allowed: true };
};

module.exports = { getUserFromSession, isAuthenticated, requireAuth };
