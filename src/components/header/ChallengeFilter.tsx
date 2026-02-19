"use client";


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
    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 w-full">
      {/* linha única no mobile; quebra (justify-between) no md+ */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto px-2 py-1.5 md:flex-wrap md:justify-between md:px-3 md:py-2 hide-scrollbar">
        {/* Filtros (mobile compacto) */}
        <div className="flex flex-nowrap items-center gap-2">
         
        </div>
      </div>
      {/* Ações: compacta no mobile, normal no md+ */}
      {showAddButtons && (
        <div className="flex items-center gap-2 px-2 flex-nowrap overflow-x-auto">
          {/* Botão Desafio — compacto no mobile */}
          {IsChallenge && (
            <>
              {/* Versão compacta (mobile): ícone + “Desafio” */}
              <div className="md:hidden">
                {/* Se o seu CreateChallengeButton aceitar props, use: */}
                <CreateChallengeButton
                  // @ts-expect-error - se não existir, ignore; caso exista, ótimo
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
  );
}

/* opcional: esconder scrollbar horizontal no mobile */
{/* Em globals.css:
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/}
