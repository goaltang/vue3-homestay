<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHouseStore } from '../stores/house';
import { useAuthStore } from '../stores/auth';
import type { BookingForm } from '@/types';
import ReviewList from '../components/ReviewList.vue';
import ReviewForm from '../components/ReviewForm.vue';

const route = useRoute();
const router = useRouter();
const houseStore = useHouseStore();
const authStore = useAuthStore();

const bookingForm = ref<BookingForm>({
    checkIn: '',
    checkOut: '',
    guests: 1,
});

const isLoggedIn = computed(() => authStore.user !== null);
const totalNights = computed(() => {
    if (!bookingForm.value.checkIn || !bookingForm.value.checkOut) return 0;
    const start = new Date(bookingForm.value.checkIn);
    const end = new Date(bookingForm.value.checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
});

const totalPrice = computed(() => {
    if (!houseStore.currentHouse) return 0;
    return totalNights.value * houseStore.currentHouse.price;
});

onMounted(async () => {
    try {
        const houseId = route.params.id as string;
        console.log('Mounting with house ID:', houseId);
        await houseStore.fetchHouseDetail(houseId);
        console.log('Current house:', houseStore.currentHouse);
        if (!houseStore.currentHouse) {
            throw new Error("House not found");
        }
    } catch (error) {
        console.error("Error loading house:", error);
        router.push("/");
    }
});

const handleBooking = async () => {
    if (!isLoggedIn.value) {
        router.push('/login');
        return;
    }
    if (!bookingForm.value.checkIn || !bookingForm.value.checkOut) {
        alert('请选择入住和退房日期');
        return;
    }
    // 处理预订逻辑
};

const shareHouse = () => {
    // 实现分享功能
    navigator.share?.({
        title: houseStore.currentHouse?.title,
        text: houseStore.currentHouse?.description,
        url: window.location.href,
    }).catch(() => {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
    });
};

const handleReviewSuccess = () => {
    // 获取 ReviewList 组件实例
    const reviewListRef = ref<InstanceType<typeof ReviewList>>();
    // 刷新评价列表
    reviewListRef.value?.fetchReviews();
};
</script>

<template>
    <div v-if="houseStore.loading" class="loading">
        <div class="loading-spinner"></div>
        <p>正在加载房源信息...</p>
    </div>

    <div v-else-if="!houseStore.currentHouse" class="error">
        <p>房源信息加载失败</p>
        <button @click="router.push('/')">返回首页</button>
    </div>

    <div v-else class="house-detail">
        <!-- 顶部导航 -->
        <nav class="nav-bar">
            <button class="back-btn" @click="router.back()">←</button>
            <button class="share-btn" @click="shareHouse">分享</button>
        </nav>

        <!-- 图片画廊 -->
        <div class="gallery">
            <img :src="houseStore.currentHouse.imageUrl" :alt="houseStore.currentHouse.title">
        </div>

        <div class="content">
            <div class="main-info">
                <!-- 基本信息 -->
                <div class="basic-info">
                    <h1>{{ houseStore.currentHouse.title }}</h1>
                    <div class="meta">
                        <span class="rating">
                            ⭐️ {{ houseStore.currentHouse.rating.toFixed(1) }} · 超赞房东
                        </span>
                        <span class="location">
                            📍 {{ houseStore.currentHouse.address }}
                        </span>
                    </div>
                </div>

                <!-- 标签 -->
                <div class="tags">
                    <span v-for="tag in houseStore.currentHouse.tags" :key="tag">{{ tag }}</span>
                </div>

                <!-- 分割线 -->
                <div class="divider"></div>

                <!-- 房东信息 -->
                <div class="host-info" v-if="houseStore.currentHouse.owner">
                    <img :src="houseStore.currentHouse.owner.avatar" :alt="houseStore.currentHouse.owner.name">
                    <div class="host-details">
                        <h3>房东：{{ houseStore.currentHouse.owner.name }}</h3>
                        <p>超赞房东 · 响应率 98%</p>
                    </div>
                    <button class="contact-host">联系房东</button>
                </div>

                <!-- 描述 -->
                <div class="description">
                    <h2>房源介绍</h2>
                    <p>{{ houseStore.currentHouse.description }}</p>
                </div>

                <!-- 设施 -->
                <div class="facilities">
                    <h2>配套设施</h2>
                    <div class="facility-grid">
                        <div v-for="facility in houseStore.currentHouse.facilities" :key="facility"
                            class="facility-item">
                            <span class="facility-icon">✓</span>
                            {{ facility }}
                        </div>
                    </div>
                </div>

                <!-- 位置 -->
                <div class="location-section">
                    <h2>位置</h2>
                    <p class="address">
                        <i class="location-icon">📍</i>
                        {{ houseStore.currentHouse.address }}
                    </p>
                </div>

                <!-- 添加评价部分 -->
                <div class="reviews">
                    <ReviewList :house-id="route.params.id as string" />
                    <ReviewForm v-if="isLoggedIn" :house-id="route.params.id as string"
                        @success="handleReviewSuccess" />
                    <div v-else class="login-tip">
                        <router-link to="/login">登录</router-link>后可以发表评价
                    </div>
                </div>
            </div>

            <!-- 预订卡片 -->
            <div class="booking-card">
                <div class="price-section">
                    <span class="price">¥{{ houseStore.currentHouse.price }}</span>
                    <span class="unit">/晚</span>
                </div>

                <div class="booking-form">
                    <div class="dates">
                        <div class="date-input">
                            <label>入住日期</label>
                            <input type="date" v-model="bookingForm.checkIn">
                        </div>
                        <div class="date-input">
                            <label>退房日期</label>
                            <input type="date" v-model="bookingForm.checkOut">
                        </div>
                    </div>

                    <div class="guests-input">
                        <label>入住人数</label>
                        <select v-model="bookingForm.guests">
                            <option v-for="n in 10" :key="n" :value="n">{{ n }}人</option>
                        </select>
                    </div>

                    <div class="price-details" v-if="totalNights > 0">
                        <div class="price-item">
                            <span>¥{{ houseStore.currentHouse.price }} × {{ totalNights }}晚</span>
                            <span>¥{{ totalPrice }}</span>
                        </div>
                        <div class="price-item">
                            <span>清洁费</span>
                            <span>¥100</span>
                        </div>
                        <div class="price-item">
                            <span>服务费</span>
                            <span>¥{{ Math.floor(totalPrice * 0.1) }}</span>
                        </div>
                        <div class="price-total">
                            <span>总价</span>
                            <span>¥{{ totalPrice + 100 + Math.floor(totalPrice * 0.1) }}</span>
                        </div>
                    </div>

                    <button class="book-btn" @click="handleBooking"
                        :disabled="!bookingForm.checkIn || !bookingForm.checkOut">
                        {{ isLoggedIn ? '立即预订' : '登录后预订' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.house-detail {
    min-height: 100vh;
    background: #f8f9fa;
}

.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    z-index: 100;
}

.back-btn,
.share-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.gallery {
    width: 100%;
    height: 500px;
    overflow: hidden;
}

.gallery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.content {
    max-width: 1200px;
    margin: -100px auto 0;
    padding: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    position: relative;
}

.main-info {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.basic-info h1 {
    font-size: 2em;
    margin-bottom: 15px;
}

.meta {
    display: flex;
    gap: 20px;
    color: #666;
    margin-bottom: 20px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.tags span {
    padding: 6px 12px;
    background: #f0f2f5;
    border-radius: 20px;
    font-size: 0.9em;
}

.divider {
    height: 1px;
    background: #eee;
    margin: 30px 0;
}

.host-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.host-info img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    object-fit: cover;
}

.contact-host {
    margin-left: auto;
    padding: 10px 20px;
    border: 1px solid #3498db;
    color: #3498db;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.contact-host:hover {
    background: #3498db;
    color: white;
}

.description,
.facilities {
    margin-bottom: 30px;
}

.description h2,
.facilities h2 {
    margin-bottom: 20px;
}

.facility-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.facility-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.facility-icon {
    color: #3498db;
}

.map-placeholder {
    height: 300px;
    background: #eee;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

.booking-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 100px;
}

.price-section {
    margin-bottom: 20px;
}

.price {
    font-size: 2em;
    font-weight: bold;
}

.unit {
    color: #666;
}

.booking-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.date-input,
.guests-input {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.date-input input,
.guests-input select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

.price-details {
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666;
}

.price-total {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    font-weight: bold;
}

.book-btn {
    width: 100%;
    padding: 15px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.3s;
}

.book-btn:hover {
    background: #2980b9;
}

.book-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .content {
        grid-template-columns: 1fr;
    }

    .booking-card {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 20px 20px 0 0;
    }
}

.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
}

.error button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.reviews {
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px solid #eee;
}

.login-tip {
    text-align: center;
    padding: 20px;
    color: #666;
}

.login-tip a {
    color: #3498db;
    text-decoration: none;
}

.login-tip a:hover {
    text-decoration: underline;
}
</style>