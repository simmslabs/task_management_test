import type { user } from "@prisma/client";
import { create } from "zustand";

export const use_user_store = create<{
  user: user | null,
  set: (o: user | null) => void
}>((set) => ({
  user: null,
  set: (o) => set({ user: o })
}));