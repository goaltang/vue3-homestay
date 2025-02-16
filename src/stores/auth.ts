import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/api/auth";
import type { LoginForm, RegisterForm, UserInfo } from "@/types/user";
import { ElMessage } from "element-plus";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserInfo | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const login = async (loginForm: LoginForm) => {
    loading.value = true;
    try {
      const { data } = await authApi.login(loginForm);
      console.log("Login response:", data); // 调试日志

      // 确保 token 存在
      if (!data.token) {
        throw new Error("登录响应中没有 token");
      }

      // 保存 token
      token.value = data.token;
      localStorage.setItem("token", data.token);
      console.log("Token saved:", data.token); // 调试日志

      // 获取用户信息
      const userResponse = await authApi.getCurrentUser();
      user.value = userResponse.data;
      return true;
    } catch (error: any) {
      console.error("Login error:", error); // 调试日志
      ElMessage.error(error.response?.data?.message || "登录失败");
      // 登录失败时清除 token
      token.value = null;
      localStorage.removeItem("token");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const checkAuth = async () => {
    const savedToken = localStorage.getItem("token");
    console.log("Checking saved token:", savedToken); // 调试日志

    if (savedToken && !user.value) {
      token.value = savedToken;
      try {
        const { data } = await authApi.getCurrentUser();
        user.value = data;
        return true;
      } catch (error) {
        console.error("Check auth error:", error); // 调试日志
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
        return false;
      }
    }
    return !!user.value;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  const register = async (registerForm: RegisterForm) => {
    loading.value = true;
    try {
      await authApi.register(registerForm);
      ElMessage.success("注册成功，请登录");
      return true;
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || "注册失败");
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    register,
  };
});
