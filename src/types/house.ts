export interface HouseInfo {
  id: number;
  title: string;
  description: string;
  address: string;
  price: number;
  imageUrl: string;
  rating?: number;
  tags?: string[];
  ownerId: number;
}

export interface HouseSearchParams {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  size?: number;
}

export interface HouseListResponse {
  content: HouseInfo[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
