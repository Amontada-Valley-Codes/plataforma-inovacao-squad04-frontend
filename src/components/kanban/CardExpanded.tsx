/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Modal } from "../ui/modal"
import ForwardButton from "./ForwardButton"
import PreviousButton from "./PreviousButton"
import { cn } from "@/lib/utils"
import { Loader2, X } from "lucide-react"
import { CommentsPanel } from "./CommentsPanel"
import React, { useEffect, useState } from "react"
import { useBreakpoints } from "@/hooks/useBreakpoints"
import { Challenge } from "./Kanban"
import { ChallengeService } from "@/api/services/challenge.service"
import { startupService } from "@/api/services/startup.service"
import { ShowAllStartupsResponse } from "@/api/payloads/startup.payload"
import { toast } from "sonner"
import { ChallengeSection } from "./ChallengeSection"
import { PreScreening } from "./PreScreening"
import { DetailedScreening } from "./DetailedScreening"
import Materialization from "./Materialization"
import { Experimentation } from "./Experimentation"
import ApproveButton from "./ApproveButton"
import DisapproveButton from "./Disapprove"
import { ActivityHistoryPanel } from "./ActivityHistoryPanel"
import RolloutPlan from "./rolloutPlan"

type CardExpandedLayoutProps = {
  className?: string;
  mainContent: React.ReactNode;
  commentsContent: (onChangeView: (view: View) => void) => React.ReactNode;
  activyHistory: (onChangeView: (view: View) => void) => React.ReactNode;
  challengeId: string | undefined;
  challengeStatus?: string;
  isFirstColumn: boolean;
  isLastColumn: boolean;
  handleMoveBack: (challengeId: string | undefined) => void;
  handleApproveAndMove: (challengeId: string | undefined) => void;
}

type View = "historico" | "comentarios"

