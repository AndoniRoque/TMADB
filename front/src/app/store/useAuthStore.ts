import {create} from "zustand";
import axios from "axios";

const URL_BACK = "http://localhost:3333/auth";

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  setUser: (username: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, 
  username: "Annonymous User",
  setUser: (username: string) => set({username, isLoggedIn: true}),
  logout: () => set({username:"Annonymous User", isLoggedIn: false}),
  checkAuthStatus: async () => {
    try{
      const response = await axios.get(`${URL_BACK}/status`, {withCredentials: true});
      console.log(response);
      if(response.data.authenticated) {
        console.log("entré");
        set({username: response.data.user.username, isLoggedIn: true});
      } else {
        set({username: "Annonymous User", isLoggedIn: false});
      }
    } catch (err) {
      set({username: "Annonymous User", isLoggedIn: false})
    }
  }
}))