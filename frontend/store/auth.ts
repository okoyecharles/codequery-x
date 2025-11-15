import { create } from "zustand";
import Cookies from "js-cookie";
import {  COOKIE_NAME } from "@/lib/api";
import { api } from "@/lib/axios";
import { User } from "@/core/common/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;

  signin: (username: string, password: string) => Promise<any>;
  signup: (name: string, username: string, password: string) => Promise<any>;
  signout: () => void;
  loadUserFromStorage: () => void;
  validate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  loadUserFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({ token, user: JSON.parse(user) });
      Cookies.set(COOKIE_NAME, token); // restore cookie too
    }
  },

  signin: async (username, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/users/signin", { username, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set(COOKIE_NAME, token);

      set({ token, user, loading: false });
      return res.data;
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message;
    }
  },

  signup: async (name, username, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/users/signup", { name, username, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      Cookies.set(COOKIE_NAME, token);

      set({ token, user, loading: false });
      return res.data;
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message;
    }
  },

  signout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove(COOKIE_NAME);
    set({ token: null, user: null });
  },

  validate: async () => {
    const token = localStorage.getItem("token") || Cookies.get(COOKIE_NAME);
    if (!token) return;

    try {
      const res = await api.post("/users/validate");
      const { user } = res.data;
      set({ user, token });
    } catch {
      get().signout();
    }
  },
}));
