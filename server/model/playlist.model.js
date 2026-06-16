import mongoose from "mongoose";

const PlaylistMovieSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    mediaType: { type: String, default: "movie" },
    title: { type: String },
    poster_path: { type: String },
    backdrop_path: { type: String },
    vote_average: { type: Number },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PlaylistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    movies: [PlaylistMovieSchema],
  },
  { collection: "playlist-data", timestamps: true }
);

PlaylistSchema.index({ userId: 1 });

export default mongoose.model("PlaylistData", PlaylistSchema);
