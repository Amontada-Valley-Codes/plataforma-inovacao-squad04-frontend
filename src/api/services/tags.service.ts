import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateTagPayload,
  CreateTagResponse,
  DeleteTagResponse,
  ShowAllTagsResponse,
  ShowOneTagsResponse,
  UpdateTagPayload,
  UpdateTagResponse 
} from "../payloads/tags.payload";

export const tagsService = {
  async createTag(challengeId: string, payload: CreateTagPayload): Promise<CreateTagResponse> {
    const response = await api.post(ENDPOINTS.TAGS.CREATE_TAG(challengeId), payload)
    console.log(response.data)
    return response.data
  },

  async showAllTags(challengeId: string): Promise<ShowAllTagsResponse[]> {
    const response = await api.get(ENDPOINTS.TAGS.SHOW_ALL_TAGS(challengeId))
    console.log(response.data)
    return response.data
  },

  async updateTag(tagId: string, payload: UpdateTagPayload): Promise<UpdateTagResponse> {
    const response = await api.put(ENDPOINTS.TAGS.UPDATE_TAG(tagId), payload)
    console.log(response.data)
    return response.data
  },

  async deleteTag(tagId: string): Promise<DeleteTagResponse> {
    const response = await api.delete(ENDPOINTS.TAGS.DELETE_TAG(tagId))
    console.log(response.data)
    return response.data
  },

  async showOneTag(tagId: string): Promise<ShowOneTagsResponse> {
    const response = await api.get(ENDPOINTS.TAGS.SHOW_ONE_TAG(tagId))
    console.log(response.data)
    return response.data
  },
}