import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
  CreateEnterprisePayload,
  CreateEnterpriseResponse,
  ShowAllEnterpriseResponse,
} from "../payloads/enterprise.payload";

/**
 * Serviço responsável pelas requisições relacionadas a "Empresas" (Enterprises).
 * Inclui criação, listagem e — futuramente — atualização e exclusão.
 */
export const enterpriseService = {
  /**
   * Cria uma nova empresa.
   * Retorna os dados da empresa criada e o token de convite do gestor.
   */
  async createEnterprise(
    payload: CreateEnterprisePayload
  ): Promise<CreateEnterpriseResponse> {
    try {
      const response = await api.post<CreateEnterpriseResponse>(
        ENDPOINTS.ENTERPRISE.CREATE,
        payload
      );
      console.log("✅ Empresa criada:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao criar empresa:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Lista todas as empresas cadastradas (para administradores ou gestores).
   */
  async showAllEnterprises(): Promise<ShowAllEnterpriseResponse[]> {
    try {
      const response = await api.get<ShowAllEnterpriseResponse[]>(
        ENDPOINTS.ENTERPRISE.SHOW_ALL
      );
      console.log("📊 Empresas carregadas:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro ao carregar empresas:", error.response?.data || error);
      throw error;
    }
  },
};
