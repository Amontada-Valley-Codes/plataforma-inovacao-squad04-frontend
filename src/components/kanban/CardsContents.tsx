import { BriefcaseBusiness, Bug, Building2, ChartNoAxesCombined, ChartPie, Lamp, Lightbulb, Menu, TriangleAlert, Trophy } from "lucide-react";
import ForwardButton from "./ForwardButton"
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

type CardChallangeContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardChallangeContent = ({ challangeTitle, category, description, featureId, handleApproveAndMove}: CardChallangeContentProps) => {
  return (
    //conteudo do card de desafio
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
          {category.toUpperCase()}
        </button>
      </div>

      {/* conteudo */}
      <div>
        {/* descrição */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Menu size={16}/>
            Descrição
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
        </div>

        {/* alinhamento estrategico */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Building2 size={16}/>
            Alinhamento Estratégico
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
        </div>

        {/* potencial inovador */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Lightbulb size={16}/>
            Potência Inovador
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
        </div>

        {/* relevancia do negocio */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <BriefcaseBusiness size={16}/>
            Relevância para o negócio
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
        </div>
      </div>

      <div className="w-full flex justify-center gap-6">
        <button className="flex w-45 justify-center px-1 py-2 
        rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
        text-[12px] cursor-pointer">
          Arquivar
        </button>
        <ForwardButton className="w-45" featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
      </div>
    </div>
  )
}

export const Rating = ({ initialScore = 0 }) => {
  const [score, setScore] = useState(initialScore);
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="mt-3 flex items-center ml-2 gap-3">
      {ratingOptions.map((num) => (
        <div className="flex flex-col justify-center items-center gap-[2px]">
          <p className="text-[10px]">{num}</p>
          <button
            type="button"
            key={num}
            value={num}
            onClick={() => setScore(num)}
            className={`h-5 w-5 rounded-full flex items-center justify-center 
            font-semibold text-sm transition-all duration-200 bg-[#D9D9D9] focus:outline-none 
            focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
          >
            <div className={`h-3 w-3 rounded-full ${
              num === score ? "bg-[#0B2B72]" : ""
            }`}>

            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export const ProgressBarActions = ({percentage}: {percentage: number}) => {
  return (
    <div className="mb-6">
      <div>
        <p className="text-green-600 font-bold text-sm">
          {percentage}% <span className="text-[#666]">Aprovado</span>
        </p>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

type CardPreScreeningContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardPreScreeningContent = ({ challangeTitle, category, description, featureId, handleApproveAndMove}: CardChallangeContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
          {category.toUpperCase()}
        </button>
      </div>

      {/* conteudo */}
      <div>
        {/* alinhamento estrategico */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Building2 size={16}/>
            Alinhamento Estratégico
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
          <Rating/>
        </div>

        {/* potencial inovador */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Lightbulb size={16}/>
            Potência Inovador
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
          <Rating/>
        </div>

        {/* relevancia do negocio */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <BriefcaseBusiness size={16}/>
            Relevância para o negócio
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {description}
          </p>
          <Rating/>
        </div>
      </div>

      <ProgressBarActions percentage={66}/>

      <div className="w-full flex justify-center gap-6">
        <button className="flex w-45 justify-center px-1 py-2 
        rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
        text-[12px] cursor-pointer">
          Voltar
        </button>
        <ForwardButton className="w-45" featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
      </div>
    </div>
  )
}

type CardDetailedScreeningContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardDetailedScreeningContent = ({ challangeTitle, category, description, featureId, handleApproveAndMove}: CardDetailedScreeningContentProps) => {
  //hook para navegar nas duas paginas da triagem detalhada
  const [page, setPage] = useState('1')

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="flex justify-between mb-6">
        <div className="">
          <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
          <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
            {category.toUpperCase()}
          </button>
        </div>

        <div className="relative flex items-center">
          <div className="flex  gap-4 items-center justify-center w-full max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <button 
                className="w-8 h-8 rounded-full bg-[#0B2B72] text-white font-semibold flex items-center justify-center"
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Contexto da Ideia</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${
                  page === '2' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1">Triagem</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* pagina 1 - resumo */}
      {page === '1' && (
        <div className="w-full flex flex-col">
          <h1 className="text-[#0B2B72] text-2xl font-semibold mb-4">Canvas Rápido</h1>

          <div className="w-full flex gap-3 mb-3">
            <div className="w-1/2 rounded-[12px] border-2 border-[#DAE0E7] px-4 py-2">
              <h1 className="w-full flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                Problema
                <Bug size={20}/>
              </h1>
              <p className="text-gray-600 text-[14px] text-justify">{description}</p>
            </div>

            <div className="w-1/2 rounded-[12px] border-2 border-[#DAE0E7] px-4 py-2">
              <h1 className="w-full flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                Solução
                <Lightbulb size={20}/>
              </h1>
              <p className="text-gray-600 text-[14px] text-justify">{description}</p>
            </div>
          </div>

          <div className="rounded-[12px] border-2 border-[#DAE0E7] px-4 py-2 mb-6">
            <h1 className="w-full flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
              Solução
              <Trophy size={20}/>
            </h1>
            <p className="text-gray-600 text-[14px] text-justify">{description}</p>
          </div>
        </div>
      )}

      {/* pagina 2 - triagem */}
      {page === '2' && (
        <div className="flex flex-col w-full">
          <form action="">
            {/* viabilidade tecnica */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg">
                <Building2 size={16}/>
                Viabilidade Técnica
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">API's/Documentação: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Stacks Compatíveis: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Nº de Sprints Esperadas: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <div className="flex gap-1 cursor-pointer">
                    <input type="radio" name="api-doc"/>
                    <label className="text-sm">Nenhum</label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <input type="radio" name="api-doc"/>
                    <label className="text-sm">API Externa</label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <input type="radio" name="api-doc"/>
                    <label className="text-sm">API Interna</label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <input type="radio" name="api-doc"/>
                    <label className="text-sm">Outro...</label>
                  </div>
                </div>
              </div>
              <Rating/>
            </div>
            {/* impacto financeiro */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                <ChartNoAxesCombined size={16}/>
                Impacto Financeiro
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">API's/Documentação: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Stacks Compatíveis: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Nº de Sprints Esperadas: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                </div>
              </div>
              <Rating/>
            </div>
            {/* aderencia estrategica */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                <ChartPie size={16}/>
                Aderência Estratégica
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">API's/Documentação: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                </div>
              </div>
              <Rating/>
            </div>
            {/* riscos */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                <TriangleAlert size={16}/>
                Riscos
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">API's/Documentação: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">API's/Documentação: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Stacks Compatíveis: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <label className="w-36 whitespace-nowrap">Nº de Sprints Esperadas: </label>
                    <input 
                      type="text" 
                      className="bg-[#d9d9d9] rounded-[4px]"
                    />
                  </div>
                </div>
              </div>
              <Rating/>
            </div>
          </form>
          <ProgressBarActions percentage={66}/>
        </div>
      )}

      <div className="w-full flex justify-center gap-6">
        <button className="flex w-45 justify-center px-1 py-2 
        rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
        text-[12px] cursor-pointer">
          Voltar
        </button>
        <ForwardButton className="w-45" featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
      </div>
    </div>
  )
}

type CardIdeationContentProps = {
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardIdeationContent = ({ featureId, handleApproveAndMove}: CardIdeationContentProps) => {
  return (
    <div>
      <p>Desaf</p>
      <ForwardButton featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
    </div>
  )
}

type CardExperimentationContentProps = {
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardExperimentationContent = ({ featureId, handleApproveAndMove}: CardExperimentationContentProps) => {
 return (
  <div>
    <p>Desa</p>
    <ForwardButton featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
  </div>
 )
}