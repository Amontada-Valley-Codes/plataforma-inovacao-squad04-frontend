import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  CreateBuyMaterializationResponse,
  DeleteBuyResponse,
  UpdateBuyPayload,
  UpdateBuyResponse,
  createBuyMaterializationPayload,
  showBuyMaterializationResponse,
} from "../payloads/buy-materialization.payload";

export const BuyMaterializationService = {
  async createBuy(payload: createBuyMaterializationPayload, challengeId: string): Promise<CreateBuyMaterializationResponse> {
    const formData = new FormData()

    formData.append("hmwProblem", payload.hmwProblem)
    formData.append("challengeRules", payload.challengeRules)

    if (payload.edital instanceof File) {
      formData.append("edital", payload.edital)
    }

    payload.selectionCriteria.forEach((criteria) => {
      formData.append("selectionCriteria", criteria)
    })

    const res = await api.post(
      ENDPOINTS.BUY_MATERIALIZATION.CREATE_BUY(challengeId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return res.data
  },

  async ShowBuys(): Promise<showBuyMaterializationResponse> {
    const res = await api.get(ENDPOINTS.BUY_MATERIALIZATION.GET_BUY)
    console.log(res.data)
    return res.data
  },

  async updateBuy(payload: UpdateBuyPayload, buyId: string): Promise<UpdateBuyResponse> {
    const formData = new FormData()

    formData.append("hmwProblem", payload.hmwProblem)
    formData.append("challengeRules", payload.challengeRules)

    if (payload.edital instanceof File) {
      formData.append("edital", payload.edital)
    }

    payload.selectionCriteria.forEach((criteria) => {
      formData.append("selectionCriteria", criteria)
    })

    const res = await api.put(
      ENDPOINTS.BUY_MATERIALIZATION.UPDATE_BUY(buyId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return res.data
  },

  async deleteBuy(buyId: string): Promise<DeleteBuyResponse> {
    const res = await api.delete(ENDPOINTS.BUY_MATERIALIZATION.DELETE_BUY(buyId))
    console.log(res.data)
    return res.data
  },
}