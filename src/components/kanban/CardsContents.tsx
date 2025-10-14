import { BriefcaseBusiness, Bug, Building2, ChartNoAxesCombined, ChartPie, CircleCheck, CircleCheckBig, ClipboardList, Lamp, Lightbulb, ListCheck, Menu, Tag, Target, TriangleAlert, Trophy, Users } from "lucide-react";
import ForwardButton from "./ForwardButton"
import { useState } from 'react';
import { Comment } from "./Comment";
import { ideationCommentSections } from "./commentsData";

type CardChallangeContentProps = {
  challangeTitle: string;
  categories: string[];
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardChallangeContent = ({ challangeTitle, categories, description, featureId, handleApproveAndMove}: CardChallangeContentProps) => {
  return (
    //conteudo do card de desafio
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
              {category.toUpperCase()}
            </button>
          ))}
        </div>
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

type CardPreScreeningContentProps = {
  challangeTitle: string;
  categories: string[];
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardPreScreeningContent = ({ challangeTitle, categories, description, featureId, handleApproveAndMove}: CardPreScreeningContentProps) => {
  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
              {category.toUpperCase()}
            </button>
          ))}
        </div>
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
  categories: string[];
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardDetailedScreeningContent = ({ challangeTitle, categories, description, featureId, handleApproveAndMove}: CardDetailedScreeningContentProps) => {
  //hook para navegar nas duas paginas da triagem detalhada
  const [page, setPage] = useState('1')

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      {/* header */}
      <div className="flex justify-between mb-6">
        <div className="">
          <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="flex  gap-4 items-center justify-center w-full max-w-md mx-auto">
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
  challangeTitle: string;
  categories: string[];
  description: string;
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardIdeationContent = ({ challangeTitle, categories, description, featureId, handleApproveAndMove}: CardIdeationContentProps) => {
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
            {categories.map((category) => (
              <button className="border border-[#0B2B70] text-[12px] text-[#0B2B70] font-semibold w-fit rounded-[8px] px-3 py-1">
                {category.toUpperCase()}
              </button>
            ))}
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
          <Checklist/>
        </div>
      </div>

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

type CardExperimentationContentProps = {
  challangeTitle: string;
  categories: string[];
  description: string;
}

export const CardExperimentationContent = ({ challangeTitle, categories, description }: CardExperimentationContentProps) => {
 return (
  <div  className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
    <div className="mb-6">
      <h1 className="text-[28px] text-[#0B2B70] font-semibold mb-3">{challangeTitle}</h1>
      <div className="flex gap-2">
        {categories.map((category) => (
          <button className="bg-[#0B2B70] text-[10px] text-white font-semibold w-fit rounded-[8px] px-4 py-1">
            {category.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
    
    <div className="flex flex-col mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <Target size={16}/>
        Objetivo
      </h1>
      <p className="text-sm bg-gray-200 px-4 py-2 rounded-[8px] text-justify">
        {description}
      </p>
    </div>

    <div className="flex flex-col mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <ClipboardList size={16}/>
        Escopo Resumido
      </h1>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 text-sm">
            <label className="w-36 whitespace-nowrap">Entrega Minima: </label>
            <input 
              type="text" 
              className="bg-[#d9d9d9] rounded-[4px]"
            />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="w-36 whitespace-nowrap">Prazo: </label>
            <input 
              type="text" 
              className="bg-[#d9d9d9] rounded-[4px]"
            />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="w-36 whitespace-nowrap">Ambiente de Teste: </label>
            <input 
              type="text" 
              className="bg-[#d9d9d9] rounded-[4px]"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col mb-6">
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

    <div className="flex flex-col mb-6">
      <h1 className="flex gap-1 items-center text-black text-lg">
        <Users size={16}/>
        Responsáveis
      </h1>
      <div className="flex gap-16">
        <div className="flex flex-col gap-2">
          <p className="text-sm">Empresa:</p>
          <p className="p-2 rounded-[8px] bg-gray-200">Empresa Tal</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">Startup:</p>
          <p className="p-2 rounded-[8px] bg-gray-200">Startup Tal</p>
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

export const Checklist = () => {
  const [items, setItems] = useState([
    {id: 1, text: "Checklist teste", checked: false},
    {id: 2, text: "Checklist teste", checked: false},
    {id: 3, text: "Checklist teste", checked: false},
  ])
  const [newItem, setNewItem] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const toggleItem = (id: number) => {
    setItems(items.map((item) => 
      item.id === id ? {...item, checked: !item.checked } : item
    ))
  }

  const addItem = () => {
    if (newItem.trim() === '') return
    const newChecklistItem = {
      id: Date.now(),
      text: newItem,
      checked: false
    }
    setItems([...items, newChecklistItem])
    setNewItem('')
    setIsAdding(false)
  }

  return (
    <div className="w-full p-4">

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <label key={item.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              className="w-4 h-4 accent-gray-600 rounded"
            />
            <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}>
              {item.text}
            </span>
          </label>
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
            onClick={addItem}
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