"use client";

import { useAlertStore } from "@/store/alert";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);
  const validate = useAuthStore((state) => state.validate);
	const trigger = useAlertStore((state) => state.trigger);

	async function validateUser() {
    loadUserFromStorage();
    const token = localStorage.getItem("token");
		if (!token) return;
		
		try {
			await validate();
			trigger("You are logged in");
		} catch (err) {
			trigger(String(err), "destructive");
		}
	}

  useEffect(() => {
		validateUser();
  }, [loadUserFromStorage, validate]);

  return <>{children}</>;
}
