import { create } from "zustand";
import axios from "axios";

const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  setUser: (username: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  role: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: "Annonymous User",
  setUser: (username: string) => set({ username, isLoggedIn: true }),
  logout: () => set({ username: "Annonymous User", isLoggedIn: false }),
  role: "USER",
  checkAuthStatus: async () => {
    try {
      const response = await axios.get(`${URL_BACK}/status`, {
        withCredentials: true,
      });
      console.log(response.data);
      if (response.data.authenticated) {
        console.log(">>>>", response.data.user.role);
        set({
          username: response.data.user.username,
          isLoggedIn: response.data.authenticated,
          role: response.data.user.role,
        });
      } else {
        set({ username: "Annonymous User", isLoggedIn: false });
      }
    } catch (err) {
      set({ username: "Annonymous User", isLoggedIn: false });
    }
  },
}));
