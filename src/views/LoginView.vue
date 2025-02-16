<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { LoginForm } from "@/types/user";

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref<LoginForm>({
    email: "admin@test.com",
    password: "123456",
});

const handleLogin = async () => {
    if (await authStore.login(loginForm.value)) {
        router.push("/");
    } else {
        alert("登录失败，请检查邮箱和密码");
    }
};
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <h2>登录</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>邮箱</label>
                    <input type="email" v-model="loginForm.email" required placeholder="请输入邮箱" autocomplete="username">
                </div>
                <div class="form-group">
                    <label>密码</label>
                    <input type="password" v-model="loginForm.password" required placeholder="请输入密码"
                        autocomplete="current-password">
                </div>
                <button type="submit" :disabled="authStore.loading">
                    {{ authStore.loading ? '登录中...' : '登录' }}
                </button>
            </form>
            <div class="links">
                <router-link to="/register">还没有账号？立即注册</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f5f5f5;
}

.login-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

input:focus {
    outline: none;
    border-color: #3498db;
}

button {
    width: 100%;
    padding: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

button:hover {
    background: #2980b9;
}

button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}

.links {
    margin-top: 20px;
    text-align: center;
}

.links a {
    color: #3498db;
    text-decoration: none;
}

.links a:hover {
    text-decoration: underline;
}
</style>