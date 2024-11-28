import create from "zustand";
import axios from "axios";
import { CharacterStore } from "../types/types";
const URL_BACK = "http://localhost:3333/api";

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: [],
  loading: false,
  error: null,
  getCharacters: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${URL_BACK}/characters/`, {
        withCredentials: true,
      });
      set({ characters: response.data, loading: false });
    } catch (err: any) {
      console.error(err);
      set({
        error: "Characters couldn't be fetched",
        loading: false,
      });
    }
  },
}));
