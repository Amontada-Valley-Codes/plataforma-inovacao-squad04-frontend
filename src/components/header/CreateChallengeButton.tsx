"use client";
import { PlusCircle } from "lucide-react";
import RegisterChallengeForm from "../challenge/RegisterChallengeForm";
import { useModal } from "@/hooks/useModal";

export default function CreateChallengeButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button
        onClick={openModal}
        aria-label="Adicionar desafio"
        className={[
          "inline-flex items-center rounded-[12px] font-medium transition-colors duration-200",
          "bg-[#15358d] hover:bg-[#112c75] text-white",
          "border border-gray-200 dark:border-gray-800 dark:text-[#ced3db] dark:bg-blue-800 dark:hover:bg-blue-900",
          "whitespace-nowrap",          // evita quebra do texto
          "h-9 px-3 text-xs",           // <768
          "min-[768px]:h-10 min-[768px]:px-3 min-[768px]:text-xs", // 768–839 (compacto)
          "min-[840px]:h-11 min-[840px]:px-4 min-[840px]:text-sm"  // ≥840
        ].join(" ")}
      >
        <PlusCircle className="mr-1 h-4 w-4 min-[840px]:h-5 min-[840px]:w-5" />

        {/* <768: curto */}
        <span className="min-[768px]:hidden"> Desafio</span>

        {/* 768–839: manter curto para caber */}
        <span className="hidden min-[768px]:inline min-[840px]:hidden"> Desafio</span>

        {/* 840–1127: médio */}
        <span className="hidden min-[840px]:inline min-[1128px]:hidden">Desafio</span>

        {/* ≥1128: completo */}
        <span className="hidden min-[1128px]:inline">Adicionar Desafio</span>
      </button>

      <RegisterChallengeForm isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
