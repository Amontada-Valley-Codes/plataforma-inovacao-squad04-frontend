import { BriefcaseBusiness, Bug, Building2, Calendar, ChartNoAxesCombined, ChartPie, CircleCheck, CircleUserRound, ClipboardList, Lightbulb, ListCheck, Menu, Tag, Target, TriangleAlert, Trophy, Users } from "lucide-react";
import { useState } from 'react';
import { Comment } from "./Comment";
import { ideationCommentSections } from "./commentsData";
import { dateFormatter, getCategoryLabel, shortDateFormatter } from "./Kanban";
import { ShowAllChallengeResponse } from "@/api/payloads/challenge.payload";
import { ShowAllChecklistsResponse } from "@/api/payloads/checklist.payload";
import { checklistService } from "@/api/services/checklist.service";

type CardContentsHeaderProps = {
  challengeTitle: string;
  category: string;
  creator: string;
  startDate: string;
  endDate: string;
  visibility?: string;
}

export const getVisibilityLabel = (visibility: string) => {
  switch (visibility) {
    case "PUBLIC":
      return "PÚBLICO"
    case "PRIVATE":
    default:
      return "PRIVADO"
    case "INTERNAL":
      return "PRIVADO"
  }
}

export const CardContentsHeader = ({ challengeTitle, category, creator, startDate, endDate, visibility }: CardContentsHeaderProps) => {

  return (
    <div className="mb-4">
      <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-1">{challengeTitle}</h1>
      <div className="flex gap-2 mb-2">
        <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
          {getCategoryLabel(category)}
        </button>

        {visibility && (
          <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
            {getVisibilityLabel(visibility)}
          </button>
        )}
      </div>

      <div className="flex gap-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={16}/>
          <p>
            {shortDateFormatter.format(new Date(startDate))} -{" "}
            {dateFormatter.format(new Date(endDate))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CircleUserRound size={20}/>
          <p>{creator}</p>
        </div>
      </div>
    </div>
  )
}

type CardChallangeContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  strategicAlignment: string;
  innovativePotential: string;
  businessRelevance: string;
  startDate: string;
  endDate: string;
  creator: string;
}

