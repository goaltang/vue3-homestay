<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import {
  Menu as IconMenu,
  House,
  Document,
  User,
  DataLine,
  ArrowRight,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue';

const isCollapse = ref(false);
const router = useRouter();
const authStore = useAuthStore();

// 检查认证状态
onMounted(async () => {
  if (!authStore.user) {
    await authStore.checkAuth();
  }
});

const handleLogout = async () => {
  try {
    const success = await authStore.logout();
    if (success) {
      router.push('/login');
      ElMessage.success('退出成功');
    }
  } catch (error) {
    ElMessage.error('退出失败');
  }
};
</script>

<template>
  <el-container class="admin-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <el-menu
        :collapse="isCollapse"
        class="admin-menu"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <div class="logo-container">
          <span class="logo-text" v-if="!isCollapse">后台管理系统</span>
          <el-icon class="menu-icon" v-else><IconMenu /></el-icon>
        </div>
        
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataLine /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>

        <el-menu-item index="/admin/houses">
          <el-icon><House /></el-icon>
          <template #title>房源管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/orders">
          <el-icon><Document /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container>
      <el-header>
        <div class="header-left">
          <el-button
            type="text"
            @click="isCollapse = !isCollapse"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-popover
            placement="bottom-end"
            :width="200"
            trigger="hover"
            popper-class="user-popover"
          >
            <template #reference>
              <div class="user-info">
                <el-avatar 
                  :size="32" 
                  :src="authStore.user?.avatar"
                />
                <span class="username">{{ authStore.user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
            </template>
            
            <div class="user-menu">
              <div class="user-header">
                <el-avatar 
                  :size="50" 
                  :src="authStore.user?.avatar"
                />
                <div class="user-details">
                  <div class="name">{{ authStore.user?.username }}</div>
                  <div class="role">{{ authStore.user?.role === 'ADMIN' ? '管理员' : '用户' }}</div>
                </div>
              </div>
              <div class="menu-divider"></div>
              <div class="menu-items">
                <div class="menu-item" @click="router.push('/profile')">
                  <el-icon><User /></el-icon>
                  <span>个人信息</span>
                </div>
                <div class="menu-item" @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-container {
  height: 100vh;
}

.admin-menu {
  height: 100%;
  border-right: none;
}

.logo-container {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b2f3a;
  color: #fff;
}

.logo-text {
  font-size: 16px;
  font-weight: bold;
}

.menu-icon {
  font-size: 20px;
  color: #fff;
}

.el-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.header-right {
  padding-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  margin: 0 8px;
  color: #606266;
}

.user-menu {
  padding: 0;
}

.user-header {
  padding: 20px;
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px 4px 0 0;
}

.user-details {
  margin-left: 15px;
}

.name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.role {
  font-size: 12px;
  color: #909399;
}

.menu-divider {
  height: 1px;
  background-color: #dcdfe6;
  margin: 0;
}

.menu-items {
  padding: 10px 0;
}

.menu-item {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item .el-icon {
  margin-right: 10px;
  font-size: 16px;
  color: #909399;
}

.menu-item span {
  color: #606266;
}

:deep(.el-popover.user-popover) {
  padding: 0;
  border-radius: 4px;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 