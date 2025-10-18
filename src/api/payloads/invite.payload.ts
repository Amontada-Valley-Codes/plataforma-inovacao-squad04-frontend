export type InvitePayload = {
  email: string
  type_user: string
}
  
export type InviteRepose = {
  message: string
  inviteAt: string
  token: string
  expiresAt: string
}