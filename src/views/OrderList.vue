<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { orderApi } from '@/api/order';
import type { Order } from '@/types/order';

const orders = ref<Order[]>([]);
const loading = ref(false);

const fetchOrders = async () => {
    loading.value = true;
    try {
        const { data } = await orderApi.getUserOrders();
        orders.value = data.list;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
    } finally {
        loading.value = false;
    }
};

const cancelOrder = async (orderId: string) => {
    try {
        await orderApi.cancelOrder(orderId);
        await fetchOrders(); // 刷新列表
    } catch (error) {
        console.error('Failed to cancel order:', error);
    }
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
};

const getStatusText = (status: Order['status']) => {
    const statusMap = {
        pending: '待确认',
        confirmed: '已确认',
        cancelled: '已取消',
        completed: '已完成'
    };
    return statusMap[status];
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div class="order-list">
        <h2>我的订单</h2>

        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>加载订单中...</p>
        </div>

        <div v-else-if="orders.length === 0" class="no-orders">
            暂无订单
        </div>

        <div v-else class="orders">
            <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                    <img :src="order.house.imageUrl" :alt="order.house.title">
                    <div class="order-info">
                        <h3>{{ order.house.title }}</h3>
                        <p class="address">{{ order.house.address }}</p>
                    </div>
                </div>

                <div class="order-details">
                    <div class="detail-item">
                        <span class="label">入住时间</span>
                        <span>{{ formatDate(order.checkIn) }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">退房时间</span>
                        <span>{{ formatDate(order.checkOut) }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">入住人数</span>
                        <span>{{ order.guests }}人</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">订单状态</span>
                        <span :class="['status', order.status]">{{ getStatusText(order.status) }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">总价</span>
                        <span class="price">¥{{ order.totalPrice }}</span>
                    </div>
                </div>

                <div class="order-actions">
                    <button v-if="order.status === 'pending'" class="cancel-btn" @click="cancelOrder(order.id)">
                        取消订单
                    </button>
                    <router-link :to="`/house/${order.houseId}`" class="view-house-btn">
                        查看房源
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.orders {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.order-header {
    display: flex;
    gap: 20px;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.order-header img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
}

.order-info h3 {
    margin: 0 0 10px;
    color: #333;
}

.address {
    color: #666;
    font-size: 0.9em;
}

.order-details {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.label {
    color: #666;
    font-size: 0.9em;
}

.status {
    font-weight: 500;
}

.status.pending {
    color: #f39c12;
}

.status.confirmed {
    color: #2ecc71;
}

.status.cancelled {
    color: #e74c3c;
}

.status.completed {
    color: #3498db;
}

.price {
    color: #e74c3c;
    font-weight: bold;
    font-size: 1.1em;
}

.order-actions {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 15px;
    justify-content: flex-end;
}

.cancel-btn,
.view-house-btn {
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.9em;
}

.cancel-btn {
    background: #fff;
    border: 1px solid #e74c3c;
    color: #e74c3c;
}

.view-house-btn {
    background: #3498db;
    border: none;
    color: white;
}

.loading,
.no-orders {
    text-align: center;
    padding: 40px;
    color: #666;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>