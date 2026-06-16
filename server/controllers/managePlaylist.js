import Playlist from "../model/playlist.model.js";

export const createPlaylist = async (req, res) => {
  const { userId, name, description } = req.body;
  if (!userId || !name) return res.status(400).json({ error: "userId and name are required" });

  try {
    const playlist = await Playlist.create({
      userId,
      name,
      description: description || "",
    });
    res.status(201).json({ status: "created", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const playlist = await Playlist.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      { new: true }
    );
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    res.status(200).json({ status: "updated", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ status: "deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMovieToPlaylist = async (req, res) => {
  const { id } = req.params;
  const { movieId, mediaType, title, poster_path, backdrop_path, vote_average } = req.body;

  if (!movieId) return res.status(400).json({ error: "movieId is required" });

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    const alreadyIn = playlist.movies.some((m) => m.movieId === movieId);
    if (alreadyIn) return res.status(200).json({ status: "already_added", playlist });

    playlist.movies.push({
      movieId,
      mediaType: mediaType || "movie",
      title,
      poster_path,
      backdrop_path,
      vote_average,
    });
    await playlist.save();
    res.status(200).json({ status: "added", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromPlaylist = async (req, res) => {
  const { id, movieId } = req.params;
  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    playlist.movies = playlist.movies.filter((m) => m.movieId !== parseInt(movieId));
    await playlist.save();
    res.status(200).json({ status: "removed", playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
