<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api/admin';
import { ElMessage } from 'element-plus';

const statistics = ref({
    totalUsers: 0,
    totalHouses: 0,
    totalOrders: 0,
    totalRevenue: 0
});

const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const { data } = await adminApi.getDashboardStats();
        statistics.value = data;
    } catch (error) {
        ElMessage.error('获取统计数据失败');
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="dashboard">
        <el-row :gutter="20">
            <el-col :span="6" v-loading="loading">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>总用户数</span>
                        </div>
                    </template>
                    <div class="card-value">{{ statistics.totalUsers }}</div>
                </el-card>
            </el-col>

            <el-col :span="6" v-loading="loading">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>房源数量</span>
                        </div>
                    </template>
                    <div class="card-value">{{ statistics.totalHouses }}</div>
                </el-card>
            </el-col>

            <el-col :span="6" v-loading="loading">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>订单总数</span>
                        </div>
                    </template>
                    <div class="card-value">{{ statistics.totalOrders }}</div>
                </el-card>
            </el-col>

            <el-col :span="6" v-loading="loading">
                <el-card shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span>总收入</span>
                        </div>
                    </template>
                    <div class="card-value">¥{{ statistics.totalRevenue }}</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.dashboard {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
    text-align: center;
    padding: 20px 0;
}
</style>