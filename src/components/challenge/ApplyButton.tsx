"use client";
import React from "react";
import { Loader2, Check } from "lucide-react";

type Props = {
  applied?: boolean;
  onApply?: () => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  labelApply?: string;
  labelApplied?: string;
};

export default function ApplyButton({
  applied = false,
  onApply,
  disabled = false,
  className = "",
  labelApply = "Candidatar-se",
  labelApplied = "Solicitado",
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const isDisabled = disabled || applied || loading;

  async function handleClick() {
    if (!onApply || isDisabled) return;
    try {
      setLoading(true);
      await onApply();
    } finally {
      setLoading(false);
    }
  }

  const base =
    "inline-flex w-full items-center justify-center gap-2 select-none " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15358D] " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 " +
    "transition-all duration-150";

  if (applied) {
    // Chip mais discreto e compacto
    return (
      <span
        className={[
          base,
          "h-10 rounded-xl border border-emerald-200/60 bg-emerald-50/60 text-emerald-700",
          "text-[13px] font-medium shadow-none",
          className,
        ].join(" ")}
        aria-live="polite"
      >
        <Check className="h-4 w-4" aria-hidden />
        {labelApplied}
      </span>
    );
  }

  // Primário refinado
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={[
        base,
        "h-10 rounded-xl text-[13px] font-semibold",
        "bg-[#15358D] text-white",
        "shadow-[0_6px_16px_rgba(21,53,141,0.18)] hover:shadow-[0_8px_20px_rgba(21,53,141,0.24)]",
        "hover:translate-y-[-1px] active:translate-y-0",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
      aria-live="polite"
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Processando…
        </>
      ) : (
        <>{labelApply}</>
      )}
    </button>
  );
}
