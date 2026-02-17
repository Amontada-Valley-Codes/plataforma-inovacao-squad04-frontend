import api from "../axios";
import { ENDPOINTS } from "../endpoints";
import { 
  AddSponsorPayload,
  AddSponsorResponse,
  DeleteSponsorResponse,
  ShowSponsorsResponse,
  UpdateSponsorPayload,
  UpdateSponsorResponse,
 } from "../payloads/sponsors.payload";

export const sponsorsService = {
  async AddSponsor(payload: AddSponsorPayload): Promise<AddSponsorResponse> {
    const res = await api.post(ENDPOINTS.SPONSOR.ADD, payload)
    console.log(res.data)
    return res.data
  },

  async ShowSponsors(): Promise<ShowSponsorsResponse> {
    const res = await api.get(ENDPOINTS.SPONSOR.SHOW)
    console.log(res.data)
    return res.data
  },

  async UpdateSponsor(sponsorId: string, payload: UpdateSponsorPayload): Promise<UpdateSponsorResponse> {
    const res = await api.patch(ENDPOINTS.SPONSOR.UPDATE(sponsorId), payload)
    console.log(res.data)
    return res.data
  },

  async DeleteSponsor(sponsorId: string): Promise<DeleteSponsorResponse> {
    const res = await api.delete(ENDPOINTS.SPONSOR.DELETE(sponsorId))
    console.log(res.data)
    return res.data
  },
}