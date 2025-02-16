export interface Order {
  id: string;
  houseId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  house: {
    title: string;
    imageUrl: string;
    address: string;
  };
}

export interface CreateOrderForm {
  houseId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface OrderInfo {
  id: string;
  orderNo: string;
  amount: number;
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  house: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    username: string;
  };
}