const CardExpandedLayout = ({ className, mainContent, commentsContent, challengeId, challengeStatus, isLastColumn, isFirstColumn, handleApproveAndMove, handleMoveBack, activyHistory }: CardExpandedLayoutProps) => {
  const { isDesktop } = useBreakpoints()

  const [view, setView] = useState<View>("comentarios");

  return (
    <div className={cn("flex flex-col lg:flex-row flex-1 min-h-0 bg-white w-full rounded-b-2xl overflow-y-auto", className)}>
      <div className="flex flex-col w-full lg:w-[55%] bg-white dark:bg-gray-900 rounded-b-2xl">
        <div className="flex-1 lg:overflow-y-auto px-8 py-6 w-full">
          {mainContent}
        </div>

        {isDesktop && (
          <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 dark:border-t-0 border-t flex justify-center py-4 px-8">
            <div className={`w-full flex items-center gap-12 ${
              !isFirstColumn && !isLastColumn ?
              "justify-between"
              : challengeStatus
              ? "justify-between"
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
              {challengeStatus && challengeId && isLastColumn && (
                <div className="flex items-center gap-4 justify-center">
                  <ApproveButton challengeId={challengeId}/>
                  <DisapproveButton challengeId={challengeId}/>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full lg:w-[45%] h-full bg-[#D9D9D9] dark:bg-gray-900">
        {view === "comentarios" && commentsContent(setView)}
        {view === "historico" && activyHistory(setView)}
      </div>

      {!isDesktop && (
        <div className="sticky bottom-0 left-0 w-full bg-white border-t flex justify-center py-4 px-8">
          <div className={`w-full flex items-center gap-12 ${
            !isFirstColumn && !isLastColumn ?
            "justify-between"
            : challengeStatus
            ? "justify-between"
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
            {challengeStatus && challengeId && isLastColumn && (
              <div className="flex items-center gap-4 justify-center">
                <ApproveButton challengeId={challengeId}/>
                <DisapproveButton challengeId={challengeId}/>
              </div>
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
  onStatusChange?: () => void;
}

type FormResolutionCardsProps = {
  setIsOpen: (isOpen: boolean) => void;
  challengeId: string | undefined;
  performMove: (challengeId: string | undefined, visibilitytToSet?: string) => void
  visibility: string | undefined;
  setVisibility: (visibility: string) => void;
}

export const FormResolutionCard = ({ visibility, setVisibility, setIsOpen, performMove, challengeId }: FormResolutionCardsProps) => {
  return (
    <div className="relative flex flex-col dark:bg-gray-800 justify-between w-full h-full">
      <div className="w-full flex flex-col dark:bg-gray-800">
        <h1 className="text-xl text-[#0B2B72] dark:text-white font-semibold mb-4">Forma de Resolução</h1>
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
            <label className="text-sm text-[#666] dark:text-white font-semibold">PRIVADO</label>
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
            <label className="text-sm text-[#666] dark:text-white font-semibold">PUBLICO</label>
          </div>
        </div>
      </div>
      
      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t flex gap-4 items-center justify-center py-3">
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

export default function CardExpanded({ isOpen, onClose, columns, cardData, challenges, setChallenges, setExpandedCard, onStatusChange }: CardExpandedProps) {
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

        await ChallengeService.changeVisibility(challengeId, { visibility: visibilityToSet });
      }

      const currentColumnIndex = columns.findIndex(c => c.id === challengeWithUpdates.status);

      if (currentColumnIndex < columns.length - 1) {
        const nextColumn = columns[currentColumnIndex + 1];
        
        await ChallengeService.changeStatus(challengeId!, { status: nextColumn.id })
        // await ChallengeService.advanceStage(challengeId!, { status: nextColumn.id });

        const updatedChallenge = { ...challengeWithUpdates, status: nextColumn.id };
        const otherChallenges = challenges.filter(c => c.id !== challengeId);

        setChallenges([updatedChallenge, ...otherChallenges]);
        setExpandedCard(updatedChallenge);

        toast.success("Desafio avançado com sucesso.");

      } else {
        setExpandedCard(null);
      }

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Não foi possível avançar o desafio.")
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

      try {
        await ChallengeService.changeStatus(challengeId!, { status: prevColumn.id })
        // await ChallengeService.returnStep(challengeId!, { status: prevColumn.id });

        const updatedChallenge = { ...challengeToMove, status: prevColumn.id };
        const otherChallenges = challenges.filter(c => c.id !== challengeId);

        setChallenges([updatedChallenge, ...otherChallenges]);
        setExpandedCard(updatedChallenge);

        toast.success("Desafio retornado com sucesso.");

      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Não foi possível retornar o desafio.");
      }
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-[95vw] md:w-[80vw] h-[90vh] overflow-hidden flex flex-col">
            <CardExpandedHeader onClose={onClose} columns={columns} currentColumnId={cardData?.status}/>
            {cardData.status === "GENERATION" && (
              <CardExpandedLayout
                mainContent={
                  <ChallengeSection
                    challangeTitle={cardData.name}
                    ideaIdentifier={cardData.ideaIdentifier}   
                    category={cardData.involvedAreas[0]}
                    description={cardData.problemDescription}
                    startDate={cardData.createdAt}
                    endDate={cardData.endDate}                 
                    visibility={cardData.visibility}           
                    creator={cardData.Users.name}
                    businessRelevance={cardData.business_relevance}
                    innovativePotential={cardData.innovative_potential}
                    strategicAlignment={cardData.strategic_alignment}
                    problemDuration={cardData.problemDuration} 
                    currentSolution={cardData.currentSolution} 
                    problemRelevance={cardData.problemRelevance}
                    currentIndicators={cardData.currentIndicators}
                    expectedImpacts={cardData.expectedImpacts}
                    initialConstraints={cardData.initialConstraints}
                    involvedAreas={cardData.involvedAreas}
                    proponentParticipation={cardData.proponentParticipation}
                    challengeId={cardData.id}
                  />
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
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
                    category={cardData.involvedAreas[0]}
                    startDate={cardData.createdAt}
                    creator={cardData.Users.name}
                    businessRelevance={cardData.business_relevance}
                    innovativePotential={cardData.innovative_potential}
                    strategicAlignment={cardData.strategic_alignment}
                  onStatusChange={onStatusChange}/>
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
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
                    category={cardData.involvedAreas[0]}
                    startDate={cardData.createdAt}
                    creator={cardData.Users.name}
                    visibility={cardData.visibility}
                  />
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                challengeId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {cardData.status === "MATERIALIZATION" && (
              <CardExpandedLayout
                mainContent={
                  <Materialization
                    challengeId={cardData.id}
                    challengeTitle={cardData.name}
                    creator={cardData.Users.name}
                    startDate={cardData.createdAt}
                    visibility={cardData.visibility}
                  />
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                challengeId={cardData.id}
                handleApproveAndMove={handleApproveAndMove}
                handleMoveBack={handleMoveBack}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
              />
            )}
            {cardData.status === "EXPERIMENTATION" && (
              <CardExpandedLayout
                mainContent={
                  <Experimentation
                    challangeTitle={cardData.name}
                    challengeId={cardData.id}
                    category={cardData.involvedAreas[0]}
                    description={cardData.problemDescription}
                    startDate={cardData.createdAt}
                    creator={cardData.Users.name}
                    visibility={cardData.visibility}
                  />
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                challengeId={cardData.id}
                challengeStatus={cardData.status}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />  
            )}
            {cardData.status === "SCALE" && (
              <CardExpandedLayout
                mainContent={
                  <RolloutPlan 
                    challengeId={cardData.id}
                    challengeTitle={cardData.name}
                    creator={cardData.Users.name}
                    startDate={cardData.createdAt}
                    visibility={cardData.visibility}
                    category={cardData.involvedAreas[0]}
                  />
                }
                commentsContent={(onChangeView) => (
                  <CommentsPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                activyHistory={(onChangeView) => (
                  <ActivityHistoryPanel
                    challengeId={cardData.id}
                    context={cardData.status}
                    onChangeView={onChangeView}
                  />
                )}
                challengeId={cardData.id}
                challengeStatus={cardData.status}
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
              <div className="bg-white dark:bg-gray-800 px-4 pt-4 rounded-2xl w-[90vw] md:w-[40vw] overflow-hidden flex flex-col">
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
    <div className="relative w-full flex justify-start md:justify-center items-center px-8 md:px-16 border-b-2 border-[#A9A9A9] dark:border-gray-800">
      {!isMobile && (
        <div className="flex justify-center items-center h-full gap-5">
          {columns.map((column) => (
            <div key={column.id} className={`flex justify-center p-2 lg:p-3 items-center h-full text-sm lg:text-base font-semibold 
            ${column.id === currentColumnId ? "bg-[#D9D9D9] dark:text-white dark:bg-gray-800 text-[#848484]" : "text-[#666]"}`}>
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
