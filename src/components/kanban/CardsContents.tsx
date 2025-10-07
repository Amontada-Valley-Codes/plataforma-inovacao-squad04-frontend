import { BriefcaseBusiness, Building2, Lightbulb, Menu } from "lucide-react";
import ForwardButton from "./ForwardButton"

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
  <div className="flex flex-col rounded-bl-2xl">
    {/* header */}
    <div className="mb-6">
      <h1 className="text-[28px] text-[#0B2B70] font-semibold">{challangeTitle}</h1>
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
        <p className="text-sm text-gray-600 font-medium">
          {description}
        </p>
      </div>

      {/* alinhamento estrategico */}
      <div className="flex flex-col mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <Building2 size={16}/>
          Alinhamento Estratégico
        </h1>
        <p className="text-sm text-gray-600 font-medium">
          {description}
        </p>
      </div>

      {/* potencial inovador */}
      <div className="flex flex-col mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <Lightbulb size={16}/>
          Potência Inovador
        </h1>
        <p className="text-sm text-gray-600 font-medium">
          {description}
        </p>
      </div>

      {/* relevancia do negocio */}
      <div className="flex flex-col mb-6">
        <h1 className="flex gap-1 items-center text-black text-lg">
          <BriefcaseBusiness size={16}/>
          Relevância para o negócio
        </h1>
        <p className="text-sm text-gray-600 font-medium">
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
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardPreScreeningContent = ({ featureId, handleApproveAndMove }: CardPreScreeningContentProps) => {
 return (
  <div>
    <p>Desafio</p>
    <ForwardButton featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
  </div>
 )
}

type CardDetailedScreeningContentProps = {
  featureId: string | undefined;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export const CardDetailedScreeningContent = ({ featureId, handleApproveAndMove}: CardDetailedScreeningContentProps) => {
 return (
  <div>
    <p>Desafi</p>
    <ForwardButton featureId={featureId} handleApproveAndMove={handleApproveAndMove}/>
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