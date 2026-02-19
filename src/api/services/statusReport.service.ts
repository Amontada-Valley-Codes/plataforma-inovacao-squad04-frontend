import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
    SendStatusReportEmailPayload,
    CreateStatusReportPayload,
    CreateStatusReportResponse,
    SendStatusReportEmailResponse,
    ShowStatusReportsResponse,
    UpdateStatusReportPayload,
    UpdateStatusReportResponse,
} from "../payloads/statusReport.payload";

export const statusReportService = {
    async createStatus(challengeId: string, payload: CreateStatusReportPayload): Promise<CreateStatusReportResponse> {
        const { data } = await api.post(ENDPOINTS.STATUS_REPORT.CREATE(challengeId), payload)
        return data
    },

    async showStatus(): Promise<ShowStatusReportsResponse> {
        const { data } = await api.get(ENDPOINTS.STATUS_REPORT.GET)
        return data
    },

    async updateStatus(statusId: string, payload: UpdateStatusReportPayload): Promise<UpdateStatusReportResponse> {
        const { data } = await api.put(ENDPOINTS.STATUS_REPORT.UPDATE(statusId), payload)
        return data
    },

    async sendEmail(statusId: string, payload: SendStatusReportEmailPayload): Promise<SendStatusReportEmailResponse> {
        const { data } = await api.post(ENDPOINTS.STATUS_REPORT.SEND_EMAIL(statusId), payload)
        return data
    },
}