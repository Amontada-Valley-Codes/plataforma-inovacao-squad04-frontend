export type CreateKPIsPayload = {
  name: string;
  target: string;
}

export type CreateKPIsResponse = {
  id: string;
  name: string;
  target: string;
  experimentationId: string;
}

export type ShowKPIsResponse = {
  id: string;
  name: string;
  target: string;
  experimentationId: string;
}

export type UpdateKPIsPayload = {
  name: string;
  target: string;
}

export type UpdateKPIsResponse = {
  id: string;
  name: string;
  target: string;
  experimentationId: string;
}

export type DeleteKPIsResponse = {
  id: string;
  name: string;
  target: string;
  experimentationId: string;
}