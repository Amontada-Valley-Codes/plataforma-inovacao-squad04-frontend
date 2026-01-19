export type InvitePayload = {
  email: string
  phone: string
  type_user: string
}
  
export type InviteRepose = {
  message: string
  inviteAt: string
  token: string
  zap: string
  expiresAt: string
}

export type ForgotPasswordPayload = {
  email: string
  phone: string
}

export type ForgotPasswordResponse = {
  message: string
  passwordResetId: string
  token: string
  zap: string
  expiresAt: string
}