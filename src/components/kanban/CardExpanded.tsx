'use client'

import { Modal } from "../ui/modal"
import ForwardButton from "./ForwardButton"
import PreviousButton from "./PreviousButton"
import { cn } from "@/lib/utils"
import { Loader2, MoreVertical, X } from "lucide-react"
import { CommentsPanel } from "./CommentsPanel"
import {
  challangeCommentSections,
  preScreeningCommentSections,
  detailedScreeningCommentSections,
  ideationCommentSections,
  experimentationCommentSections,
} from "./commentsData"
import React, { useEffect, useState } from "react"
import { useBreakpoints } from "@/hooks/useBreakpoints"
import { Challenge, getCategoryLabel } from "./Kanban"
import { ChallengeService } from "@/api/services/challenge.service"
import { startupService } from "@/api/services/startup.service"
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload"
import Image from "next/image"
import { ChallengeSection } from "./ChallengeSection"
import { PreScreening } from "./PreScreening"
import { DetailedScreening } from "./DetailedScreening"
import { Ideation } from "./Ideation"
import { Experimentation } from "./Experimentation"

type CardExpandedLayoutProps = {
  className?: string;
  mainContent: React.ReactNode;
  commentsContent: React.ReactNode;
  challengeId: string | undefined;
  isFirstColumn: boolean;
  isLastColumn: boolean;
  handleMoveBack: (challengeId: string | undefined) => void;
  handleApproveAndMove: (challengeId: string | undefined) => void;
}

