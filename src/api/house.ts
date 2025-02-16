import request from "./request";
import type { HouseInfo } from "@/types/house";

export const houseApi = {
  getHouses(params?: any) {
    return request.get<HouseInfo[]>("/houses", { params });
  },

  getHouseById(id: string) {
    return request.get<HouseInfo>(`/houses/${id}`);
  },

  createHouse(data: any) {
    return request.post("/houses", data);
  },

  updateHouse(id: string, data: any) {
    return request.put(`/houses/${id}`, data);
  },

  deleteHouse(id: string) {
    return request.delete(`/houses/${id}`);
  },
};
