export type LoginPayload = {
  email: string,
  password: string
}

export type LoginResponse = {
  access_token: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  token: string
}

export type RegisterResponse = {
  message: string
  userId: string
}

export type ResetPasswordPayload = {
  email: string
  phone: string
  newPassword: string
  token: string
}

export type ResetPasswordResponse = {
 message: string
}