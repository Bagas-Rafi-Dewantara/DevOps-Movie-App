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
  BsMusicNoteBeamed,
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

// ── Cover image: 1 poster or 2×2 collage ────────────────────────────────────
function PlaylistCover({ movies }: { movies: PlaylistMovie[] }) {
  const posters = movies
    .filter((m) => m.poster_path)
    .slice(0, 4)
    .map((m) => `https://image.tmdb.org/t/p/w185${m.poster_path}`);

  if (posters.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <BsMusicNoteBeamed className="text-gray-500 text-4xl" />
      </div>
    );
  }

  if (posters.length < 4) {
    return <Image src={posters[0]} alt="cover" fill className="object-cover" sizes="160px" />;
  }

  // 2×2 collage
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2">
      {posters.map((src, i) => (
        <div key={i} className="relative overflow-hidden">
          <Image src={src} alt={`cover-${i}`} fill className="object-cover" sizes="80px" />
        </div>
      ))}
    </div>
  );
}

// ── Movie row item inside expanded playlist ──────────────────────────────────
function MovieRowItem({
  movie,
  index,
  onRemove,
}: {
  movie: PlaylistMovie;
  index: number;
  onRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const navigate = () => {
    router.push(
      movie.mediaType === "movie" ? `/details/movie${movie.movieId}` : `/details/${movie.movieId}`
    );
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors group ${
        hovered ? "bg-white/10" : "bg-transparent"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={navigate}
    >
      {/* Index or play icon */}
      <span className="w-5 text-center text-sm text-gray-400 shrink-0 group-hover:hidden">
        {index + 1}
      </span>
      <BsCollectionPlay className="w-5 text-white text-sm shrink-0 hidden group-hover:block" />

      {/* Poster thumbnail */}
      <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <BsCollectionPlay className="text-gray-500 text-xs" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{movie.title}</p>
        <p className="text-xs text-gray-400 capitalize">{movie.mediaType}</p>
      </div>

      {/* Rating */}
      {movie.vote_average > 0 && (
        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
          <AiFillStar className="text-yellow-400" />
          {movie.vote_average.toFixed(1)}
        </span>
      )}

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-600 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100 p-1"
        title="Remove from playlist"
      >
        <AiOutlineClose className="text-sm" />
      </button>
    </div>
  );
}

// ── Main PlaylistSection ─────────────────────────────────────────────────────
function PlaylistSection() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const fetchPlaylists = async () => {
    if (!session?.user?.uid) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/playlists/user/${session.user.uid}`
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.uid, name }),
      });
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
      if (selectedId === id) setSelectedId(null);
    } catch {
      toast.error("Failed to delete playlist");
    }
  };

  const renamePlaylist = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.status === "updated") {
        setPlaylists((prev) => prev.map((p) => (p._id === id ? { ...p, name } : p)));
        setEditingId(null);
      }
    } catch {
      toast.error("Failed to rename playlist");
    }
  };

  const removeMovieFromPlaylist = async (playlistId: string, movieId: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/playlist/${playlistId}/movie/${movieId}`, {
        method: "DELETE",
      });
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === playlistId ? { ...p, movies: p.movies.filter((m) => m.movieId !== movieId) } : p
        )
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

  const isDark = theme === "dark";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const cardBg = isDark ? "bg-gray-900" : "bg-white border border-gray-200 shadow-sm";
  const inputBg = isDark
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400";
  const panelBg = isDark ? "bg-[#121212]" : "bg-gray-50 border border-gray-200";
  const hoverCard = isDark ? "hover:bg-white/5" : "hover:bg-gray-100";

  const selectedPlaylist = playlists.find((p) => p._id === selectedId) ?? null;

  return (
    <div className="px-4 pb-12">
      <Container header="My Playlists">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className={`text-sm ${textSecondary}`}>
            {isLoading
              ? "Loading..."
              : `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`}
          </p>
          <button
            onClick={() => setShowCreateInput(!showCreateInput)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <BsPlus className="text-lg" />
            New Playlist
          </button>
        </div>

        {/* Create input */}
        {showCreateInput && (
          <div className={`flex items-center gap-2 mb-5 p-3 rounded-lg ${cardBg}`}>
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
              placeholder="Nama playlist..."
              autoFocus
              className={`flex-1 bg-transparent border-b outline-none text-sm py-1 ${inputBg}`}
            />
            <button onClick={createPlaylist} className="text-green-500 hover:text-green-400 p-1">
              <AiOutlineCheck className="text-base" />
            </button>
            <button
              onClick={() => {
                setShowCreateInput(false);
                setNewPlaylistName("");
              }}
              className="text-gray-400 hover:text-gray-300 p-1"
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
              Belum ada playlist. Buat satu untuk mulai menyimpan film!
            </p>
          </div>
        )}

        {/* ── Playlist cards (Spotify style) ── */}
        {playlists.length > 0 && (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {playlists.map((playlist) => {
              const isSelected = selectedId === playlist._id;
              return (
                <div
                  key={playlist._id}
                  onClick={() => setSelectedId(isSelected ? null : playlist._id)}
                  className={`flex-shrink-0 w-40 rounded-lg p-3 cursor-pointer transition-all group ${hoverCard} ${
                    isSelected
                      ? isDark
                        ? "bg-white/10 ring-2 ring-red-500"
                        : "bg-gray-200 ring-2 ring-red-500"
                      : isDark
                        ? "bg-white/5"
                        : "bg-gray-100"
                  }`}
                >
                  {/* Cover */}
                  <div className="relative w-full aspect-square rounded-md overflow-hidden mb-3 shadow-lg">
                    <PlaylistCover movies={playlist.movies} />
                  </div>

                  {/* Name */}
                  {editingId === playlist._id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renamePlaylist(playlist._id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className={`w-full bg-transparent border-b outline-none text-sm font-semibold py-0.5 ${inputBg}`}
                    />
                  ) : (
                    <p className="text-sm font-semibold truncate leading-tight">{playlist.name}</p>
                  )}

                  <p className={`text-xs mt-0.5 ${textSecondary}`}>
                    {playlist.movies.length} {playlist.movies.length === 1 ? "film" : "film"}
                  </p>

                  {/* Action icons — show on hover */}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(playlist._id);
                        setEditingName(playlist.name);
                      }}
                      className={`${textSecondary} hover:text-white p-1 transition-colors`}
                      title="Rename"
                    >
                      <BsPencil className="text-xs" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlaylist(playlist._id, playlist.name);
                      }}
                      className="text-gray-500 hover:text-red-500 p-1 transition-colors"
                      title="Delete"
                    >
                      <BsTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Expanded playlist panel ── */}
        {selectedPlaylist && (
          <div className={`mt-5 rounded-xl p-5 ${panelBg}`}>
            {/* Panel header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{selectedPlaylist.name}</h3>
                <p className={`text-xs ${textSecondary}`}>
                  {selectedPlaylist.movies.length}{" "}
                  {selectedPlaylist.movies.length === 1 ? "film" : "film"}
                </p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className={`${textSecondary} hover:text-white p-1.5 rounded-full transition-colors`}
              >
                <AiOutlineClose className="text-base" />
              </button>
            </div>

            {/* Movie list */}
            {selectedPlaylist.movies.length === 0 ? (
              <div className="text-center py-8">
                <BsCollectionPlay className="text-3xl text-gray-600 mx-auto mb-2" />
                <p className={`text-sm ${textSecondary}`}>
                  Belum ada film. Buka halaman film dan klik{" "}
                  <span className={`font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
                    Add to Playlist
                  </span>
                  .
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Column headers */}
                <div
                  className={`flex items-center gap-3 px-4 pb-2 mb-1 border-b text-xs font-medium ${textSecondary} ${isDark ? "border-gray-800" : "border-gray-200"}`}
                >
                  <span className="w-5 text-center">#</span>
                  <span className="w-10 shrink-0" />
                  <span className="flex-1">Judul</span>
                  <span className="w-12 text-right">Rating</span>
                  <span className="w-8" />
                </div>
                {selectedPlaylist.movies.map((movie, i) => (
                  <MovieRowItem
                    key={movie.movieId}
                    movie={movie}
                    index={i}
                    onRemove={() => removeMovieFromPlaylist(selectedPlaylist._id, movie.movieId)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default PlaylistSection;