export const CardChallangeContent = ({ challangeTitle, category, description, strategicAlignment, innovativePotential, businessRelevance, startDate, endDate, creator }: CardChallangeContentProps) => {
  return (
    //conteudo do card de desafio
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        endDate={endDate}
        creator={creator}
      />

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
            {strategicAlignment}
          </p>
        </div>

        {/* potencial inovador */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Lightbulb size={16}/>
            Potência Inovador
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {innovativePotential}
          </p>
        </div>

        {/* relevancia do negocio */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <BriefcaseBusiness size={16}/>
            Relevância para o negócio
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {businessRelevance}
          </p>
        </div>
      </div>
    </div>
  )
}

type CardPreScreeningContentProps = {
  challangeTitle: string;
  category: string;
  strategicAlignment: string;
  innovativePotential: string;
  businessRelevance: string;
  startDate: string;
  endDate: string;
  creator: string;
}

export const CardPreScreeningContent = ({ challangeTitle, category, startDate, endDate, creator, businessRelevance, innovativePotential, strategicAlignment }: CardPreScreeningContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <CardContentsHeader
        challengeTitle={challangeTitle}
        category={category}
        startDate={startDate}
        endDate={endDate}
        creator={creator}
      />

      {/* conteudo */}
      <div>
        {/* alinhamento estrategico */}
        <div className="flex flex-col mb-6">
          <h1 className="flex gap-1 items-center text-black text-lg">
            <Building2 size={16}/>
            Alinhamento Estratégico
          </h1>
          <p className="text-sm text-gray-600 font-medium text-justify">
            {strategicAlignment}
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
            {innovativePotential}
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
            {businessRelevance}
          </p>
          <Rating/>
        </div>
      </div>

      <ProgressBarActions percentage={66}/>
    </div>
  )
}

type CardDetailedScreeningContentProps = {
  challangeTitle: string;
  category: string;
  startDate: string;
  endDate: string;
  creator: string;
  visibility: string;
}

export const CardDetailedScreeningContent = ({ challangeTitle, category, startDate, endDate, creator, visibility }: CardDetailedScreeningContentProps) => {
  //hook para navegar nas duas paginas da triagem detalhada
  const [page, setPage] = useState('1')

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challangeTitle}
          category={category}
          startDate={startDate}
          endDate={endDate}
          creator={creator}
          visibility={visibility}
        />

        <div className="relative flex items-center">
          <div className="flex gap-4 items-center xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
                  page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                }`}
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
        <div className="w-full flex flex-col h-full">
          <h1 className="text-[#0B2B72] text-2xl font-semibold mb-4">Canvas Rápido</h1>

          <div className="flex-1 flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="w-full md:w-1/2 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
                <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                  Problema
                  <Bug size={20}/>
                </h1>
                
                <textarea
                  className="w-full flex-1 bg-transparent outline-none resize-none overflow-y-auto"
                  placeholder="Qual o resultado esperado?"
                  rows={6}
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
                <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                  Solução
                  <Lightbulb size={20}/>
                </h1>

                <textarea
                  className="w-full flex-1 bg-transparent outline-none resize-none h-full overflow-y-auto"
                  placeholder="Qual o resultado esperado?"
                  rows={6}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col rounded-[12px] border-2 border-[#E5E7EB] px-4 py-2">
              <h1 className="flex items-center justify-between text-[#0B2B72] text-lg font-semibold mb-2">
                Resultado Esperado
                <Trophy size={20}/>
              </h1>

              <textarea
                className="w-full flex-1 bg-transparent outline-none resize-none h-full overflow-y-auto"
                placeholder="Qual o resultado esperado?"
                rows={6}
              />
            </div>
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
                Viabilidade Técnica
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  
                  {/* Input: API's/Documentação */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="APIs / documentação"
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>

                  {/* Input: Stacks Compatíveis */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="Stacks Compatíveis"
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>

                  {/* Input: Nº de Sprints Esperadas */}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                      <Building2 className="text-[#98A2B3] mr-2" size={18} />
                      <input 
                        type="text" 
                        placeholder="Nº de sprints esperadas"
                        className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                      />
                    </div>
                  </div>
                </div>

                {/* Seção de Rádios */}
                <div className="flex flex-col gap-[2px] mt-2">
                  <div className="flex gap-1 cursor-pointer">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="api-doc" className="hidden peer" />
                      <span className="w-3 h-3 rounded-full border border-[#0B2B70] peer-checked:bg-[#0B2B70]"></span>
                      <span className="text-sm">Nenhuma </span>
                    </label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="api-doc" className="hidden peer" />
                      <span className="w-3 h-3 rounded-full border border-[#0B2B70] peer-checked:bg-[#0B2B70]"></span>
                      <span className="text-sm">API Externa</span>
                    </label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="api-doc" className="hidden peer" />
                      <span className="w-3 h-3 rounded-full border border-[#0B2B70] peer-checked:bg-[#0B2B70]"></span>
                      <span className="text-sm">API Interna</span>
                    </label>
                  </div>
                  <div className="flex gap-1 cursor-pointer">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="api-doc" className="hidden peer" />
                      <span className="w-3 h-3 rounded-full border border-[#0B2B70] peer-checked:bg-[#0B2B70]"></span>
                      <span className="text-sm">Outro...</span>
                    </label>
                  </div>
                </div>
              </div>
              <Rating/>
            </div>

            {/* impacto financeiro */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center   text-black text-lg mb-2">
                Impacto Financeiro
              </h1>
              <div className="flex flex-col gap-2">

                {/* Input: API's/Documentação */}
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Investimento inicial estimado (CAPEX)"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* Input: Stacks Compatíveis */}
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Custo mensal estimado (OPEX)"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* Input: Nº de Sprints Esperadas */}
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartNoAxesCombined className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Benefício esperado (mensal)"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>
              <Rating/>
            </div>

            {/* aderencia estrategica */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                Aderência Estratégica
              </h1>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <ChartPie className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Pilar Estratégico"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>
              <Rating/>
            </div>

            {/* riscos */}
            <div className="flex flex-col mb-6">
              <h1 className="flex gap-1 items-center text-black text-lg mb-2">
                Riscos
              </h1>
              <div className="flex flex-col gap-2">
                
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Principal risco identificado"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Mitigação Proposta"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Responsável"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* Input: Nº de Sprints Esperadas */}
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex-1 flex items-center rounded-lg border px-3 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
                    <TriangleAlert className="text-[#98A2B3] mr-2" size={18} />
                    <input 
                      type="text" 
                      placeholder="Prazo"
                      className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
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
    </div>
  )
}

type CardIdeationContentProps = {
  challangeTitle: string;
  challengeId: string;
  category: string;
  description: string;
}

export const CardIdeationContent = ({ challangeTitle, category }: CardIdeationContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <div className="flex gap-4">
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
          + Tag
          </button>
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
            + Sugestões
          </button>
          <button className="bg-white border-2 border-[#A9A9A9] text-[12px] text-[#666] font-semibold w-fit rounded-[4px] px-3 py-1">
            + Checklist
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4 gap-4">
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#D9D9D9] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <Tag fill="#666" size={16}/>
            <p className="text-[#666]">TAGS</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-[#0B2B70] text-[12px] text-[#0B2B70] font-semibold w-fit rounded-[8px] px-3 py-1">
              {category.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#D9D9D9] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <CircleCheck fill="#666" size={16}/>
            <p className="text-[#666]">SUGESTÕES</p>
          </div>
          <div>
            {ideationCommentSections
            .find((section) => section.id === "sugestoes")
            ?.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center w-full bg-[#D9D9D9] text-[#666] font-semibold text-sm rounded-[12px] px-4 py-1 gap-2">
            <ListCheck strokeWidth={3} size={16}/>
            <p className="text-[#666]">CHECKLIST</p>
          </div>
          <Checklist challengeId={challengeId}/>
        </div>
      </div>
    </div>
  )
}

type CardExperimentationContentProps = {
  challangeTitle: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  creator: string;
  visibility: string;
}

export const CardExperimentationContent = ({ challangeTitle, category, startDate, endDate, creator, visibility }: CardExperimentationContentProps) => {
 return (
  <div  className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
    <CardContentsHeader
      challengeTitle={challangeTitle}
      category={category}
      startDate={startDate}
      endDate={endDate}
      creator={creator}
      visibility={visibility}
    />
    
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <Target size={16}/>
        Objetivo
      </h1>
      <div className="flex items-center rounded-lg border p-2 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
        <textarea 
          className="w-full bg-transparent outline-none resize-none overflow-y-auto"
          placeholder="Qual o objetivo?"
          rows={5}
        />
      </div>
    </div>

    <div className="flex flex-col gap-1 mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <ClipboardList size={16}/>
        Escopo Resumido
      </h1>
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Entrega Minima"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Prazo"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
        <div className="flex gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Ambiente de Teste"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-1 mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <ChartNoAxesCombined size={16}/>
        KPIs de Sucesso
      </h1>
      <div className="flex flex-col text-sm">
        <div className="flex w-3/4 justify-between">
          <p>Taxa de Conclusão</p>
          <p>90% dos Usuários</p>
        </div>
        <div className="flex w-3/4 justify-between">
          <p>Tempo Médio de Entrega</p>
          <p>≤ 2 Dias</p>
        </div>
        <div className="flex w-3/4 justify-between">
          <p>Satisfação do usuário</p>
          <p>≥ 4,5 de 5</p>
        </div>
      </div>
    </div>

    <div className="flex w-full flex-col gap-1 mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <Users size={16}/>
        Responsáveis
      </h1>
      <div className="flex w-full gap-16">
        <div className="flex w-full gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Empresa"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>

        <div className="flex w-full gap-4 text-sm items-center">
          <div className="flex-1 flex items-center rounded-lg border p-2 h-10 transition-colors bg-[#F9FAFB] border-[#E5E7EB] dark:border-gray-800 dark:bg-gray-900">
            <input 
              type="text" 
              placeholder="Startup"
              className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] placeholder:text-[#98A2B3]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
 )
}

export const Rating = ({ initialScore = 0 }) => {
  const [score, setScore] = useState(initialScore);
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="mt-3 flex items-center gap-3">
      {ratingOptions.map((num, i) => (
        <div key={i} className="flex flex-col justify-center items-center gap-[2px]">
          <p className="text-[10px]">{num}</p>
          <button
            type="button"
            key={num}
            value={num}
            onClick={() => setScore(num)}
            className={`h-5 w-5 rounded-full flex items-center justify-center 
            font-semibold text-sm transition-all duration-200 bg-[#F9FAFB] border border-[#E5E7EB] focus:outline-none 
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

type ChecklistProps = {
  challengeId: string;
}

export const Checklist = ({ challengeId }: ChecklistProps) => {
  const [items, setItems] = useState<ShowAllChecklistsResponse[]>([])
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    async function fetchChecklists() {
      const response = await checklistService.showAllChecklists(challengeId)
      setItems(response)
    }

    fetchChecklists()
  }, [challengeId])

  const toggleItem = async (checklistId: string) => {
    try {
      const updatedChecklist = await checklistService.updateStatusChecklist(checklistId)

      setItems((prev) => 
        prev.map((item) =>
          item.id === checklistId ? {...item, completed: updatedChecklist.completed} : item
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const addItem = async (challengeId: string, checklistText: string) => {
    try {
      const newChecklist = await checklistService.createChecklist(challengeId, { text: checklistText })
      setItems((prev) => [...prev, newChecklist])
      setNewItem('') 
    } catch (error) {
      console.error(error)
    }
  }

  const updateItem = async (checklistId: string, newChecklistText: string) => {
    try {
      const updatedChecklist = await checklistService.updateChecklist(checklistId, { text: newChecklistText })

      setItems((prev) => 
        prev.map((item) =>
          item.id === checklistId ? {...item, text: updatedChecklist.text} : item
        )
      )
      setEditingText('')
    } catch (error) {
      console.error(error)
    }
  }

  const deleteItem = async (checklistId: string) => {
    try {
      await checklistService.deleteChecklist(checklistId)

      setItems((prev) => prev.filter((item) => item.id !== checklistId))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full p-4">

      <div className="flex flex-col gap-2 w-full">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="w-4 h-4 accent-gray-600 rounded"
            />
            <div className="flex items-center w-[60%] justify-between">
              {editingId === item.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => {
                    if (editingText.trim()) updateItem(item.id, editingText)
                    setEditingId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateItem(item.id, editingText)
                      setEditingId(null)
                    }
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditingText('')
                    }
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                  autoFocus
                />
              ) : (
                <span className={item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}>
                  {item.text}
                </span>
              )}

              <div className="relative flex h-5 items-end gap-2">
                <SquarePen 
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(item.id)
                    setEditingText(item.text)
                  }}
                  size={16}
                  className="text-[#0B2B72] 
                  hover:text-[#0b245a] transition-all duration-300 ease-in-out"
                />
                <Trash2
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(item.id)
                  }} 
                  size={16}
                  className="text-red-600 hover:text-red-800 transition-all 
                  duration-300 ease-in-out"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Novo item..."
            className="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B72]"
          />
          <button
            onClick={() => {
              addItem(challengeId, newItem)
              setIsAdding(false)
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-[8px] text-[#666] bg-[#E2E2E2] hover:bg-gray-300 transition"
          >
            Adicionar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-[#666] bg-[#E2E2E2] hover:bg-gray-300 rounded-[8px] transition mt-4"
        >
          Adicionar
        </button>
      )}
    </div>
  )
}