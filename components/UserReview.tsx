"use client";

import { useTheme } from "@/context/ThemeContext";
import Avatar from "@mui/material/Avatar";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toast } from "react-toastify";

import Container from "./Container";

interface UserReviewData {
  _id: string;
  userId: string;
  movieId: number;
  mediaType: string;
  rating: number;
  content: string;
  userName: string;
  userPhoto: string;
  time: string;
}

type Props = {
  movieId: number;
  mediaType?: string;
  movieTitle?: string;
  poster_path?: string;
};

function UserReview({ movieId, mediaType = "movie", movieTitle = "", poster_path = "" }: Props) {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [reviews, setReviews] = useState<UserReviewData[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userExistingReview, setUserExistingReview] = useState<UserReviewData | null>(null);

  const fetchReviews = async () => {
    if (!movieId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/${movieId}`);
      const data: UserReviewData[] = await res.json();
      setReviews(data);

      if (session?.user?.uid) {
        const existing = data.find((r) => r.userId === session.user.uid);
        if (existing) {
          setUserExistingReview(existing);
          setRating(existing.rating);
          setContent(existing.content);
        } else {
          setUserExistingReview(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session) {
      toast.error("Please sign in to submit a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating (1–10)");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write your review");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/save/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.uid,
          movieId,
          mediaType,
          rating,
          content: content.trim(),
          userName: session.user.name,
          userPhoto: session.user.image,
          movieTitle,
          poster_path,
        }),
      });

      const data = await res.json();

      if (data.status === "created" || data.status === "updated") {
        toast.success(data.status === "created" ? "Review submitted!" : "Review updated!");
        setShowForm(false);
        await fetchReviews();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId, session]);

  // Theme helpers
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white border border-gray-200 shadow-sm";
  const inputBg =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const cancelBtn =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const avgBg = theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200";

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="px-4 pb-12">
      <Container header="User Reviews">
        {/* Summary bar */}
        {reviews.length > 0 && (
          <div className={`flex items-center gap-4 p-4 rounded-lg border ${avgBg} mb-4`}>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{avgRating}</p>
              <p className={`text-xs ${textSecondary}`}>Average</p>
            </div>
            <div className="h-10 w-px bg-gray-600" />
            <div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <span key={s}>
                    {s <= Math.round(Number(avgRating)) ? (
                      <AiFillStar className="text-yellow-400 text-sm" />
                    ) : (
                      <AiOutlineStar className="text-gray-500 text-sm" />
                    )}
                  </span>
                ))}
              </div>
              <p className={`text-xs mt-0.5 ${textSecondary}`}>
                Based on {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Write review button */}
        {session && (
          <div className="mb-5">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {showForm ? "Cancel" : userExistingReview ? "Edit Your Review" : "Write a Review"}
            </button>
          </div>
        )}

        {/* Review form */}
        {showForm && session && (
          <div className={`${cardBg} rounded-lg p-6 mb-6`}>
            <h3 className="font-semibold text-base mb-4">
              {userExistingReview ? "Edit your review" : "Your review"}
            </h3>

            {/* Star rating */}
            <div className="mb-5">
              <p className={`text-xs font-medium mb-2 ${textSecondary}`}>Rating (tap a star)</p>
              <div className="flex items-center gap-1 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <AiFillStar className="text-yellow-400" />
                    ) : (
                      <AiOutlineStar className="text-gray-400" />
                    )}
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className={`ml-2 text-sm font-semibold ${textSecondary}`}>
                    {hoverRating || rating}/10
                  </span>
                )}
              </div>
            </div>

            {/* Text area */}
            <div className="mb-5">
              <p className={`text-xs font-medium mb-2 ${textSecondary}`}>Your thoughts</p>
              <textarea
                className={`w-full rounded-md p-3 text-sm border focus:outline-none focus:ring-2 focus:ring-red-500 resize-none transition-colors ${inputBg}`}
                rows={4}
                placeholder="Share your thoughts about this movie or show…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isSubmitting
                  ? "Submitting…"
                  : userExistingReview
                    ? "Update Review"
                    : "Submit Review"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${cancelBtn}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {isLoading ? (
          <div className={`text-center py-8 text-sm ${textSecondary}`}>Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className={`text-center py-10 ${textSecondary}`}>
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-medium">No user reviews yet.</p>
            {session && <p className="text-xs mt-1">Be the first to leave a review!</p>}
          </div>
        ) : (
          <div className="space-y-4 max-h-[480px] overflow-y-auto scrollbar-hide pr-1">
            {reviews.map((review) => (
              <div key={review._id} className={`${cardBg} rounded-lg p-5`}>
                <div className="flex gap-4">
                  <Avatar
                    alt={review.userName}
                    src={review.userPhoto}
                    sx={{ width: 44, height: 44, flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{review.userName}</p>
                      {review.userId === session?.user?.uid && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                      <span className={`text-xs ${textSecondary} ml-auto`}>
                        {moment(review.time).format("MMM D, YYYY")}
                      </span>
                    </div>

                    {/* Star display */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                        <span key={s}>
                          {s <= review.rating ? (
                            <AiFillStar className="text-yellow-400 text-xs" />
                          ) : (
                            <AiOutlineStar className="text-gray-500 text-xs" />
                          )}
                        </span>
                      ))}
                      <span className={`text-xs ml-1 font-medium ${textSecondary}`}>
                        {review.rating}/10
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${textSecondary}`}>{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default UserReview;
