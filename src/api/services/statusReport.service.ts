import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import {
    CreateStatusReportPayload,
    SendStatusReportEmailPayload,
    StatusReportResponse,
} from "../payloads/statusReport.payload";

export const StatusReportService = {
    async create(challengeId: string, payload: any) {
        const url = ENDPOINTS.STATUS_REPORT.CREATE(challengeId);

        console.log("POST ->", api.defaults.baseURL, url);
        console.log("PAYLOAD ->", JSON.stringify(payload, null, 2));

        try {
            const { data } = await api.post(url, payload);
            return data;
        } catch (err: any) {
            console.log("STATUS_REPORT_CREATE_ERROR_STATUS:", err?.response?.status);
            console.log("STATUS_REPORT_CREATE_ERROR_DATA:", err?.response?.data);

            throw err;
        }
    },

    async getByChallenge(challengeId: string): Promise<StatusReportResponse> {
        const { data } = await api.get<StatusReportResponse>(
            ENDPOINTS.STATUS_REPORT.GET_BY_CHALLENGE(challengeId)
        );
        return data;
    },

    async sendEmail(statusReportId: string, payload: SendStatusReportEmailPayload) {
        const { data } = await api.post(
            ENDPOINTS.STATUS_REPORT.SEND_EMAIL(statusReportId),
            payload
        );
        return data;
    },

};
