"use client";

import { useTheme } from "@/context/ThemeContext";
import { baseURL } from "@/utils/baseUrl";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { MdFilterList, MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import CircularRate from "./CircularRate";

export interface SearchData {
  adult: boolean;
  title: string;
  backdrop_path: string;
  media_type?: string;
  release_date?: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  video: boolean;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  also_known_as: any[];
  biography: string;
  birthday: string;
  deathday: string | undefined;
  gender: number;
  homepage: any | undefined;
  imdb_id: string;
  known_for_department: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 37, name: "Western" },
];

const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 53, name: "Thriller" },
  { id: 37, name: "Western" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i);

type Props = {};

function SearchComponent({}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [option, setOption] = useState("movie");
  const [searchTerms, setSearchTerms] = useState("");
  const [userSearchData, setUserSearchData] = useState<SearchData[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const genres = option === "tv" ? TV_GENRES : MOVIE_GENRES;

  const fetchSearchData = async () => {
    try {
      let url = "";

      if (option === "person") {
        if (!searchTerms.trim()) {
          setUserSearchData([]);
          return;
        }
        url = `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&query=${encodeURIComponent(searchTerms)}&page=1&include_adult=false`;
      } else if (searchTerms.trim()) {
        // Text search: use /search endpoint
        url = `https://api.themoviedb.org/3/search/${option}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&query=${encodeURIComponent(searchTerms)}&page=1&include_adult=false`;
      } else {
        // Browse mode: use /discover with filters
        const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
        const yearParam = selectedYear
          ? option === "movie"
            ? `&primary_release_year=${selectedYear}`
            : `&first_air_date_year=${selectedYear}`
          : "";
        url = `https://api.themoviedb.org/3/discover/${option}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&sort_by=${sortBy}${genreParam}${yearParam}&include_adult=false&page=1`;
      }

      const data = await fetch(url).then((res) => res.json());
      setUserSearchData(data.results || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const navigatePage = (navigateId: number) => {
    if (!navigateId) return;

    if (session) {
      if (option === "movie") {
        router.push(`/details/movie${navigateId}`);
      } else if (option === "tv") {
        router.push(`/details/${navigateId}`);
      } else if (option === "person") {
        router.push(`/cast/${navigateId}`);
      }
    } else {
      toast.error(
        option === "person"
          ? "You Need to Sign In to Look Up More Information About This Person"
          : "You Need to Sign In to Look Up More Information About This Movie",
      );
    }
  };

  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setSortBy("popularity.desc");
  };

  const hasActiveFilters =
    selectedGenre || selectedYear || sortBy !== "popularity.desc";

  useEffect(() => {
    fetchSearchData();
  }, [option, searchTerms, selectedGenre, selectedYear, sortBy]);

  // Reset filters when switching to person
  useEffect(() => {
    if (option === "person") {
      clearFilters();
    }
  }, [option]);

  // Theme-aware classes
  const cardBg =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const inputBg =
    theme === "dark"
      ? "bg-gray-800 border-gray-600 text-white"
      : "bg-white border-gray-200 text-gray-900";
  const selectBg =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const labelText = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div className="px-4 sm:px-8 lg:px-16 xl:px-20 mx-auto">
      {/* Header */}
      <div className="hero-headline flex flex-col items-center justify-center pt-24 text-center">
        <h1
          className={`font-bold text-3xl ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}
        >
          Search & Discover
        </h1>
        <p
          className={`font-base text-base mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          {searchTerms
            ? `Showing results for "${searchTerms}"`
            : hasActiveFilters
              ? "Browsing with filters"
              : "Search by title or browse with filters"}
        </p>
      </div>

      {/* Search bar */}
      <div className="pt-6">
        <div
          className={`rounded-lg flex items-center w-full p-3 shadow-sm border ${inputBg}`}
        >
          <button className="outline-none focus:outline-none flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <input
            type="search"
            placeholder={`Search ${option === "person" ? "people" : option === "tv" ? "TV shows" : "movies"}...`}
            className={`w-full pl-3 text-sm outline-none focus:outline-none bg-transparent ${
              theme === "dark"
                ? "text-white placeholder-gray-500"
                : "text-gray-900 placeholder-gray-400"
            }`}
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />

          {/* Media type selector */}
          <select
            className={`text-sm outline-none focus:outline-none ml-2 pr-2 border-l pl-2 ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-200"
            }`}
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Shows</option>
            <option value="person">Person</option>
          </select>

          {/* Filter toggle button (hidden for person) */}
          {option !== "person" && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-2 p-1.5 rounded-md flex items-center gap-1 text-sm transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-red-600 text-white"
                  : theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <MdFilterList className="text-base" />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="bg-white text-red-600 rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && option !== "person" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`mt-3 rounded-lg p-4 border ${cardBg}`}>
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-semibold ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                >
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400"
                  >
                    <MdClose /> Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Genre */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${labelText}`}
                  >
                    Genre
                  </label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className={`w-full text-sm p-2 rounded-md border outline-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-300"
                    }`}
                  >
                    <option value="">All Genres</option>
                    {genres.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${labelText}`}
                  >
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className={`w-full text-sm p-2 rounded-md border outline-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-300"
                    }`}
                  >
                    <option value="">All Years</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${labelText}`}
                  >
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full text-sm p-2 rounded-md border outline-none ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-900 border-gray-300"
                    }`}
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedGenre && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              {genres.find((g) => String(g.id) === selectedGenre)?.name}
              <button onClick={() => setSelectedGenre("")}>
                <MdClose />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              {selectedYear}
              <button onClick={() => setSelectedYear("")}>
                <MdClose />
              </button>
            </span>
          )}
          {sortBy !== "popularity.desc" && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
              <button onClick={() => setSortBy("popularity.desc")}>
                <MdClose />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {userSearchData.length < 1 ? (
        <div className="h-[300px] flex flex-col justify-center items-center gap-4">
          <FcSearch className="text-9xl animate-bounce" />
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
          >
            {option === "person"
              ? "Type a name to search people"
              : "Search or use filters to discover content"}
          </p>
        </div>
      ) : (
        <section className="my-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {userSearchData.map((data) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative cursor-pointer group"
              key={data.id}
              onClick={() => navigatePage(data.id)}
            >
              <div className="relative overflow-hidden rounded-md">
                <img
                  className="w-full md:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  src={`${baseURL}${data.poster_path || data.profile_path}`}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/200x300?text=No+Image";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-black to-transparent z-10" />
                <div className="absolute bottom-2 left-2 z-20">
                  <CircularRate
                    value={data.vote_average || data.popularity / 10}
                    isPoster={true}
                  />
                  <p className="text-white text-xs font-medium truncate w-[140px] mt-1">
                    {data?.title || data?.name || data?.original_name}
                  </p>
                  {(data.release_date || data.first_air_date) && (
                    <p className="text-gray-400 text-xs">
                      {(data.release_date || data.first_air_date)?.substring(
                        0,
                        4,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      )}
    </div>
  );
}

export default SearchComponent;
