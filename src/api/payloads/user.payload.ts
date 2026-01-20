export type ShowAllUsersResponse = {
    id: string,
    name: string,
    email: string,
    phone: string,
    googleId: null,
    lastAccessAt: null,
    type_user: string,
    createdAt: string,
    enterpriseId: string,
    image: null,
    startupId: null,
    Enterprise: {
      name: string
    },
  }[]

export type ShowLoggedUserResponse = {
  id: string,
  name: string,
  email: string,
  phone: string,
  googleId: null,
  lastAccessAt: null,
  type_user: string,
  createdAt: string,
  enterpriseId: string,
  image: null,
  startupId: null,
  Enterprise: {
    name: string,
  },
  Startup: null
}

export type UpdatesUserResponse = {
  name: string
  email: string
  phone: string
  image: {
    url: string
    public_id: string
  }
}
export type UpdatesUserPayload = {
  name?: string
  phone?: string
  image?: File
}