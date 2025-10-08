"use client";

import { MoreHorizontal, Settings, TriangleAlert, User } from "lucide-react";
import Image from "next/image";
import type { Companie } from "@/mocks/CompaniesData";
import { companiesData } from "@/mocks/CompaniesData";
import { useState, useMemo, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import CompaniesProfile from "./CompaniesProfile";              // modal
import CompaniesProfileInline from "./CompaniesProfileInline";  // inline

type Props = {
  companyId?: string;
  autoOpen?: boolean;
};

export default function CompanieCard({ companyId, autoOpen = false }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCompanie, setSelectedCompanie] = useState<Companie | null>(null);

  const list = useMemo(() => {
    const base = companiesData as Companie[];
    if (!companyId) return base;
    const target = String(companyId);
    return base.filter((c: any) => String(c?.id) === target);
  }, [companyId]);

  useEffect(() => {
    if (!autoOpen) return;
    const first = list[0];
    if (first) setSelectedCompanie(first);
  }, [autoOpen, list]);

  // Inline (abre na página, sem modal)
  if (autoOpen) {
    if (!list.length) {
      return <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">Empresa não encontrada.</div>;
    }
    return <CompaniesProfileInline data={list[0]} />;
  }

  // Lista + Modal
  if (!list.length) {
    return <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">Nenhuma empresa encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {list.map((companie) => (
        <div
          key={(companie as any).id}
          className="w-full bg-[#F9FAFB] dark:bg-gray-900 rounded-xl shadow-md border border-[#E5E7EB] dark:border-gray-800 p-6 hover:scale-[1.01] transition transform"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Imagem + Nome */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-[30%] justify-center md:justify-start">
              <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={companie.logo}
                  alt={companie.nome ?? "Logo da empresa"}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-semibold text-[#15358D] dark:text-blue-500">{companie.nome}</h2>
                <p className="text-sm text-[#98A2B3]">{companie.areaAtuacao}</p>
              </div>
            </div>

            {/* Infos */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%] mt-4 md:mt-0 text-sm text-[#344054] dark:text-[#ced3db]">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15358D]" />
                  <span>{companie.cnpj}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <User size={15} className="text-[#98A2B3]" />
                  {companie.gestor}
                </div>
                <div className="flex w-full items-center gap-2">
                  <TriangleAlert size={15} className="text-[#98A2B3]" />
                  {companie.email}
                </div>
                <div className="flex w-full items-center gap-2">
                  <Settings size={15} className="text-[#98A2B3]" />
                  {companie.setor}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="flex items-center text-sm text-[#344054] dark:text-[#ced3db] md:w-[30%]">
              {companie.descricao}
            </div>

            {/* Menu */}
            <div className="flex justify-center md:justify-end w-full md:w-[10%]">
              <button
                onClick={() => {
                  setSelectedCompanie(companie);
                  openModal();
                }}
              >
                <MoreHorizontal
                  size={36}
                  className="p-2 text-[#344054] dark:text-[#ced3db] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 rounded-full cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal (seu componente original) */}
      <CompaniesProfile data={selectedCompanie} isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
