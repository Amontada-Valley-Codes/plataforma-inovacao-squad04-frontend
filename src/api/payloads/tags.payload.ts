export type CreateTagPayload = {
  tag: string
}

export type CreateTagResponse = {
  id: string,
  tag: string,
  createdAt: string,
  updatedAt: string,
  challengeId: string,
  userId: string
}

export type ShowAllTagsResponse = {
  id: string,
  tag: string,
  userId: string,
  challengeId: string
}

export type ShowOneTagsResponse = {
  id: string,
  tag: string
}

export type UpdateTagPayload = {
  tag: string
}

export type UpdateTagResponse = {
  tag: string,
  id: string
}

export type DeleteTagResponse = {
  message: string
}