const CardExpandedLayout = ({ className, mainContent, commentsContent, challengeId, isLastColumn, isFirstColumn, handleApproveAndMove, handleMoveBack }: CardExpandedLayoutProps) => {
  const { isDesktop } = useBreakpoints()

  return (
    <div className={cn("flex flex-col lg:flex-row flex-1 min-h-0 bg-white w-full rounded-b-2xl overflow-y-auto", className)}>
      <div className="flex flex-col w-full lg:w-[55%] bg-white rounded-b-2xl">
        <div className="flex-1 lg:overflow-y-auto px-8 py-6 scrollbar-hidden w-full">
          {mainContent}
        </div>

        {isDesktop && (
          <div className="sticky bottom-0 left-0 w-full bg-white border-t flex justify-center py-4 px-8">
            <div className={`w-full flex items-center gap-12 ${
              !isFirstColumn && !isLastColumn ?
              "justify-center"
              : isLastColumn
              ? "justify-start"
              : "justify-end"
            }`}>
              {!isFirstColumn && handleMoveBack && (
                <PreviousButton className="w-45" challengeId={challengeId} handleMoveBack={handleMoveBack} />
              )}
              {!isLastColumn && handleApproveAndMove && (
                <ForwardButton className="w-45" challengeId={challengeId} handleApproveAndMove={handleApproveAndMove} />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full lg:w-[45%] h-full bg-[#D9D9D9]">
        {commentsContent}
      </div>

      {!isDesktop && (
        <div className="sticky bottom-0 left-0 w-full bg-white border-t flex justify-center py-4 px-8">
          <div className={`w-full flex items-center gap-12 ${
            !isFirstColumn && !isLastColumn ?
            "justify-center"
            : isLastColumn
            ? "justify-start"
            : "justify-end"
          }`}>
            {!isFirstColumn && handleMoveBack && (
              <PreviousButton className="w-45 py-3" challengeId={challengeId} handleMoveBack={handleMoveBack} />
            )}
            {!isLastColumn && handleApproveAndMove && (
              <ForwardButton className="w-45 py-3" challengeId={challengeId} handleApproveAndMove={handleApproveAndMove} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

type CardExpandedProps = {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
  setChallenges: (newFeatures: Challenge[]) => void;
  setExpandedCard: (feature: Challenge | null) => void
  cardData: Challenge | null;
  columns: {
    name: string;
    id: string;
  }[];
}

type FormResolutionCardsProps = {
  setIsOpen: (isOpen: boolean) => void;
  challengeId: string | undefined;
  performMove: (challengeId: string | undefined, visibilitytToSet?: string) => void
  visibility: string | undefined;
  setVisibility: (visibility: string) => void;
}

export const FormResolutionCard = ({ visibility, setVisibility, setIsOpen, performMove, challengeId }: FormResolutionCardsProps) => {
  const [startups, setStartups] = useState<ShowAllStartupsResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStartups() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await startupService.showAllStartups()
        setStartups(response)
      } catch (error: any) {
        console.error(error)
        setError("Erro ao carregar startups.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStartups()
  }, [])

  if (error) {
    return <div className="w-full flex items-center justify-center h-full">
      {error}
    </div>
  }

  if (isLoading) {
    return <div className="w-full justify-center items-center h-full">
      <Loader2 size={24} className="animate-spin"/>
    </div>
  }

  return (
    <div className="relative flex flex-col justify-between w-full h-full">
      <div className="w-full flex flex-col">
        <h1 className="text-xl text-[#0B2B72] font-semibold mb-4">Forma de Resolução</h1>
        <div className="relative flex w-full justify-around mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVisibility("PRIVATE")}
              className={`h-5 w-5 rounded-full flex items-center justify-center 
              font-semibold text-sm transition-all duration-200 bg-[#D9D9D9] focus:outline-none 
              focus:ring-1 focus:ring-blue-400 focus:ring-offset-2`}
            >
              <div className={`h-3 w-3 rounded-full ${
              visibility === "PRIVATE" || visibility === "INTERNAL" ? "bg-[#0B2B72]" : ""
              }`}>

              </div>
            </button>
            <label className="text-sm text-[#666] font-semibold">PRIVADO</label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVisibility("PUBLIC")}
              className={`h-5 w-5 rounded-full flex items-center justify-center 
              font-semibold text-sm transition-all duration-200 bg-[#D9D9D9] focus:outline-none 
              focus:ring-1 focus:ring-blue-400 focus:ring-offset-2`}
            >
              <div className={`h-3 w-3 rounded-full ${
                visibility === "PUBLIC" ? "bg-[#0B2B72]" : ""
              }`}>

              </div>
            </button>
            <label className="text-sm text-[#666] font-semibold">PUBLICO</label>
          </div>
        </div>
        {(visibility === "PRIVATE" || visibility === "INTERNAL") && (
          <div className="border-t flex flex-col mt-4 py-4">
            <div className="flex w-full justify-around">
              <div className="flex items-center w-45 gap-2">
                <button
                  onClick={() => setVisibility("PRIVATE")}
                  className={`h-5 w-5 rounded-full flex items-center justify-center 
                  font-semibold text-sm transition-all duration-200 bg-[#D9D9D9] focus:outline-none 
                  focus:ring-1 focus:ring-blue-400 focus:ring-offset-2`}
                >
                  <div className={`h-3 w-3 rounded-full ${
                    visibility === "PRIVATE" ? "bg-[#0B2B72]" : ""
                  }`}>

                  </div>
                </button>
                <label className="text-xs text-[#666] font-semibold">Convidar startup especifica</label>
              </div>

              <div className="flex items-center w-45 gap-2">
                <button
                  onClick={() => setVisibility("INTERNAL")}
                  className={`h-5 w-5 rounded-full flex items-center justify-center 
                  font-semibold text-sm transition-all duration-200 bg-[#D9D9D9] focus:outline-none 
                  focus:ring-1 focus:ring-blue-400 focus:ring-offset-2`}
                >
                  <div className={`h-3 w-3 rounded-full ${
                    visibility === "INTERNAL" ? "bg-[#0B2B72]" : ""
                  }`}>

                  </div>
                </button>
                <label className="text-xs text-[#666] font-semibold">Resolver internamente</label>
              </div>
            </div>
            {visibility === "PRIVATE" && (
              <div className="flex flex-col w-full gap-2 overflow-y-auto scrollbar-hidden max-h-[300px]">
                <h1 className="text-base text-[#0B2B72] font-semibold mt-4">Startups</h1>
                {startups.map((startup) => (
                  <div key={startup.id} className={`flex rounded-2xl w-full justify-between bg-gray-100 flex-col`}>
                    <div className={`relative bg-gray-200 rounded-t-2xl h-30 w-full`}>
                      {startup.logo && (
                        <Image
                          src={startup.logo}
                          alt="startup-logo"
                          fill
                          objectFit="cover"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-col w-full justify-between gap-2 p-4">
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col gap-1">
                          <h1 className="text-black text-lg font-semibold">
                            {startup.name}
                          </h1>
                          <h2 className="text-[#666] text-sm">
                            {getCategoryLabel(startup.industry_segment)}
                          </h2>
                        </div>

                        <div className="flex flex-col gap-2 text-black">
                          <div className="flex items-center gap-1">
                            <MoreVertical size={20}/>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <button 
                          className="flex justify-center w-20 px-1 py-2
                          rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
                          text-[12px] cursor-pointer"
                        >
                          Convidar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )} 
      </div>

      {visibility === "PUBLIC" && (
        <div className="flex items-center justify-center p-4">
          <p className="text-center text-sm text-[#666] font-semibold">Startups podem se candidatar</p>
        </div>
      )}
      
      <div className="sticky bottom-0 left-0 w-full bg-white border-t flex gap-4 items-center justify-center py-3">
        <button
          className="flex w-30 justify-center px-1 py-2
          rounded-[8px] bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
          text-[14px] cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          Cancelar
        </button>
        <button
          className="flex justify-center w-30 px-1 py-2
          rounded-[8px] bg-[#0B2B70] hover:bg-[#09245e] transition-colors text-white font-semibold
          text-[14px] cursor-pointer"
          onClick={() => performMove(challengeId, visibility)}
        >
          Avançar
        </button>
      </div>
    </div>
  )
}

export default function CardExpanded({ isOpen, onClose, columns, cardData, challenges, setChallenges, setExpandedCard }: CardExpandedProps) {
  const [visibility, setVisibility] = useState(cardData?.visibility)
  const [isCardOpen, setIsCardOpen] = useState(false)
  
  
  if (!cardData) return null

  const currentColumnIndex = columns.findIndex(c => c.id === cardData.status)
  const isFirstColumn = currentColumnIndex === 0
  const isLastColumn = currentColumnIndex === columns.length - 1

  const performMove = async (challengeId: string | undefined, visibilityToSet?: string) => {
    const challengeToMove = challenges.find(c => c.id === challengeId);
    if (!challengeToMove) return;

    const challengeWithUpdates = { ...challengeToMove };

    try {
      if (visibilityToSet && challengeId) {
        challengeWithUpdates.visibility = visibilityToSet;
        setVisibility(visibilityToSet);

        if (challengeId) {
          await ChallengeService.changeVisibility(challengeId, { visibility: visibilityToSet })
          console.log("✅ Visibilidade alterada com sucesso");
        }
      }

      const currentColumnIndex = columns.findIndex(c => c.id === challengeWithUpdates.status);

      if (currentColumnIndex < columns.length - 1) {
        const nextColumn = columns[currentColumnIndex + 1];
        const updatedChallenge = { ...challengeWithUpdates, status: nextColumn.id };

        if (challengeId) {
          await ChallengeService.changeStatus(challengeId, { status: nextColumn.id })
          console.log("✅ Status atualizado com sucesso");
        }

        const otherChallenges = challenges.filter(c => c.id !== challengeId);
        setChallenges([updatedChallenge, ...otherChallenges]);
        setExpandedCard(updatedChallenge);
      } else {
        setExpandedCard(null);
      }

    } catch (error) {
      console.error("❌ Erro ao atualizar desafio:", error);
    } finally {
      setIsCardOpen(false);
    }
  }


  const handleApproveAndMove = (challengeId: string | undefined) => {
    const challengeToMove = challenges.find(c => c.id === challengeId);
    if (!challengeToMove) return;

    if (challengeToMove.status === "DETAILED_SCREENING") {
      setIsCardOpen(true)
      return
    }

    performMove(challengeId)
  };

  const handleMoveBack = async (challengeId: string | undefined) => {
    const challengeToMove = challenges.find(c => c.id === challengeId);
    if (!challengeToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === challengeToMove.status);

    if (currentColumnIndex > 0) {
      const prevColumn = columns[currentColumnIndex - 1];
      const updatedChallenges = { ...challengeToMove, status: prevColumn.id };

      if (challengeId) {
        await ChallengeService.changeStatus(challengeId, { status: prevColumn.id })
        console.log("✅ Status atualizado com sucesso");
      }

      const otherChallenges = challenges.filter(c => c.id !== challengeId);
      setChallenges([updatedChallenges, ...otherChallenges]);

      setExpandedCard(updatedChallenges);
    } else {
      setExpandedCard(null);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-[95vw] md:w-[80vw] h-[90vh] overflow-hidden flex flex-col">
            <CardExpandedHeader onClose={onClose} columns={columns} currentColumnId={cardData?.status}/>
            {cardData.status === "GENERATION" && (
              <CardExpandedLayout
                mainContent={
                  <ChallengeSection 
                    challangeTitle={cardData.name} 
                    category={cardData.area}
                    description={cardData.description}
                    startDate={cardData.startDate}
                    endDate={cardData.endDate}
                    creator={cardData.Users.name}
                    businessRelevance={cardData.business_relevance}
                    innovativePotential={cardData.innovative_potential}
                    strategicAlignment={cardData.strategic_alignment}
                  />
                }
                commentsContent={<CommentsPanel challengeId={cardData.id} sections={challangeCommentSections}/>}
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {cardData.status === "PRE_SCREENING" && (
              <CardExpandedLayout mainContent={
                  <PreScreening
                    challangeTitle={cardData.name} 
                    challengeId={cardData.id}
                    category={cardData.area}
                    startDate={cardData.startDate}
                    endDate={cardData.endDate}
                    creator={cardData.Users.name}
                    businessRelevance={cardData.business_relevance}
                    innovativePotential={cardData.innovative_potential}
                    strategicAlignment={cardData.strategic_alignment}
                  />
                }
                commentsContent={<CommentsPanel challengeId={cardData.id} sections={preScreeningCommentSections}/>}
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {cardData.status === "DETAILED_SCREENING" && (
              <CardExpandedLayout
                mainContent={
                  <DetailedScreening
                    challangeTitle={cardData.name}
                    challengeId={cardData.id}
                    category={cardData.area}
                    startDate={cardData.startDate}
                    endDate={cardData.endDate}
                    creator={cardData.Users.name}
                    visibility={cardData.visibility}
                  />
                }
                commentsContent={
                  <CommentsPanel challengeId={cardData.id} sections={detailedScreeningCommentSections}/>
                }
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {cardData.status === "IDEATION" && (
              <CardExpandedLayout
                mainContent={
                  <Ideation
                    challengeTitle={cardData.name}
                    challengeId={cardData.id}
                    category={cardData.area}
                    creator={cardData.Users.name}
                    visibility={cardData.visibility}
                    endDate={cardData.endDate}
                    startDate={cardData.startDate}
                  />
                }
                commentsContent={<CommentsPanel challengeId={cardData.id} sections={ideationCommentSections}/>}
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {cardData.status === "EXPERIMENTATION" && (
              <CardExpandedLayout
                mainContent={
                  <Experimentation
                    challangeTitle={cardData.name}
                    challengeId={cardData.id}
                    category={cardData.area}
                    description={cardData.description}
                    startDate={cardData.startDate}
                    endDate={cardData.endDate}
                    creator={cardData.Users.name}
                    visibility={cardData.visibility}
                  />
                }
                commentsContent={<CommentsPanel challengeId={cardData.id} sections={experimentationCommentSections}/>}
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />  
            )}
          </div>
          <Modal
            isOpen={isCardOpen}
            onClose={() => setIsCardOpen(false)}
          >
            <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-100">
              <div className="bg-white px-4 pt-4 rounded-2xl w-[90vw] md:w-[40vw] overflow-hidden flex flex-col">
                <FormResolutionCard
                  setIsOpen={setIsCardOpen}
                  performMove={performMove}
                  challengeId={cardData.id}
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              </div>
            </div>
          </Modal>
        </div>
      </Modal>
    </div>
  )
}

type CardExpandedHeaderProps = {
  onClose: () => void;
  columns: {
    name: string;
    id: string;
  }[]
  currentColumnId: string | undefined;
}

const CardExpandedHeader = ({ onClose, columns, currentColumnId, }: CardExpandedHeaderProps) => {
  const { isMobile } = useBreakpoints()

  return (
    <div className="relative w-full flex justify-start md:justify-center items-center px-8 md:px-16 border-b-2 border-[#A9A9A9]">
      {!isMobile && (
        <div className="flex justify-center items-center h-full gap-5">
          {columns.map((column) => (
            <div key={column.id} className={`flex justify-center p-2 lg:p-3 items-center h-full text-sm lg:text-base font-semibold 
            ${column.id === currentColumnId ? "bg-[#D9D9D9] text-[#848484]" : "text-[#666]"}`}>
              {column.name}
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <div className="flex justify-center items-center h-full gap-5">
          {columns.map((column) => {
            if (column.id === currentColumnId) return (
              <div key={column.id} className="flex justify-center py-3 items-center h-full text-lg text-[#666] font-semibold ">
                {column.name}
              </div>
            )
          })}
        </div>
      )}
      
      <X 
        size={20} 
        className="absolute right-8 text-[#666] cursor-pointer"
        onClick={onClose}
      />
    </div>
  )
}