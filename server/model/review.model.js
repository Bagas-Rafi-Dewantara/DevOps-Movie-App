import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    movieId: { type: Number, required: true },
    mediaType: { type: String, default: "movie" }, // "movie" or "tv"
    rating: { type: Number, required: true, min: 1, max: 10 },
    content: { type: String, required: true },
    userName: { type: String },
    userPhoto: { type: String },
    movieTitle: { type: String },
    poster_path: { type: String },
    time: { type: Date, default: Date.now },
  },
  { collection: "review-data" },
);

// One review per user per movie
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });
ReviewSchema.index({ movieId: 1, time: -1 });

export default mongoose.model("ReviewData", ReviewSchema);
