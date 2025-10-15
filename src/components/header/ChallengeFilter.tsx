"use client";

import { ChevronDown, CircleCheckBig, ClipboardList, Plus } from "lucide-react";
import { useState } from "react";
import CreateChallengeButton from "./CreateChallengeButton";
import RegisterStartupBtn from "../startup/RegisterStartupButton";
import RegisterCOmpanieBtn from "../companies/RegisterCompanieButton";

type Props = {
  isStartup?: boolean;
  IsChallenge?: boolean;
  isCompanie?: boolean;
  showAddButtons?: boolean;
};

export default function ChallengeFilter({
  IsChallenge,
  isStartup,
  isCompanie,
  showAddButtons = true,
}: Props) {
  const [isSetorOpen, setSetorIsOpen] = useState(false);
  const [isStatusOpen, setStatusIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* linha única no mobile; quebra (justify-between) no md+ */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto px-2 py-1.5 md:flex-wrap md:justify-between md:px-3 md:py-2 hide-scrollbar">
        {/* Filtros (mobile compacto) */}
        <div className="flex flex-nowrap items-center gap-2">
          {/* Data */}
          <label className="flex h-9 items-center gap-2 rounded-[12px] border border-gray-200 bg-white px-3 text-xs font-semibold text-zinc-500 dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db] md:h-11 md:text-sm">
            <input
              type="date"
              className="h-full w-[120px] bg-transparent outline-none md:w-[160px]"
            />
          </label>

          {/* Setor */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db]">
              <ClipboardList size={16} className="md:hidden" />
              <ClipboardList size={18} className="hidden md:block" />
            </div>

            <select
              onClick={() => setSetorIsOpen(!isSetorOpen)}
              onBlur={() => setSetorIsOpen(false)}
              className="h-9 min-w-[130px] rounded-[12px] border border-gray-200 bg-white pl-9 pr-7 text-xs font-semibold text-zinc-500 appearance-none dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db] md:h-11 md:min-w-[160px] md:text-sm md:pr-8"
            >
              <option disabled>Setor</option>
              <option value="financeiro">Financeiro</option>
              <option value="rh">RH</option>
              <option value="ti">TI</option>
            </select>

            <ChevronDown
              size={16}
              className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform duration-300 dark:text-[#ced3db] ${
                isSetorOpen ? "rotate-180" : ""
              } md:size-5`}
            />
          </div>

          {/* Status */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db]">
              <CircleCheckBig size={16} className="md:hidden" />
              <CircleCheckBig size={18} className="hidden md:block" />
            </div>

            <select
              onClick={() => setStatusIsOpen(!isStatusOpen)}
              onBlur={() => setStatusIsOpen(false)}
              className="h-9 min-w-[140px] rounded-[12px] border border-gray-200 bg-white pl-9 pr-7 text-xs font-semibold text-zinc-500 appearance-none dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db] md:h-11 md:min-w-[170px] md:text-sm md:pr-8"
            >
              <option disabled>Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>

            <ChevronDown
              size={16}
              className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-transform duration-300 dark:text-[#ced3db] ${
                isStatusOpen ? "rotate-180" : ""
              } md:size-5`}
            />
          </div>
        </div>

        {/* Ações: compacta no mobile, normal no md+ */}
        {showAddButtons && (
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
            {/* Botão Desafio — compacto no mobile */}
            {IsChallenge && (
              <>
                {/* Versão compacta (mobile): ícone + “Desafio” */}
                <div className="md:hidden">
                  {/* Se o seu CreateChallengeButton aceitar props, use: */}
                  <CreateChallengeButton
                    // @ts-ignore - se não existir, ignore; caso exista, ótimo
                    size="sm"
                    label="Desafio"
                    className="h-9 px-3 text-xs whitespace-nowrap"
                  />
                  {/* Fallback caso o componente não aceite props acima:
                  <button
                    onClick={() => document.getElementById('open-create-challenge')?.click()}
                    className="h-9 px-3 rounded-lg bg-brand-600 text-white text-xs flex items-center gap-1.5"
                  >
                    <Plus className="size-4" />
                    Desafio
                  </button>
                  <span id="open-create-challenge" className="hidden">
                    <CreateChallengeButton />
                  </span>
                  */}
                </div>

                {/* Versão padrão no md+ */}
                <div className="hidden md:block">
                  <CreateChallengeButton />
                </div>
              </>
            )}

            {isStartup && (
              <>
                <div className="md:hidden scale-95">
                  <RegisterStartupBtn />
                </div>
                <div className="hidden md:block">
                  <RegisterStartupBtn />
                </div>
              </>
            )}

            {isCompanie && (
              <>
                <div className="md:hidden scale-95">
                  <RegisterCOmpanieBtn />
                </div>
                <div className="hidden md:block">
                  <RegisterCOmpanieBtn />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* opcional: esconder scrollbar horizontal no mobile */
{/* Em globals.css:
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/}
