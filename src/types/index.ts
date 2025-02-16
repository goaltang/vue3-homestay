export interface HouseDetail {
  id: number | string;
  title: string;
  address: string;
  price: number;
  imageUrl: string;
  rating: number;
  tags: string[];
  description: string;
  facilities?: string[];
  owner?: {
    name: string;
    phone: string;
    avatar: string;
  };
}

export interface SearchParams {
  keyword?: string;
  minPrice?: string;
  maxPrice?: string;
  city?: string;
  tags?: string[];
  minRating?: number;
  sortBy?: "price" | "rating" | "default";
  sortOrder?: "asc" | "desc";
}

export interface BookingForm {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface Booking {
  id: string;
  houseId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled";
  totalPrice: number;
  createdAt: string;
}
