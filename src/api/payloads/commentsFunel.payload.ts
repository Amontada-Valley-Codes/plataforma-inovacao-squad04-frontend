export type CreateCommentPayload = {
  comment: string
  context: string
}

export type CreateCommentResponse = {
  id: string
  comment: string
  timestap: string
  context: string
  enterpriseId: string
  challengeId: string
  userId: string
}

export type UpdateCommentPayload = {
  comment: string
  context: string
}

export type UpdateCommentResponse = {
  id: string
  comment: string
  timestap: string
  context: string
  enterpriseId: string
  challengeId: string
  userId: string
}

export type DeleteCommentResponse = {
  message: string
}

export type LikedCommentResponse = {
  curtida: boolean
  message: string
}

export type FilteredCommentReponse = {  
  id: string
  comment: string
  timestap: string
  context: string
  enterpriseId: string
  challengeId: string
  userId: string
  users: {
    name: string
    image: null | string
  }
  _count: {
    Comments_funnel_Like: number
  }

}
