"use client";

import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose, AiFillStar } from "react-icons/ai";
import {
  BsBookmarkPlus,
  BsCollectionPlay,
  BsPencil,
  BsPlus,
  BsTrash,
} from "react-icons/bs";
import { toast } from "react-toastify";

import Container from "./Container";

interface PlaylistMovie {
  movieId: number;
  mediaType: string;
  title: string;
  poster_path: string;
  vote_average: number;
  addedAt: string;
}

interface Playlist {
  _id: string;
  userId: string;
  name: string;
  movies: PlaylistMovie[];
  createdAt: string;
}

// ── Playlist movie card ──────────────────────────────────────────────────────
function PlaylistMovieCard({
  movie,
  onRemove,
}: {
  movie: PlaylistMovie;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const navigate = () => {
    router.push(
      movie.mediaType === "movie"
        ? `/details/movie${movie.movieId}`
        : `/details/${movie.movieId}`,
    );
  };

  return (
    <div
      className="relative min-w-[120px] w-[120px] h-[180px] md:min-w-[140px] md:w-[140px] md:h-[210px] flex-shrink-0 rounded-md overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={navigate}
    >
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title || "Movie"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 120px, 140px"
        />
      ) : (
        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
          <BsCollectionPlay className="text-gray-500 text-3xl" />
        </div>
      )}

      {hovered && (
        <>
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
            <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
              {movie.title}
            </p>
            {movie.vote_average > 0 && (
              <p className="text-yellow-400 text-xs mt-0.5 flex items-center gap-0.5">
                <AiFillStar className="text-xs" />
                {movie.vote_average.toFixed(1)}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove from playlist"
            className="absolute top-1.5 right-1.5 z-30 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 transition-colors"
          >
            <AiOutlineClose className="text-xs" />
          </button>
        </>
      )}
    </div>
  );
}

// ── Main PlaylistSection ─────────────────────────────────────────────────────
function PlaylistSection() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchPlaylists = async () => {
    if (!session?.user?.uid) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlists/user/${session.user.uid}`,
      );
      const data = await res.json();
      setPlaylists(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name || !session) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.uid, name }),
        },
      );
      const data = await res.json();
      if (data.status === "created") {
        toast.success(`Playlist "${name}" created!`);
        setNewPlaylistName("");
        setShowCreateInput(false);
        setPlaylists((prev) => [data.playlist, ...prev]);
      }
    } catch {
      toast.error("Failed to create playlist");
    }
  };

  const deletePlaylist = async (id: string, name: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${id}`, {
        method: "DELETE",
      });
      toast.success(`"${name}" deleted`);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete playlist");
    }
  };

  const renamePlaylist = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );
      const data = await res.json();
      if (data.status === "updated") {
        setPlaylists((prev) =>
          prev.map((p) => (p._id === id ? { ...p, name } : p)),
        );
        setEditingId(null);
      }
    } catch {
      toast.error("Failed to rename playlist");
    }
  };

  const removeMovieFromPlaylist = async (
    playlistId: string,
    movieId: number,
  ) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${playlistId}/movie/${movieId}`,
        { method: "DELETE" },
      );
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === playlistId
            ? { ...p, movies: p.movies.filter((m) => m.movieId !== movieId) }
            : p,
        ),
      );
      toast.success("Removed from playlist");
    } catch {
      toast.error("Failed to remove movie");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [session]);

  if (!session) return null;

  // Theme classes
  const cardBg =
    theme === "dark"
      ? "bg-gray-900"
      : "bg-white border border-gray-200 shadow-sm";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputBg =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400";
  const dividerColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className="px-4 pb-12">
      <Container header="My Playlists">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <p className={`text-sm ${textSecondary}`}>
            {isLoading
              ? "Loading..."
              : `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`}
          </p>
          <button
            onClick={() => setShowCreateInput(!showCreateInput)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <BsPlus className="text-lg" />
            New Playlist
          </button>
        </div>

        {/* Create input */}
        {showCreateInput && (
          <div
            className={`flex items-center gap-2 mb-5 p-3 rounded-lg ${cardBg}`}
          >
            <BsBookmarkPlus className="text-red-500 text-lg shrink-0" />
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createPlaylist();
                if (e.key === "Escape") {
                  setShowCreateInput(false);
                  setNewPlaylistName("");
                }
              }}
              placeholder="Enter playlist name..."
              autoFocus
              className={`flex-1 bg-transparent border-b outline-none text-sm py-1 ${inputBg}`}
            />
            <button
              onClick={createPlaylist}
              className="text-green-500 hover:text-green-400 p-1 transition-colors"
            >
              <AiOutlineCheck className="text-base" />
            </button>
            <button
              onClick={() => {
                setShowCreateInput(false);
                setNewPlaylistName("");
              }}
              className="text-gray-400 hover:text-gray-300 p-1 transition-colors"
            >
              <AiOutlineClose className="text-base" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && playlists.length === 0 && (
          <div className={`text-center py-14 rounded-xl ${cardBg}`}>
            <BsCollectionPlay className="text-5xl text-gray-500 mx-auto mb-3" />
            <p className={`${textSecondary} text-sm`}>
              No playlists yet. Create one to start saving movies!
            </p>
          </div>
        )}

        {/* Playlist rows */}
        <div className="space-y-10">
          {playlists.map((playlist, index) => (
            <div key={playlist._id}>
              {index > 0 && (
                <div className={`border-t ${dividerColor} mb-8 -mt-2`} />
              )}

              {/* Playlist header */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {editingId === playlist._id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renamePlaylist(playlist._id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className={`text-base font-semibold border-b outline-none py-0.5 bg-transparent flex-1 min-w-0 ${inputBg}`}
                    />
                    <button
                      onClick={() => renamePlaylist(playlist._id)}
                      className="text-green-500 hover:text-green-400 transition-colors"
                    >
                      <AiOutlineCheck />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <AiOutlineClose />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold uppercase tracking-wide">
                      {playlist.name}
                    </h3>
                    <span className={`text-xs ${textSecondary}`}>
                      ({playlist.movies.length}{" "}
                      {playlist.movies.length === 1 ? "movie" : "movies"})
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(playlist._id);
                        setEditingName(playlist.name);
                      }}
                      className={`${textSecondary} hover:text-white p-1 transition-colors`}
                      title="Rename playlist"
                    >
                      <BsPencil className="text-xs" />
                    </button>
                    <button
                      onClick={() =>
                        deletePlaylist(playlist._id, playlist.name)
                      }
                      className="text-gray-500 hover:text-red-500 p-1 transition-colors"
                      title="Delete playlist"
                    >
                      <BsTrash className="text-xs" />
                    </button>
                  </>
                )}
              </div>

              {/* Movie cards */}
              {playlist.movies.length === 0 ? (
                <p className={`text-sm ${textSecondary} pl-1 py-2`}>
                  No movies yet. Go to any movie page and click{" "}
                  <span className="font-medium text-white">
                    Add to Playlist
                  </span>
                  .
                </p>
              ) : (
                <div className="flex items-start gap-3 overflow-x-scroll scrollbar-hide pb-2">
                  {playlist.movies.map((movie) => (
                    <PlaylistMovieCard
                      key={movie.movieId}
                      movie={movie}
                      onRemove={() =>
                        removeMovieFromPlaylist(playlist._id, movie.movieId)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default PlaylistSection;
