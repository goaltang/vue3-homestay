import request from "./request";
import type { OrderInfo, CreateOrderForm } from "@/types/order";

export const orderApi = {
  // 获取用户订单列表
  getOrders() {
    return request.get<OrderInfo[]>("/orders");
  },

  // 创建订单
  createOrder(data: CreateOrderForm) {
    return request.post<OrderInfo>("/orders", data);
  },

  // 取消订单
  cancelOrder(id: string) {
    return request.post(`/orders/${id}/cancel`);
  },

  // 获取订单详情
  getOrderById(id: string) {
    return request.get<OrderInfo>(`/orders/${id}`);
  },
};
