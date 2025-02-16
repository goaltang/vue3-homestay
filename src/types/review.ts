export interface Review {
  id: string;
  userId: string;
  houseId: string;
  rating: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatar: string;
  };
  images?: string[];
}

export interface CreateReviewForm {
  rating: number;
  content: string;
  images?: File[];
}
