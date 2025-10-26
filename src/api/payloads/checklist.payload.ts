export type CreateChecklistPayload = {
  text: string;
}

export type CreateChecklistResponse = {
  id: string;
  text: string;
  completed: boolean;
  challengeId: string;
  userId: string;
}

export type ShowAllChecklistsResponse = {
  id: string;
  text: string;
  completed: boolean;
  challengeId: string;
  userId: string;
}

export type UpdateStatusChecklistResponse = {
  id: string;
  text: string;
  completed: boolean;
  challengeId: string;
  userId: string;
}

export type DeleteChecklistResponse = {
  id: string;
  text: string;
  completed: boolean;
  challengeId: string;
  userId: string;
}

export type UpdateChecklistPayload = {
  text: string;
}

export type UpdateChecklistResponse = {
  id: string;
  text: string;
  completed: boolean;
  challengeId: string;
  userId: string;
}