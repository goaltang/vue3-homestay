<script setup lang="ts">
import { onMounted } from 'vue';
import { useHouseStore } from '../stores/house';
import SearchBar from '../components/SearchBar.vue';
import HouseCard from '../components/HouseCard.vue';

const houseStore = useHouseStore();

onMounted(() => {
  houseStore.fetchHouseList();
});
</script>

<template>
  <div class="home">
    <SearchBar />
    <div class="house-section">
      <h2>精选房源</h2>
      <div v-if="houseStore.loading" class="loading">
        <div class="loading-spinner"></div>
        <p>正在加载精选房源...</p>
      </div>
      <div v-else-if="!houseStore.houseList?.length" class="no-results">
        <p>暂无符合条件的房源</p>
      </div>
      <div v-else class="house-list">
        <HouseCard v-for="house in houseStore.houseList" :key="house.id" :house="house" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
}

.house-section {
  margin-top: 20px;
}

.house-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.no-results {
  text-align: center;
  padding: 20px;
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
</style>