import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { FormQuestionPayload, UpdateQuestionPayload } from "../payloads/questionForm.payload";

export class questionFormService {

  async createQuestionForm(id: string, payload: FormQuestionPayload) {
    const { data } = await api.post(ENDPOINTS.QUESTION_FORM.CREATE_QUESTION(id), payload);
    return data;
  }

  async getQuestionFormById(versionId: string) {
    const { data } = await api.get(ENDPOINTS.QUESTION_FORM.GET_QUESTIONS_BY_VERSION(versionId));
    return data;
  }

  async updateQuestionForm(id: string, payload: UpdateQuestionPayload) {
    const { data } = await api.put(ENDPOINTS.QUESTION_FORM.UPDATE_QUESTION(id), payload);
    return data;
  }

  async deleteQuestionForm(id: string) {
    const { data } = await api.delete(ENDPOINTS.QUESTION_FORM.DELETE_QUESTION(id));
    return data;
  }

}