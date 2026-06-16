const validateReview = ({ userId, movieId, rating, content } = {}) => {
  if (!userId || !movieId || rating === undefined || rating === null || !content) {
    return { valid: false, status: 400, message: "Missing required fields" };
  }
  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    return { valid: false, status: 400, message: "Rating harus antara 1-10" };
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    return { valid: false, status: 400, message: "Content tidak boleh kosong" };
  }
  return { valid: true, status: 201 };
};

const calcAvgRating = (reviews) => {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

const determineReviewAction = (existingReview, newData) => {
  if (existingReview) {
    return {
      action: "update",
      data: { ...existingReview, ...newData, updatedAt: new Date() },
    };
  }
  return { action: "create", data: { ...newData, createdAt: new Date() } };
};

module.exports = { validateReview, calcAvgRating, determineReviewAction };
