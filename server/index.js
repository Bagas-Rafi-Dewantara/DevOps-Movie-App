import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";

import { findMovies } from "./controllers/findMovie.js";
import { findPerson } from "./controllers/findPerson.js";
import { getMovie } from "./controllers/getMovie.js";
import { getPerson } from "./controllers/getPerson.js";
import { getReviews } from "./controllers/getReviews.js";
import { getUserData } from "./controllers/getUserData.js";
import { saveMovies } from "./controllers/saveMovie.js";
import { SavePerson } from "./controllers/savePerson.js";
import { saveReview } from "./controllers/saveReview.js";
import { suggestionUser } from "./controllers/suggestionUser.js";
import { getUser } from "./controllers/user.js";
import { getPlaylists } from "./controllers/getPlaylists.js";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
} from "./controllers/managePlaylist.js";

dotenv.config({ path: "../.env.local" });
const app = express();
const port = process.env.PORT || 3001;

const pusher = new Pusher({
  appId: "1563131",
  key: "9a52b8f05435b6e35101",
  secret: "f7f36d4243b06c8eadb1",
  cluster: "ap2",
  useTLS: true,
});

// middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Izinkan semua origin (untuk development)
    credentials: true,
  })
);

// Db config
const connection_Url = process.env.MONGODB_URL;

mongoose.connect(connection_Url).catch((err) => console.log(err));

mongoose.connection.once("open", () => {
  console.log("Db CONNECTED");

  const changeStream = mongoose.connection.collection("movie-data").watch();
  changeStream.on("change", (change) => {
    pusher.trigger("movie-data", "new-movieData", {
      change: change,
    });
  });

  const changePerson = mongoose.connection.collection("person-data").watch();
  changePerson.on("change", (change) => {
    pusher.trigger("person-data", "new-personData", {
      change: change,
    });
  });

  const changeReview = mongoose.connection.collection("review-data").watch();
  changeReview.on("change", (change) => {
    pusher.trigger("review-data", "new-reviewData", {
      change: change,
    });
  });
});

// HEALTH CHECK
app.get("/", (req, res) => res.status(200).send("Movie App Build"));

// USER ROUTES - support GET dan POST
app.route("/user").get(getUser).post(getUser);

app.get("/user/:id", getUserData);

// MOVIE ROUTES
app.get("/movie/:id", getMovie);
app.route("/save/movie").get(saveMovies).post(saveMovies);
app.route("/find/movie").get(findMovies).post(findMovies);

// PERSON ROUTES
app.get("/person/:id", getPerson);
app.route("/save/person").get(SavePerson).post(SavePerson);
app.route("/find/person").get(findPerson).post(findPerson);

// OTHER ROUTES
app.get("/suggestion/:id", suggestionUser);
app.get("/reviews/:movieId", getReviews);
app.route("/save/review").get(saveReview).post(saveReview);

// PLAYLIST ROUTES
app.get("/playlists/user/:userId", getPlaylists);
app.post("/playlist", createPlaylist);
app.put("/playlist/:id", updatePlaylist);
app.delete("/playlist/:id", deletePlaylist);
app.post("/playlist/:id/movie", addMovieToPlaylist);
app.delete("/playlist/:id/movie/:movieId", removeMovieFromPlaylist);

app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));
