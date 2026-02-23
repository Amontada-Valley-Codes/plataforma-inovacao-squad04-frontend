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

export type ShowPaginetedUsersResponse = {
  data: {
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
  }[],
  total: number,
  page: number,
  lastPage: number
}

export type ShowLoggedUserResponse = {
  id: string,
  name: string,
  email: string,
  phone: string,
  googleId: null | string,
  lastAccessAt: null | string,
  type_user: string,
  createdAt: string,
  enterpriseId: string,
  image: null | string,
  startupId: null | string,
  Enterprise: {
    name: string,
  },
  Startup: null | string
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