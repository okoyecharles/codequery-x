import { create } from "zustand";
import { api } from "@/lib/axios";
import { Question } from "@/core/common/types";

interface QuestionState {
  question: Question | null;
  loading: boolean;
	aiLoading: boolean;

  getQuestion: (id: string) => Promise<void>;
  postAnswer: (questionId: string, answer: string) => Promise<void>;
  updateAnswer: (questionId: string, answerId: string, answer: string) => Promise<void>;
  deleteAnswer: (questionId: string, answerId: string) => Promise<void>;
  upvoteAnswer: (questionId: string, answerId: string) => Promise<void>;
  downvoteAnswer: (questionId: string, answerId: string) => Promise<void>;
  updateQuestion: (id: string, answer: string) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
	getIntelligentAnswer: (id: string) => Promise<void>;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  question: null,
  loading: false,
	aiLoading: false,

  getQuestion: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get(`/questions/${id}`);
      set({ question: res.data.question, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to fetch question";
    }
  },

  postAnswer: async (questionId, answer) => {
    set({ loading: true });
    try {
      const res = await api.post(`/questions/${questionId}/answers`, { answer });
      set((state) => ({
        question: state.question
          ? res.data.question
          : null,
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to post answer";
    }
  },

  updateAnswer: async (questionId, answerId, answer) => {
    set({ loading: true });
    try {
      const res = await api.put(`/questions/${questionId}/answers/${answerId}`, { answer });
      set((state) => ({
        question: state.question
          ? res.data.question 
          : null,
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to update answer";
    }
  },

  deleteAnswer: async (questionId, answerId) => {
    set({ loading: true });
    try {
      await api.delete(`/questions/${questionId}/answers/${answerId}`);
      set((state) => ({
        question: state.question
          ? {
              ...state.question,
              answers: state.question.answers.filter((ans) => ans._id !== answerId),
            }
          : null,
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to delete answer";
    }
  },

  upvoteAnswer: async (questionId, answerId) => {
    try {
      const res = await api.put(`/questions/${questionId}/answers/${answerId}/upvote`);
      set((state) => ({
        question: state.question
          ? res.data.question 
          : null,
      }));
    } catch (err: any) {
      throw err.response?.data?.error || err.message || "Failed to upvote";
    }
  },

  downvoteAnswer: async (questionId, answerId) => {
    try {
      const res = await api.put(`/questions/${questionId}/answers/${answerId}/downvote`);
      set((state) => ({
        question: state.question
          ? res.data.question 
          : null,
      }));
    } catch (err: any) {
      throw err.response?.data?.error || err.message || "Failed to downvote";
    }
  },

  updateQuestion: async (id, answer) => {
    set({ loading: true });
    try {
      const res = await api.put(`/questions/${id}`, { question: answer });
      set({ question: res.data.question, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to update question";
    }
  },

  deleteQuestion: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/questions/${id}`);
      set({ question: null, loading: false });
    } catch (err: any) {
      set({ loading: false });
      throw err.response?.data?.error || err.message || "Failed to delete question";
    }
  },

	getIntelligentAnswer: async (id) => {
		set({ aiLoading: true });
		try {
			const res = await api.put(`/questions/${id}/answers/intelligent`);
			set({ question: res.data.question, aiLoading: false });
    } catch (err: any) {
      set({ aiLoading: false });
      throw err.response?.data?.error || err.message || "Failed to generate answer";
    }
	}
}));
