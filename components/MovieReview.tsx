import { useTheme } from "@/context/ThemeContext";
import { MovieReviewData } from "@/typings";
import { baseURL } from "@/utils/baseUrl";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
import React from "react";

import Container from "./Container";

type Props = {
  movieReview: MovieReviewData[];
};

function MovieReview({ movieReview }: Props) {
  const { theme } = useTheme();

  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white border border-gray-200 shadow-sm";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const ratingBg =
    theme === "dark" ? "bg-gray-700 text-yellow-400" : "bg-yellow-100 text-yellow-700";

  if (movieReview.length < 1) return null;

  return (
    <div className="px-4 pb-10">
      <Container header="Reviews from TMDB">
        <div className="w-full max-h-[400px] overflow-x-hidden overflow-y-scroll scrollbar-hide space-y-4">
          {movieReview.map((review) => (
            <div key={review.id} className={`w-full px-8 py-6 ${cardBg} rounded-md`}>
              <div className="flex gap-5">
                <Avatar
                  alt={review.author_details.name || review.author}
                  src={`${baseURL}${review.author_details.avatar_path}`}
                  sx={{ width: 48, height: 48, flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <p className="text-base font-semibold">A review by {review.author}</p>
                    {review.author_details.rating && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ratingBg}`}>
                        ★ {review.author_details.rating}/10
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${textSecondary}`}>
                    Written by {review.author} on {moment(review.created_at).format("MMM Do YYYY")}
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${textSecondary}`}>
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default MovieReview;
