'use client';

import { Calendar, MoreHorizontal, Settings, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { Startup, StartupData } from '@/mocks/StartupData';
import { useModal } from '@/hooks/useModal';
import StartupProfile from './StartupProfile';
import { useMemo, useState } from 'react';

type Role = 'admin' | 'gestor' | 'avaliador' | 'usuario';

type Props = {
  role: Role;
  /** companyId do usuário logado (para avaliador/usuario) */
  viewerCompanyId?: string;
};

type StartupView = Startup & { companyId: string };

export default function StartupCard({ role, viewerCompanyId }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  // Normaliza companyId como string sem mexer no mock
  const data: StartupView[] = useMemo(
    () =>
      (StartupData as Startup[]).map((s) => ({
        ...s,
        companyId: String((s as any)?.companyId ?? ''), // suporta mock sem tipar
      })),
    []
  );

  const filtered = useMemo(() => {
    const canSeeAll = role === 'admin' || role === 'gestor';
    if (canSeeAll) return data;
    // avaliador/usuario -> só da própria empresa
    if (!viewerCompanyId) return []; // sem empresa vinculada
    return data.filter((s) => s.companyId === String(viewerCompanyId));
  }, [data, role, viewerCompanyId]);

  if (!filtered.length) {
    return (
      <div className="w-full p-6 text-sm text-gray-500 dark:text-[#ced3db]">
        Nenhuma startup encontrada {role === 'admin' || role === 'gestor' ? '' : 'para sua empresa'}.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full p-4">
      {filtered.map((startup) => (
        <div
          key={startup.id}
          className="w-full bg-[#F9FAFB] dark:bg-gray-900 rounded-xl shadow-md border border-[#E5E7EB] dark:border-gray-800 p-6 hover:scale-[1.01] transition transform"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Imagem + Nome */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-[30%] justify-center md:justify-start">
              <div className="w-16 h-16 bg-[#E5E7EB] dark:bg-gray-700 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={startup.logo}
                  alt={startup.nome ?? 'Logo da startup'}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-semibold text-[#15358D] dark:text-blue-500">{startup.nome}</h2>
                <p className="text-sm text-[#98A2B3]">{startup.areaAtuacao}</p>
              </div>
            </div>

            {/* Infos */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[50%] mt-4 md:mt-0 text-sm text-[#344054] dark:text-[#ced3db]">
              <div className="flex flex-col items-center md:items-start gap-2">
                {/* CNPJ */}
                <div className="flex w-full items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#15358D]"></span>
                  <span>{startup.cnpj}</span>
                </div>

                {/* Razão social */}
                <div className="flex w-full items-center gap-2">
                  <Calendar size={15} className="text-[#98A2B3]" />
                  {startup.razaoSocial}
                </div>

                {/* Email */}
                <div className="flex w-full items-center gap-2">
                  <TriangleAlert size={15} className="text-[#98A2B3]" />
                  {startup.email}
                </div>

                {/* Setor */}
                <div className="flex w-full items-center gap-2">
                  <Settings size={15} className="text-[#98A2B3]" />
                  {startup.setor}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="flex items-center text-sm text-[#344054] dark:text-[#ced3db] md:w-[30%]">
              {startup.descricao}
            </div>

            {/* Menu */}
            <div className="flex justify-center md:justify-end w-full md:w-[10%]">
              <button
                onClick={() => {
                  setSelectedStartup(startup);
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

      <StartupProfile isOpen={isOpen} onClose={closeModal} data={selectedStartup} />
    </div>
  );
}
