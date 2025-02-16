import { ref } from "vue";
import { defineStore } from "pinia";
import { houseApi } from "@/api/house";
import type { HouseInfo } from "@/types/house";
import { ElMessage } from "element-plus";

export const useHouseStore = defineStore("house", () => {
  const houseList = ref<HouseInfo[]>([]);
  const currentHouse = ref<HouseInfo | null>(null);
  const loading = ref(false);

  const fetchHouseList = async (params?: any) => {
    loading.value = true;
    try {
      const { data } = await houseApi.getHouses(params);
      houseList.value = data || [];
    } catch (error) {
      console.error("Failed to fetch house list:", error);
      ElMessage.error("获取房源列表失败");
      houseList.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchHouseDetail = async (id: string) => {
    loading.value = true;
    try {
      const { data } = await houseApi.getHouseById(id);
      currentHouse.value = data;
    } catch (error) {
      console.error("Failed to fetch house detail:", error);
      ElMessage.error("获取房源详情失败");
      currentHouse.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    houseList,
    currentHouse,
    loading,
    fetchHouseList,
    fetchHouseDetail,
  };
});

export default useHouseStore;
