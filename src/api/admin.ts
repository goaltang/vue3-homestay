import request from "./request";
import type { UserInfo } from "@/types/user";
import type { HouseInfo } from "@/types/house";
import type { OrderInfo } from "@/types/order";

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface QueryParams {
  page?: number;
  size?: number;
  [key: string]: any;
}

export const adminApi = {
  // 仪表盘统计
  getDashboardStats() {
    return request.get<{
      totalUsers: number;
      totalHouses: number;
      totalOrders: number;
      totalRevenue: number;
    }>("/admin/dashboard/stats");
  },

  // 用户管理
  getUsers(params: QueryParams) {
    return request.get<PageResult<UserInfo>>("/admin/users", { params });
  },

  updateUserRole(userId: string, role: string) {
    return request.patch(`/admin/users/${userId}/role`, { role });
  },

  deleteUser(userId: string) {
    return request.delete(`/admin/users/${userId}`);
  },

  // 房源管理
  getHouses(params: QueryParams) {
    return request.get<PageResult<HouseInfo>>("/admin/houses", { params });
  },

  approveHouse(houseId: string) {
    return request.post(`/admin/houses/${houseId}/approve`);
  },

  rejectHouse(houseId: string, reason: string) {
    return request.post(`/admin/houses/${houseId}/reject`, { reason });
  },

  deleteHouse(houseId: string) {
    return request.delete(`/admin/houses/${houseId}`);
  },

  // 订单管理
  getOrders(params: QueryParams) {
    return request.get<PageResult<OrderInfo>>("/admin/orders", { params });
  },

  refundOrder(orderId: string) {
    return request.post(`/admin/orders/${orderId}/refund`);
  },

  // 评论管理
  getReviews(params: QueryParams) {
    return request.get<PageResult<any>>("/reviews", { params });
  },

  deleteReview(reviewId: string) {
    return request.delete(`/reviews/${reviewId}`);
  },
};
