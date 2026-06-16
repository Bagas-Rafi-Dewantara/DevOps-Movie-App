"use client";

import { useTheme } from "@/context/ThemeContext";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { BsBookmarkPlus, BsCollectionPlay } from "react-icons/bs";
import { toast } from "react-toastify";

interface PlaylistMovie {
  movieId: number;
  mediaType: string;
}

interface Playlist {
  _id: string;
  name: string;
  movies: PlaylistMovie[];
}

type Props = {
  movieId: number;
  mediaType?: string;
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
};

function AddToPlaylistButton({
  movieId,
  mediaType = "movie",
  title = "",
  poster_path = "",
  backdrop_path = "",
  vote_average = 0,
}: Props) {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [showNewInput, setShowNewInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const fetchPlaylists = async () => {
    if (!session?.user?.uid) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlists/user/${session.user.uid}`
      );
      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (open) fetchPlaylists();
  }, [open, session]);

  if (!session || !movieId) return null;

  const isInPlaylist = (p: Playlist) => p.movies.some((m) => m.movieId === movieId);

  const toggleMovie = async (playlist: Playlist) => {
    const inList = isInPlaylist(playlist);
    setLoadingIds((prev) => new Set(prev).add(playlist._id));

    try {
      if (inList) {
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${playlist._id}/movie/${movieId}`,
          { method: "DELETE" }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p._id === playlist._id
              ? { ...p, movies: p.movies.filter((m) => m.movieId !== movieId) }
              : p
          )
        );
        toast.success(`Removed from "${playlist.name}"`);
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${playlist._id}/movie`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              movieId,
              mediaType,
              title,
              poster_path,
              backdrop_path,
              vote_average,
            }),
          }
        );
        const data = await res.json();
        if (data.playlist) {
          setPlaylists((prev) => prev.map((p) => (p._id === playlist._id ? data.playlist : p)));
        }
        toast.success(`Added to "${playlist.name}"`);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingIds((prev) => {
        const s = new Set(prev);
        s.delete(playlist._id);
        return s;
      });
    }
  };

  const createAndAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      // 1. Create playlist
      const createRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.uid, name }),
      });
      const createData = await createRes.json();
      if (createData.status !== "created") throw new Error("Create failed");

      const newPlaylist = createData.playlist;

      // 2. Add movie to the new playlist
      const addRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${newPlaylist._id}/movie`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId,
            mediaType,
            title,
            poster_path,
            backdrop_path,
            vote_average,
          }),
        }
      );
      const addData = await addRes.json();

      setPlaylists((prev) => [addData.playlist || newPlaylist, ...prev]);
      setNewName("");
      setShowNewInput(false);
      toast.success(`Created "${name}" and added movie!`);
    } catch {
      toast.error("Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  };

  // How many playlists contain this movie
  const addedCount = playlists.filter(isInPlaylist).length;

  // Theme classes
  const dropBg =
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-900 shadow-xl";
  const itemHover = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50";
  const divider = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBg =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400";

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
          addedCount > 0
            ? "bg-red-600 hover:bg-red-700 border-red-500 text-white"
            : "bg-gray-800 hover:bg-gray-700 border-gray-600 text-white"
        }`}
      >
        <BsBookmarkPlus className="text-base" />
        {addedCount > 0
          ? `In ${addedCount} Playlist${addedCount > 1 ? "s" : ""}`
          : "Add to Playlist"}
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full mt-2 w-72 rounded-xl border z-50 overflow-hidden ${dropBg}`}
        >
          {/* Dropdown header */}
          <div className={`px-4 py-3 border-b ${divider} flex items-center gap-2`}>
            <BsCollectionPlay className="text-red-500 text-base shrink-0" />
            <p className="text-sm font-semibold">Add to Playlist</p>
          </div>

          {/* Playlist list */}
          <div className="max-h-52 overflow-y-auto">
            {playlists.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <BsCollectionPlay className="text-3xl text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No playlists yet. Create one below!</p>
              </div>
            ) : (
              playlists.map((playlist) => {
                const inList = isInPlaylist(playlist);
                const loading = loadingIds.has(playlist._id);
                return (
                  <button
                    key={playlist._id}
                    onClick={() => toggleMovie(playlist)}
                    disabled={loading}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${itemHover} disabled:opacity-50`}
                  >
                    <span className="truncate text-left">{playlist.name}</span>
                    <span className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-gray-500">{playlist.movies.length}</span>
                      {loading ? (
                        <AiOutlineLoading3Quarters className="text-gray-400 text-sm animate-spin" />
                      ) : inList ? (
                        <AiOutlineCheck className="text-green-500 text-base" />
                      ) : (
                        <AiOutlinePlus className="text-gray-400 text-base" />
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Create new playlist */}
          <div className={`border-t ${divider} p-3`}>
            {showNewInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createAndAdd();
                    if (e.key === "Escape") {
                      setShowNewInput(false);
                      setNewName("");
                    }
                  }}
                  placeholder="Playlist name..."
                  autoFocus
                  className={`flex-1 text-xs px-2.5 py-1.5 rounded-md border outline-none ${inputBg}`}
                />
                <button
                  onClick={createAndAdd}
                  disabled={isCreating}
                  className="text-green-500 hover:text-green-400 p-1 transition-colors disabled:opacity-50"
                >
                  {isCreating ? (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  ) : (
                    <AiOutlineCheck />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowNewInput(false);
                    setNewName("");
                  }}
                  className="text-gray-400 hover:text-gray-300 p-1 transition-colors"
                >
                  <AiOutlineClose />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewInput(true)}
                className="w-full text-left text-xs text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors py-0.5"
              >
                <AiOutlinePlus className="text-sm" />
                Create new playlist
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddToPlaylistButton;
