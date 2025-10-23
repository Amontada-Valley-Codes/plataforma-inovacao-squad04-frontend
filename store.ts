import { create } from "zustand";

type Store = {
  reload: boolean;
  triggerReload: () => void;
};

export const useStore = create<Store>((set) => ({
  reload: false,
  triggerReload: () => set((state) => ({ reload: !state.reload })),
}));
