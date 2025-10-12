// src/components/companies/CompanieCard.tsx
"use client";

import { MoreHorizontal, Settings, TriangleAlert, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { companiesData, type Companie } from "@/mocks/CompaniesData";
import CompaniesProfileInline from "./CompaniesProfileInline";

type Role = "admin" | "gestor" | "avaliador" | "usuario";

type Props = {
  role?: Role;
  companyId?: string;
  autoOpen?: boolean;
  /** id da empresa do usuário logado (para permitir gestor editar apenas a própria) */
  viewerCompanyId?: number;
};

export default function CompanieCard({
  role = "usuario",
  companyId,
  autoOpen = false,
  viewerCompanyId,
}: Props) {
  const list = useMemo(() => {
    const base = companiesData as Companie[];
    if (!companyId) return base;
    const idNum = Number(companyId);
    if (Number.isFinite(idNum)) return base.filter((c) => c.id === idNum);
    return base.filter((c) => String(c.id) === String(companyId));
  }, [companyId]);

  // Visual inline (detalhe direto + edição quando permitido)
  if (autoOpen) {
    if (!list.length) {
      return <div className="w-full p-6 text-sm text-gray-500">Empresa não encontrada.</div>;
    }

    // Só admin ou gestor DA PRÓPRIA empresa podem editar
    const canEdit =
      role === "admin" ||
      (role === "gestor" && String(viewerCompanyId) === String(list[0].id));

    return <CompaniesProfileInline data={list[0]} editable={canEdit} />;
  }

  // Lista (modo normal)
  if (!list.length) {
    return <div className="w-full p-6 text-sm text-gray-500">Nenhuma empresa encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {list.map((companie) => {
        const name = companie.nome;
        const logo = companie.logo;

        const destByRole: Record<Role, string> = {
          admin:     `/company/${companie.id}/dashboard?role=${role}`,
          gestor:    `/company/${companie.id}/empresa?role=${role}`,
          avaliador: `/company/${companie.id}/desafios?role=${role}`,
          usuario:   `/company/${companie.id}/empresa?role=${role}`,
        };

        const Wrapper: React.FC<{ children: React.ReactNode }> =
          role === "admin"
            ? ({ children }) => <>{children}</>
            : ({ children }) => (
                <Link href={destByRole[role]} className="block" prefetch={false}>
                  {children}
                </Link>
              );

        return (
          <div
            key={String(companie.id)}
            className="w-full bg-[#F9FAFB] dark:bg-gray-900 rounded-xl shadow-md border border-[#E5E7EB] dark:border-gray-800 p-6"
          >
            <Wrapper>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-[30%] justify-center md:justify-start">
                  <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={`${name} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 grid place-items-center text-sm font-medium">
                        {name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="font-semibold text-[#15358D] dark:text-blue-500">{name}</h2>
                    <p className="text-sm text-[#98A2B3]">{companie.areaAtuacao}</p>
                  </div>
                </div>

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

                <div className="flex items-center text-sm text-[#344054] dark:text-[#ced3db] md:w-[30%]">
                  {companie.descricao}
                </div>
              </div>
            </Wrapper>
          </div>
        );
      })}
    </div>
  );
}
