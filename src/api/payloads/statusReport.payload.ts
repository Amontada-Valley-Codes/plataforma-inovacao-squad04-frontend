export type CreateStatusReportPayload = {
    advances_of_the_Week: string;
    problemsFound: string;
    nextSteps: string;
};

export type StatusReportResponse = {
    id: string;
    challengeId: string;
    avancos: string;
    problemas: string;
    proximosPassos: string;
    createdAt: string;
    updatedAt: string;
};

export type SendStatusReportEmailPayload = {
    emails: string[];
};
