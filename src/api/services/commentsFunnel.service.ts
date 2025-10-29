import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { CreateCommentPayload, CreateCommentResponse, DeleteCommentResponse, FilteredCommentReponse, LikedCommentResponse, UpdateCommentPayload, UpdateCommentResponse } from "../payloads/commentsFunel.payload";

export const commentsService = {
  async createComment(challengeId: string, createCommentPayload: CreateCommentPayload): Promise<CreateCommentResponse> {
    const response = await api.post(ENDPOINTS.COMMENTS_FUNNEL.CREATE_COMMENT(challengeId), createCommentPayload);
    console.log(response.data)
    return response.data;
  },

  async updateComment(commentId: string, updateCommentPayload: UpdateCommentPayload): Promise<UpdateCommentResponse> {
    const response = await api.put(ENDPOINTS.COMMENTS_FUNNEL.UPDATE_COMMENT(commentId), updateCommentPayload);
    console.log(response.data)
    return response.data;
  },

  async deleteComment(commentId: string): Promise<DeleteCommentResponse> {
    const response = await api.delete(ENDPOINTS.COMMENTS_FUNNEL.DELETE_COMMENT(commentId));
    console.log(response.data);
    return response.data;
  },

  async likedComment(commentId: string): Promise<LikedCommentResponse> {
    const response = await api.post(ENDPOINTS.COMMENTS_FUNNEL.LIKED_COMMENT(commentId));
    console.log(response.data);
    return response.data;
  },

  async filteredComment(challengeId: string, context: string): Promise<FilteredCommentReponse> {
    const response = await api.get(ENDPOINTS.COMMENTS_FUNNEL.FILTERED_COMMENT(challengeId, context));
    console.log(response.data);
    return response.data;
  }
}