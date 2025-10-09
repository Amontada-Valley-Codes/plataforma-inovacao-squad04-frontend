// src/components/companies/CompanieCard.tsx
"use client";

import { MoreHorizontal, Settings, TriangleAlert, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { companiesData, type Companie } from "@/mocks/CompaniesData";
import { useModal } from "@/hooks/useModal";
import CompaniesProfile from "./CompaniesProfile";
import CompaniesProfileInline from "./CompaniesProfileInline";

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;          // <- controla comportamento do clique
  companyId?: string;   // opcional: filtra por id específico
  autoOpen?: boolean;   // opcional: abre inline (detalhe) da empresa
};

export default function CompanieCard({
  role = "admin",
  companyId,
  autoOpen = false,
}: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedCompanie, setSelectedCompanie] = useState<Companie | null>(null);

  const list = useMemo(() => {
    const base = companiesData as Companie[];
    if (!companyId) return base;
    return base.filter((c) => String(c.id) === String(companyId));
  }, [companyId]);

  useEffect(() => {
    if (!autoOpen) return;
    if (list[0]) setSelectedCompanie(list[0]);
  }, [autoOpen, list]);

  // Visual inline (detalhe direto)
  if (autoOpen) {
    if (!list.length) {
      return (
        <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
          Empresa não encontrada.
        </div>
      );
    }
    return <CompaniesProfileInline data={list[0]} />;
  }

  if (!list.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhuma empresa encontrada.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {list.map((companie) => {
        const name = companie.nome;
        const logo = companie.logo;

        // Se não for admin, o card vira link para a dashboard da empresa
        const Wrapper: React.FC<{ children: React.ReactNode }> =
          role === "admin"
            ? ({ children }) => <>{children}</>
            : ({ children }) => (
                <Link
                  href={`/company/${companie.id}/dashboard?role=${role}`}
                  className="block"
                  prefetch={false}
                >
                  {children}
                </Link>
              );

        return (
          <div
            key={String(companie.id)}
            className="w-full bg-[#F9FAFB] dark:bg-gray-900 rounded-xl shadow-md border border-[#E5E7EB] dark:border-gray-800 p-6 hover:scale-[1.01] transition transform"
          >
            <Wrapper>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Imagem + Nome */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-[30%] justify-center md:justify-start">
                  <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={`${name} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 grid place-items-center text-sm font-medium">
                        {name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-semibold text-[#15358D] dark:text-blue-500">
                      {name}
                    </h2>
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

                {/* Menu (somente admin abre modal) */}
                {role === "admin" && (
                  <div className="flex justify-center md:justify-end w-full md:w-[10%]">
                    <button
                      onClick={() => {
                        setSelectedCompanie(companie);
                        openModal();
                      }}
                      aria-label={`Abrir menu da empresa ${name}`}
                    >
                      <MoreHorizontal
                        size={36}
                        className="p-2 text-[#344054] dark:text-[#ced3db] hover:bg-[#E5E7EB] dark:hover:bg-gray-700 rounded-full cursor-pointer"
                      />
                    </button>
                  </div>
                )}
              </div>
            </Wrapper>
          </div>
        );
      })}

      {/* Modal (apenas quando admin seleciona uma empresa) */}
      {role === "admin" && selectedCompanie && (
        <CompaniesProfile
          data={selectedCompanie}
          isOpen={isOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
