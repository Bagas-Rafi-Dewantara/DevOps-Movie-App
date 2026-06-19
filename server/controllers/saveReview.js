import Review from "../model/review.model.js";

export const saveReview = async (req, res) => {
  const {
    userId,
    movieId,
    mediaType,
    rating,
    content,
    userName,
    userPhoto,
    movieTitle,
    poster_path,
  } = req.body;

  if (!userId || !movieId || rating === undefined || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await Review.findOne({ userId, movieId });

    if (existing) {
      existing.rating = rating;
      existing.content = content;
      existing.time = new Date();
      await existing.save();
      return res.status(200).json({ status: "updated", review: existing });
    }

    const review = await Review.create({
      userId,
      movieId,
      mediaType: mediaType || "movie",
      rating,
      content,
      userName,
      userPhoto,
      movieTitle,
      poster_path,
    });

    res.status(201).json({ status: "created", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
