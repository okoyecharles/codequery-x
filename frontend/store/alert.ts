import { create } from "zustand";

type AlertType = "destructive" | "default";

interface AlertState {
  message: string | null;
  type: AlertType | null;
  show: boolean;

  trigger: (message: string, type?: AlertType) => void;
  clear: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: null,
  type: null,
  show: false,

  trigger: (message, type = "default") =>
    set({ message, type, show: true }),

  clear: () => set({ show: false, message: null, type: null }),
}));
