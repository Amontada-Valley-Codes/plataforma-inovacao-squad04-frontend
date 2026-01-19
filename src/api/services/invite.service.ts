import api from "../axios"
import { ENDPOINTS } from "../endpoints"
import { ForgotPasswordPayload, ForgotPasswordResponse, InvitePayload, InviteRepose } from "../payloads/invite.payload"

export const inviteService = {
  async sendInvite(invitePayload: InvitePayload): Promise<InviteRepose>{
    const response = await api.post(ENDPOINTS.INVITE.SEND, invitePayload);
    console.log(response.data);
    return response.data;
  },

  async sendForgotPasswordCode(forgotPasswordPayload: ForgotPasswordPayload): Promise<ForgotPasswordResponse>{
    const response = await api.post(ENDPOINTS.INVITE.FORGOT_PASSWORD, forgotPasswordPayload);
    console.log(response.data);
    return response.data;
  }
}