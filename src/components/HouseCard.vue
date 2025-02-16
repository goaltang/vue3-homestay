<script setup lang="ts">
import { ref } from 'vue';
import type { HouseInfo } from '@/types/house';

defineProps<{
  house: HouseInfo;
}>();

const imageLoaded = ref(false);
const imageError = ref(false);

const handleImageLoad = () => {
  imageLoaded.value = true;
};

const handleImageError = () => {
  imageError.value = true;
};

// 默认占位图片
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3kuK0uLi48L3RleHQ+PC9zdmc+';
</script>

<template>
  <div class="house-card" @click="$router.push(`/house/${house.id}`)">
    <div class="house-image">
      <img :src="imageError ? placeholderImage : house.imageUrl" :alt="house.title" loading="lazy"
        @load="handleImageLoad" @error="handleImageError">
      <div v-if="!imageLoaded && !imageError" class="image-placeholder">
        <div class="loading-spinner"></div>
      </div>
      <span class="price">¥{{ house.price?.toFixed(2) || '暂无价格' }} / 晚</span>
    </div>
    <div class="house-info">
      <h3>{{ house.title }}</h3>
      <p class="address">
        <i class="location-icon">📍</i>
        {{ house.address }}
      </p>
      <div class="rating" v-if="house.rating">
        <span class="stars">★</span>
        <span>{{ house.rating?.toFixed(1) || '暂无评分' }}</span>
      </div>
      <div class="tags">
        <span v-for="tag in house.tags" :key="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.house-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.house-card:hover {
  transform: translateY(-2px);
}

.house-image {
  position: relative;
  height: 200px;
}

.house-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.house-info {
  padding: 15px;
}

h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.address {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

.price {
  color: #e74c3c;
  font-weight: bold;
  margin: 8px 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  color: #f1c40f;
}

/* ... 其他样式保持不变 ... */
</style>