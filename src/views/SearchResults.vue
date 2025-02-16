<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHouseStore } from '../stores/house';
import type { SearchParams } from '@/types';
import SearchBar from '../components/SearchBar.vue';

const route = useRoute();
const router = useRouter();
const houseStore = useHouseStore();

const viewMode = ref<'grid' | 'list'>('grid');
const currentPage = ref(1);
const pageSize = 12;
const hasMore = ref(true);
const loading = ref(false);

const fetchHouses = () => {
    const params: SearchParams = {};

    // 从 URL 获取所有查询参数
    if (route.query.keyword) {
        params.keyword = route.query.keyword as string;
    }
    if (route.query.minPrice) {
        params.minPrice = route.query.minPrice as string;
    }
    if (route.query.maxPrice) {
        params.maxPrice = route.query.maxPrice as string;
    }
    if (route.query.city && route.query.city !== '全部城市') {
        params.city = route.query.city as string;
    }
    if (route.query.tags) {
        params.tags = (route.query.tags as string).split(',');
    }
    if (route.query.minRating) {
        params.minRating = Number(route.query.minRating);
    }
    if (route.query.sortBy) {
        params.sortBy = route.query.sortBy as "price" | "rating" | "default";
    }
    if (route.query.sortOrder) {
        params.sortOrder = route.query.sortOrder as "asc" | "desc";
    }

    console.log("Fetching with params:", params);
    houseStore.fetchHouseList(params);
};

// 监听路由变化
watch(() => route.query, fetchHouses, { immediate: true });

onMounted(() => {
    fetchHouses();
});

const handleBack = () => {
    router.push('/');
};

const loadMore = async () => {
    if (loading.value) return;
    loading.value = true;
    currentPage.value++;
    
    try {
        const params = {
            ...getSearchParams(),
            page: currentPage.value,
            pageSize,
        };
        await houseStore.fetchHouseList(params);
        hasMore.value = houseStore.houseList.length === pageSize;
    } finally {
        loading.value = false;
    }
};

const getSearchParams = () => {
    const params: SearchParams = {};
    if (route.query.keyword) params.keyword = route.query.keyword as string;
    if (route.query.minPrice) params.minPrice = route.query.minPrice as string;
    if (route.query.maxPrice) params.maxPrice = route.query.maxPrice as string;
    if (route.query.city) params.city = route.query.city as string;
    if (route.query.tags) params.tags = (route.query.tags as string).split(',');
    if (route.query.minRating) params.minRating = Number(route.query.minRating);
    if (route.query.sortBy) params.sortBy = route.query.sortBy as "price" | "rating" | "default";
    if (route.query.sortOrder) params.sortOrder = route.query.sortOrder as "asc" | "desc";
    return params;
};
</script>

<template>
    <div class="search-results">
        <div class="search-header">
            <button class="back-btn" @click="handleBack">返回首页</button>
            <SearchBar />
        </div>

        <div class="results-section">
            <div class="results-header">
                <div class="results-count">
                    找到 {{ houseStore.houseList.length }} 个符合条件的房源
                </div>
                <div class="view-options">
                    <button 
                        :class="['view-btn', { active: viewMode === 'grid' }]" 
                        @click="viewMode = 'grid'"
                    >
                        📱 网格视图
                    </button>
                    <button 
                        :class="['view-btn', { active: viewMode === 'list' }]" 
                        @click="viewMode = 'list'"
                    >
                        📃 列表视图
                    </button>
                </div>
            </div>

            <div v-if="houseStore.loading" class="loading">
                <div class="loading-spinner"></div>
                <p>正在搜索...</p>
            </div>
            <div v-else-if="houseStore.houseList.length === 0" class="no-results">
                <p>未找到符合条件的房源</p>
                <button class="back-btn" @click="handleBack">返回首页</button>
            </div>
            <div v-else :class="['house-list', viewMode]">
                <div v-for="house in houseStore.houseList" :key="house.id" class="house-card"
                    @click="$router.push(`/house/${house.id}`)">
                    <div class="house-image">
                        <img :src="house.imageUrl" :alt="house.title">
                        <span class="price">¥{{ house.price }}/晚</span>
                    </div>
                    <div class="house-info">
                        <h3>{{ house.title }}</h3>
                        <p class="address">
                            <i class="location-icon">📍</i>
                            {{ house.address }}
                        </p>
                        <div class="rating">
                            <span class="stars">⭐️ {{ house.rating.toFixed(1) }}</span>
                        </div>
                        <div class="tags">
                            <span v-for="tag in house.tags" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="hasMore" class="load-more">
                <button @click="loadMore" :disabled="loading">
                    {{ loading ? '加载中...' : '加载更多' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-results {
    padding: 20px;
    min-height: 100vh;
    background: #f8f9fa;
}

.search-header {
    max-width: 1200px;
    margin: 0 auto 20px;
}

.back-btn {
    margin-bottom: 20px;
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.back-btn:hover {
    background: #f5f5f5;
}

.results-section {
    max-width: 1200px;
    margin: 40px auto;
}

.results-section h2 {
    margin-bottom: 30px;
    color: #2c3e50;
}

.house-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.house-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    cursor: pointer;
}

.house-card:hover {
    transform: translateY(-5px);
}

.house-image {
    position: relative;
    height: 200px;
}

.house-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.price {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: bold;
}

.house-info {
    padding: 20px;
}

.house-info h3 {
    margin: 0 0 10px;
    color: #2c3e50;
}

.address {
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
}

.rating {
    margin-bottom: 10px;
}

.stars {
    color: #f1c40f;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tags span {
    background: #f0f2f5;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.9em;
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

.no-results {
    text-align: center;
    padding: 40px;
    color: #666;
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
    .search-results {
        padding: 10px;
    }

    .results-section {
        margin: 20px auto;
    }

    .house-list {
        gap: 20px;
    }
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.results-count {
    color: #666;
}

.view-options {
    display: flex;
    gap: 10px;
}

.view-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
}

.view-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.house-list.list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.house-list.list .house-card {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;
}

.house-list.list .house-image {
    height: 200px;
}

.load-more {
    text-align: center;
    margin-top: 30px;
}

.load-more button {
    padding: 10px 20px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.load-more button:hover {
    background: #2980b9;
}

.load-more button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}
</style>