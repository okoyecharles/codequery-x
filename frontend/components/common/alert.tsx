"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAlertStore } from "@/store/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useEffect } from "react";

export default function GlobalAlert() {
  const { show, message, type, clear } = useAlertStore();

  // Auto-hide after 3s
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => clear(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [show, clear]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[300px] animate-in fade-in slide-in-from-top-2">
      <Alert variant={type}>
        {type === "default" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
        <AlertTitle className="capitalize">
          {type === "default" ? "Success" : "Error"}
        </AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
