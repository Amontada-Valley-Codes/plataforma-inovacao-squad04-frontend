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