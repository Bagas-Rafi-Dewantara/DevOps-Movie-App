import Playlist from "../model/playlist.model.js";

export const getPlaylists = async (req, res) => {
  const { userId } = req.params;
  try {
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
