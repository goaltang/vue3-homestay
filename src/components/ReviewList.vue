<script setup lang="ts">
import { ref, onMounted } from "vue";
import { reviewApi } from "@/api/review";
import type { Review } from "@/types/review";

const props = defineProps<{
    houseId: string;
}>();

const reviews = ref<Review[]>([]);
const loading = ref(false);

// 添加图片预览功能
const previewImage = (url: string) => {
    window.open(url, '_blank');
};

const fetchReviews = async () => {
    loading.value = true;
    try {
        const { data } = await reviewApi.getHouseReviews(props.houseId);
        console.log('Fetched reviews:', data); // 添加日志
        reviews.value = data.list || [];
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
    } finally {
        loading.value = false;
    }
};

// 暴露方法给父组件
defineExpose({
    fetchReviews
});

onMounted(() => {
    fetchReviews();
});

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
</script>

<template>
    <div class="reviews-section">
        <h2>用户评价</h2>
        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>加载评价中...</p>
        </div>
        <div v-else-if="reviews.length === 0" class="no-reviews">
            暂无评价
        </div>
        <div v-else class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                    <div class="user-info">
                        <img :src="review.user.avatar" :alt="review.user.username">
                        <div>
                            <h4>{{ review.user.username }}</h4>
                            <time>{{ formatDate(review.createdAt) }}</time>
                        </div>
                    </div>
                    <div class="rating">
                        <span v-for="i in 5" :key="i" class="star">
                            {{ i <= review.rating ? "★" : "☆" }} </span>
                    </div>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <div v-if="review.images?.length" class="review-images">
                    <img v-for="(image, index) in review.images" :key="index" :src="image"
                        @click="() => previewImage(image)">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reviews-section {
    margin-top: 40px;
}

.review-list {
    margin-top: 20px;
}

.review-item {
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.user-info {
    display: flex;
    gap: 15px;
    align-items: center;
}

.user-info img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info h4 {
    margin: 0;
    color: #333;
}

.user-info time {
    color: #666;
    font-size: 0.9em;
}

.rating {
    color: #f1c40f;
    font-size: 1.2em;
}

.review-content {
    margin: 0;
    line-height: 1.6;
    color: #444;
}

.review-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 15px;
}

.review-images img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
}

.no-reviews {
    text-align: center;
    padding: 40px;
    color: #666;
}

.loading {
    text-align: center;
    padding: 40px;
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