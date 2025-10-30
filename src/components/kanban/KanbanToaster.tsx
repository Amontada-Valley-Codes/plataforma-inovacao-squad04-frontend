"use client"

import toast from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";

export const showCustomToast = (message: string, type: "success" | "error") => {
    toast.custom((t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/20 
          text-white font-medium transition-all duration-300 transform ${t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
          ${
            type === "success"
              ? "bg-[#0b2b72]"
              : "bg-red-500"
          }`}
      >
        {type === "success" ? (
          <CheckCircle2 className="text-white" size={22} />
        ) : (
          <XCircle className="text-white" size={22} />
        )}
        <span>{message}</span>
      </div>
    ));
  };
