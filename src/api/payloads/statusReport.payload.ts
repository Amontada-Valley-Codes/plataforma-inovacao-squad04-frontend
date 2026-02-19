export type CreateStatusReportPayload = {
    advances_of_the_Week: string;
    problemsFound: string;
    nextSteps: string;
};

export type CreateStatusReportResponse = {
  id: string
  advances_of_the_Week: string
  problemsFound: string
  nextSteps: string
  challengeId: string
  createdAt: string
  updatedAt: string
}

export type ShowStatusReportsResponse = CreateStatusReportResponse[]

export type UpdateStatusReportPayload = CreateStatusReportPayload

export type UpdateStatusReportResponse = CreateStatusReportResponse

export type SendStatusReportEmailPayload = {
    emails: string[];
};

export type SendStatusReportEmailResponse = {
    message: string
    recipients: string[]
}
