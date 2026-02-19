import api from "../axios";
import { ENDPOINTS } from "../endpoints";

export const ReportsService = {
  async downloadFinalReport(challengeId: string) {
    const { data } = await api.get(ENDPOINTS.REPORTS.DOWLOAD(challengeId));
    return data;
  }
}