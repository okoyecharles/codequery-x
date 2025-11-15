import { create } from "zustand";
import { api } from "@/lib/axios";
import { Question } from "@/core/common/types";

interface QuestionsState {
  questions: Question[];
  loading: boolean;

  getQuestions: () => Promise<void>;
  searchQuestions: (query: string) => Promise<void>;
  getQuestion: (id: string) => Promise<Question>;
  askQuestion: (question: string) => Promise<Question>;
  updateQuestion: (id: string, question: string) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<void>;
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: [],
  loading: false,

  getQuestions: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/questions");
      set({ questions: data.questions, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to fetch questions";
    }
  },

  searchQuestions: async (query: string) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/questions/search?q=${encodeURIComponent(query)}`);
      set({ questions: data.questions, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to search questions";
    }
  },

  getQuestion: async (id: string) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/questions/${id}`);
      set({ loading: false });
      return data.question;
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to fetch question";
    }
  },

  askQuestion: async (question: string) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/questions", { question });
      set({ questions: [data.question, ...get().questions], loading: false });
      return data.question;
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to create question";
    }
  },

  updateQuestion: async (id: string, question: string) => {
    set({ loading: true });
    try {
      const { data } = await api.put(`/questions/${id}`, { question });
      set({
        questions: get().questions.map((q) =>
          q._id === id ? data.question : q
        ),
        loading: false,
      });
      return data.question;
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to update question";
    }
  },

  deleteQuestion: async (id: string) => {
    set({ loading: true });
    try {
      await api.delete(`/questions/${id}`);
      set({
        questions: get().questions.filter((q) => q._id !== id),
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false });
      throw err?.error || "Failed to delete question";
    }
  },
}));
