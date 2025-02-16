<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { RegisterForm } from "@/types/user";
import { ElMessage } from "element-plus";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<RegisterForm>({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    ElMessage.error("两次输入的密码不一致");
    return;
  }

  try {
    const success = await authStore.register(form.value);
    if (success) {
      ElMessage.success("注册成功");
      router.push("/login");
    }
  } catch (error) {
    ElMessage.error("注册失败");
  }
};
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="form.username" required placeholder="请输入用户名" autocomplete="username">
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="form.email" required placeholder="请输入邮箱" autocomplete="email">
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="form.password" required placeholder="请输入密码" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input type="password" v-model="form.confirmPassword" required placeholder="请再次输入密码"
            autocomplete="new-password">
        </div>
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <div class="links">
        <router-link to="/login">已有账号？立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}

.register-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

/* 其他样式与 LoginView 相同 */
</style>