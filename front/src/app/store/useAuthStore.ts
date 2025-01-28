import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";
const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = URL_BACK;

interface User {
  username: string;
  role: string;
  id?: string;
  mail?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  setUser: (user: User) => void;
  login: (username: string, passwrod: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: {
    username: "Annonymous User",
    role: "USER",
  },
  setUser: (user: User) =>
    set({
      user,
      isLoggedIn: true,
    }),
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`/login`, {
        username,
        password,
      });

      console.log("response upon login", response.data);

      if (response.data.user) {
        set({
          isLoggedIn: true,
          user: response.data.user,
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  logout: async () => {
    try {
      await axios.get(`/api/logout`);
      set({
        isLoggedIn: false,
        user: {
          username: "Annonymous User",
          role: "USER",
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  checkAuthStatus: async () => {
    try {
      const response = await axios.get(`/status`, {
        withCredentials: true,
      });
      console.log("response data on check auth status", response.data);
      if (response.data.authenticated) {
        set({
          user: {
            username: response.data.user.username,
            role: response.data.user.role,
            id: response.data.user.id,
            mail: response.data.user.mail,
          },
          isLoggedIn: true,
        });
      } else {
        set({
          isLoggedIn: false,
          user: {
            username: "Annonymous User",
            role: "USER",
          },
        });
      }
    } catch (err) {
      set({
        isLoggedIn: false,
        user: {
          username: "Annonymous User",
          role: "USER",
        },
      });
    }
  },
}));

export const useProtectedRoute = () => {
  const { isLoggedIn, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return isLoggedIn;
};
