import request from "./request";
import type { LoginForm, RegisterForm, UserInfo } from "@/types/user";

export const authApi = {
  login(data: LoginForm) {
    return request.post<{ token: string }>("/auth/login", data, {
      headers: {
        Authorization: undefined,
      },
    });
  },

  register(data: RegisterForm) {
    return request.post<{ token: string }>("/auth/register", data, {
      headers: {
        Authorization: undefined,
      },
    });
  },

  getCurrentUser() {
    return request.get<UserInfo>("/auth/me");
  },

  logout() {
    return request.post("/auth/logout");
  },
};
