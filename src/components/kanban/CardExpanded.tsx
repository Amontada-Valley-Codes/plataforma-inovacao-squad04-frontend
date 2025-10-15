'use client'

import { Modal } from "../ui/modal"
import ForwardButton from "./ForwardButton"
import PreviousButton from "./PreviousButton"
import { cn } from "@/lib/utils"
import { Feature } from "./Kanban"
import { X } from "lucide-react"
import {
  CardChallangeContent,
  CardDetailedScreeningContent,
  CardExperimentationContent,
  CardIdeationContent,
  CardPreScreeningContent
} from "./CardsContents"
import { CommentsPanel } from "./CommentsPanel"
import {
  challangeCommentSections,
  preScreeningCommentSections,
  detailedScreeningCommentSections,
  ideationCommentSections,
  experimentationCommentSections,
} from "./commentsData"
import React, { useEffect } from "react"
import { Card } from "../ui/card"

type CardExpandedLayoutProps = {
  className?: string;
  mainContent: React.ReactNode;
  commentsContent: React.ReactNode;
  featureId: string | undefined;
  isFirstColumn: boolean;
  isLastColumn: boolean;
  handleMoveBack: (featureId: string | undefined) => void;
  handleApproveAndMove: (featureId: string | undefined) => void;
}

const CardExpandedLayout = ({ className, mainContent, commentsContent, featureId, isLastColumn, isFirstColumn, handleApproveAndMove, handleMoveBack }: CardExpandedLayoutProps) => {
  return (
    <div className={cn("flex flex-1 min-h-0 bg-white w-full rounded-b-2xl", className)}>
      <div className="flex flex-col w-[55%] h-full bg-white rounded-b-2xl">
        <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-hidden">
          {mainContent}
        </div>

        <div className="sticky bottom-0 left-0 w-full bg-white border-t flex justify-center py-4 px-8">
          <div className={`w-full flex items-center gap-12 ${
            !isFirstColumn && !isLastColumn ?
            "justify-center"
            : isLastColumn
            ? "justify-start"
            : "justify-end"
          }`}>
            {!isFirstColumn && handleMoveBack && (
              <PreviousButton className="w-45" featureId={featureId} handleMoveBack={handleMoveBack} />
            )}
            {!isLastColumn && handleApproveAndMove && (
              <ForwardButton className="w-45" featureId={featureId} handleApproveAndMove={handleApproveAndMove} />
            )}
          </div>
        </div>
      </div>

      <div className="flex w-[45%] h-full bg-[#D9D9D9]">
        {commentsContent}
      </div>
    </div>
  )
}

type CardExpandedProps = {
  isOpen: boolean;
  onClose: () => void;
  features: Feature[];
  setFeatures: (newFeatures: Feature[]) => void;
  setExpandedCard: (feature: Feature | null) => void
  cardData: Feature | null;
  columns: {
    name: string;
    id: string;
  }[];
}

export default function CardExpanded({ isOpen, onClose, columns, cardData, features, setFeatures, setExpandedCard }: CardExpandedProps) {
  if (!cardData) return null

  var currentColumnName = columns.find(c => c.id === cardData.column)?.name
  const currentColumnIndex = columns.findIndex(c => c.id === cardData.column)
  const isFirstColumn = currentColumnIndex === 0
  const isLastColumn = currentColumnIndex === columns.length - 1

  useEffect(() => {
    currentColumnName = columns.find(c => c.id === cardData.column)?.name
  }, [currentColumnName])

  const handleApproveAndMove = (featureId: string | undefined) => {
    const featureToMove = features.find(f => f.id === featureId);
    if (!featureToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === featureToMove.column);

    if (currentColumnIndex < columns.length - 1) {
      const nextColumn = columns[currentColumnIndex + 1];
      const updatedFeature = { ...featureToMove, column: nextColumn.id };
      const otherFeatures = features.filter(f => f.id !== featureId);
      setFeatures([updatedFeature, ...otherFeatures]);

      setExpandedCard(updatedFeature);
    } else {
      setExpandedCard(null);
    }
  };

  const handleMoveBack = (featureId: string | undefined) => {
    const featureToMove = features.find(f => f.id === featureId);
    if (!featureToMove) return;

    const currentColumnIndex = columns.findIndex(c => c.id === featureToMove.column);

    if (currentColumnIndex > 0) {
      const prevColumn = columns[currentColumnIndex - 1];
      const updatedFeature = { ...featureToMove, column: prevColumn.id };
      const otherFeatures = features.filter(f => f.id !== featureId);
      setFeatures([updatedFeature, ...otherFeatures]);

      setExpandedCard(updatedFeature);
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
          <div className="bg-white rounded-2xl w-[90vw] md:w-[80vw] h-[90vh] overflow-hidden flex flex-col">
            <CardExpandedHeader onClose={onClose} columns={columns} currentColumnId={cardData?.column}/>
            {currentColumnName === "Desafios" && (
              <CardExpandedLayout
                mainContent={
                  <CardChallangeContent 
                    challangeTitle={cardData.name} 
                    categories={cardData.categories}
                    description={cardData.description}
                  />
                }
                commentsContent={<CommentsPanel sections={challangeCommentSections}/>}
                featureId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {currentColumnName === "Pré-Triagem" && (
              <CardExpandedLayout mainContent={
                  <CardPreScreeningContent 
                    challangeTitle={cardData.name} 
                    categories={cardData.categories}
                    description={cardData.description}
                  />
                }
                commentsContent={<CommentsPanel sections={preScreeningCommentSections}/>}
                featureId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {currentColumnName === "Triagem Detalhada" && (
              <CardExpandedLayout
                mainContent={
                  <CardDetailedScreeningContent
                    challangeTitle={cardData.name}
                    categories={cardData.categories}
                    description={cardData.description}
                  />
                }
                commentsContent={
                  <CommentsPanel sections={detailedScreeningCommentSections}/>
                }
                featureId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {currentColumnName === "Ideação" && (
              <CardExpandedLayout
                mainContent={
                  <CardIdeationContent
                    challangeTitle={cardData.name}
                    categories={cardData.categories}
                    description={cardData.description}
                  />
                }
                commentsContent={<CommentsPanel sections={ideationCommentSections}/>}
                featureId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />
            )}
            {currentColumnName === "Experimentação" && (
              <CardExpandedLayout
                mainContent={
                  <CardExperimentationContent
                    challangeTitle={cardData.name}
                    categories={cardData.categories}
                    description={cardData.description}
                  />
                }
                commentsContent={<CommentsPanel sections={experimentationCommentSections}/>}
                featureId={cardData.id}
                isFirstColumn={isFirstColumn}
                isLastColumn={isLastColumn}
                handleMoveBack={handleMoveBack}
                handleApproveAndMove={handleApproveAndMove}
              />  
            )}
          </div>
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
  return (
    <div className="relative w-full flex justify-center items-center px-16 border-b-2 border-[#A9A9A9]">
      <div className="flex justify-center items-center gap-5">
          {columns.map((column) => (
          <div key={column.id} className={`flex justify-center items-center p-3 text-base font-semibold 
          ${column.id === currentColumnId ? "bg-[#D9D9D9] text-[#848484]" : "text-[#666]"}`}>
            {column.name}
          </div>
        ))}
      </div>
      
      <X 
        size={20} 
        className="absolute right-4 top-[14px] text-[#666] cursor-pointer"
        onClick={onClose}
      />
    </div>
  )
}