import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { CreateEnterprisePayload, CreateEnterpriseResponse } from "../payloads/enterprise.payload";

export const enterpriseService = {
  async createEnterprise(createEnterprisePayload: CreateEnterprisePayload): Promise<CreateEnterpriseResponse> {
    const response = await api.post(ENDPOINTS.ENTERPRISE.CREATE, createEnterprisePayload);
    console.log(response.data);
    return response.data
  }
};