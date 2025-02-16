<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 表单数据
const keyword = ref(route.query.keyword as string || '');
const minPrice = ref(route.query.minPrice as string || '');
const maxPrice = ref(route.query.maxPrice as string || '');
const selectedCity = ref(route.query.city as string || '');
const selectedTags = ref((route.query.tags as string || '').split(',').filter(Boolean));
const minRating = ref(Number(route.query.minRating) || 0);
const sortBy = ref(route.query.sortBy as string || 'default');
const sortOrder = ref(route.query.sortOrder as string || 'desc');

// 城市列表
const cities = ['全部城市', '北京', '上海', '深圳', '三亚', '成都', '杭州'];

// 标签列表
const allTags = ['海景', '双床', '度假', '商圈', '地铁', '文化', '胡同', '智能', '温泉', '亲子'];

// 评分选项
const ratingOptions = [
    { value: 0, label: '全部评分' },
    { value: 4.5, label: '4.5分以上' },
    { value: 4, label: '4分以上' },
    { value: 3.5, label: '3.5分以上' },
];

// 排序选项
const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price_asc', label: '价格从低到高' },
    { value: 'price_desc', label: '价格从高到低' },
    { value: 'rating_desc', label: '评分从高到低' },
];

const handleSearch = () => {
    const query: Record<string, string> = {};

    if (keyword.value) {
        query.keyword = keyword.value;
    }
    if (minPrice.value) {
        query.minPrice = minPrice.value;
    }
    if (maxPrice.value) {
        query.maxPrice = maxPrice.value;
    }
    if (selectedCity.value && selectedCity.value !== '全部城市') {
        query.city = selectedCity.value;
    }
    if (selectedTags.value.length > 0) {
        query.tags = selectedTags.value.join(',');
    }
    if (minRating.value > 0) {
        query.minRating = minRating.value.toString();
    }

    const [sort, order] = sortBy.value.includes('_')
        ? sortBy.value.split('_')
        : [sortBy.value, 'desc'];

    if (sort !== 'default') {
        query.sortBy = sort;
        query.sortOrder = order;
    }

    // 如果有搜索条件，跳转到搜索结果页
    if (Object.keys(query).length > 0) {
        router.push({
            path: '/search',
            query
        });
    }
};

const handleReset = () => {
    keyword.value = '';
    minPrice.value = '';
    maxPrice.value = '';
    selectedCity.value = '全部城市';
    selectedTags.value = [];
    minRating.value = 0;
    sortBy.value = 'default';

    if (route.path === '/search') {
        router.push('/');
    }
};

const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag);
    if (index === -1) {
        selectedTags.value.push(tag);
    } else {
        selectedTags.value.splice(index, 1);
    }
};
</script>

<template>
    <div class="search-bar">
        <div class="search-section">
            <div class="basic-search">
                <input v-model="keyword" type="text" placeholder="搜索房源..." @keyup.enter="handleSearch">
                <div class="price-inputs">
                    <input v-model="minPrice" type="number" placeholder="最低价格">
                    <span>-</span>
                    <input v-model="maxPrice" type="number" placeholder="最高价格">
                </div>
            </div>

            <div class="advanced-search">
                <div class="filter-section">
                    <h4>城市</h4>
                    <div class="city-options">
                        <button v-for="city in cities" :key="city"
                            :class="['city-btn', { active: selectedCity === city }]" @click="selectedCity = city">
                            {{ city }}
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4>房源特色</h4>
                    <div class="tag-options">
                        <button v-for="tag in allTags" :key="tag"
                            :class="['tag-btn', { active: selectedTags.includes(tag) }]" @click="toggleTag(tag)">
                            {{ tag }}
                        </button>
                    </div>
                </div>

                <div class="filter-section">
                    <h4>评分</h4>
                    <select v-model="minRating">
                        <option v-for="option in ratingOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <div class="filter-section">
                    <h4>排序</h4>
                    <select v-model="sortBy">
                        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="search-buttons">
                <button class="reset-btn" @click="handleReset">重置</button>
                <button class="search-btn" @click="handleSearch">搜索</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.search-bar {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.basic-search {
    display: flex;
    gap: 15px;
    align-items: center;
}

.price-inputs {
    display: flex;
    align-items: center;
    gap: 10px;
}

input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
}

input[type="text"] {
    flex: 1;
}

.price-inputs input {
    width: 100px;
}

.advanced-search {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.filter-section {
    flex: 1;
    min-width: 200px;
}

.filter-section h4 {
    margin: 0 0 10px;
    color: #666;
}

.city-options,
.tag-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.city-btn,
.tag-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
}

.city-btn.active,
.tag-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
}

.search-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.reset-btn,
.search-btn {
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.reset-btn {
    background: white;
    border: 1px solid #ddd;
    color: #666;
}

.search-btn {
    background: #3498db;
    border: none;
    color: white;
}

.reset-btn:hover {
    background: #f5f5f5;
}

.search-btn:hover {
    background: #2980b9;
}

@media (max-width: 768px) {
    .basic-search {
        flex-direction: column;
    }

    input[type="text"],
    .price-inputs {
        width: 100%;
    }

    .filter-section {
        width: 100%;
    }

    .search-buttons {
        width: 100%;
    }

    .reset-btn,
    .search-btn {
        flex: 1;
    }
}
</style>