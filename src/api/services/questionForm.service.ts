import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { FormQuestionPayload } from "../payloads/questionForm.payload";

export class questionFormService {

  async createQuestionForm(id: string, payload: FormQuestionPayload) {
    const { data } = await api.post(ENDPOINTS.QUESTION_FORM.CREATE_QUESTION(id), payload);
    return data;
  }

  async getQuestionFormById(versionId: string) {
    const { data } = await api.get<FormQuestionPayload>(ENDPOINTS.QUESTION_FORM.GET_QUESTIONS_BY_VERSION(versionId));
    return data;
  }

}