import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateEnterprisePayload, CreateEnterpriseResponse, ShowAllEnterpriseResponse } from "../payloads/enterprise.payload";

export const enterpriseService = {
  async createEnterprise(createEnterprisePayload: CreateEnterprisePayload): Promise<CreateEnterpriseResponse> {
    const response = await api.post(ENDPOINTS.ENTERPRISE.CREATE, createEnterprisePayload);
    console.log(response.data);
    return response.data
  },

  async showAllEnterprises(): Promise<ShowAllEnterpriseResponse[]> {
    const response = await api.get(ENDPOINTS.ENTERPRISE.SHOW_ALL);
    console.log(response.data);
    return response.data;
  }
};