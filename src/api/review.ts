import axios from "axios";
import type { Review, CreateReviewForm } from "@/types/review";

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export const reviewApi = {
  getHouseReviews(houseId: string) {
    return api.get<{ list: Review[] }>(`/houses/${houseId}/reviews`);
  },

  createReview(houseId: string, data: CreateReviewForm) {
    const formData = new FormData();
    formData.append("rating", data.rating.toString());
    formData.append("content", data.content);
    if (data.images) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }
    return api.post<Review>(`/houses/${houseId}/reviews`, formData);
  },
};
