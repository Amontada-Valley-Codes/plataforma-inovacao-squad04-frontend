import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { InvitePayload, InviteRepose } from "../payloads/invite.payload"

export const inviteService = {
  async sendInvite(invitePayload: InvitePayload): Promise<InviteRepose>{
    const response = await api.post(ENDPOINTS.INVITE.SEND, invitePayload);
    console.log(response.data);
    return response.data;
  }
}