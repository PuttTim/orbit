import { create } from "zustand"
import { AuthSlice, createAuthSlice } from "./slices/authSlice"

export const useAppStore = create<AuthSlice>((...a) => ({
    ...createAuthSlice(...a),
}))
