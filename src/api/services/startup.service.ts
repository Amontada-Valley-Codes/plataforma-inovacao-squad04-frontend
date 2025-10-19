import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { CreateStartupPayload, CreateStartupResponse, ShowAllStartupsResponse } from "../payloads/startup.payload";

export const startupService = {
  async showAllStartups(): Promise<ShowAllStartupsResponse[]> {
    const response = await api.get(ENDPOINTS.STARTUP.SHOW_ALL);
    console.log(response.data);
    return response.data;
  },

  async createStartup(createStartupPayload: CreateStartupPayload): Promise<CreateStartupResponse> {
    const response = await api.post(ENDPOINTS.STARTUP.CREATE, createStartupPayload);
    console.log(response.data);
    return response.data;
  }
}