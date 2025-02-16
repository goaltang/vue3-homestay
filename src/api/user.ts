import axios from "axios";
import type { UserInfo } from "@/types/user";

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export interface UserQueryParams {
  page: number;
  size: number;
  username?: string;
  email?: string;
  role?: string;
}

export const userApi = {
  // 获取用户列表
  getUsers(params: UserQueryParams) {
    return api.get<{
      content: UserInfo[];
      totalElements: number;
    }>("/users", { params });
  },

  // 更新用户角色
  updateUserRole(userId: string, role: string) {
    return api.patch(`/users/${userId}/role`, { role });
  },

  // 删除用户
  deleteUser(userId: string) {
    return api.delete(`/users/${userId}`);
  },
};
