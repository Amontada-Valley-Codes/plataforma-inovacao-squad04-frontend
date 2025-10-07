'use client'

import { Modal } from "../ui/modal"
import ForwardButton from "./ForwardButton"
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

type CardExpandedLayoutProps = {
  className?: string;
  mainContent: React.ReactNode;
  commentsContent: React.ReactNode;
}

const CardExpandedLayout = ({ className, mainContent, commentsContent }: CardExpandedLayoutProps) => {
  return (
    <div className={cn("flex flex-1 min-h-0 bg-white w-full rounded-b-2xl", className)}>
      <div className="flex w-[55%] h-full bg-white rounded-b-2xl px-8 py-4">
        {mainContent}
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
  cardData: Feature | null
  columns: {
    name: string;
    id: string;
  }[];
  handleApproveAndMove: (featureId: string | undefined) => void;
}

export default function CardExpanded({ isOpen, onClose, columns, cardData, handleApproveAndMove }: CardExpandedProps) {
  if (!cardData) return null

  var currentColumnName = columns.find(c => c.id === cardData.column)?.name

  useEffect(() => {
    currentColumnName = columns.find(c => c.id === cardData.column)?.name
  }, [currentColumnName])

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
                    category={cardData.category}
                    description={cardData.description}
                    featureId={cardData.id} 
                    handleApproveAndMove={handleApproveAndMove}
                  />
                }
                commentsContent={
                  <CommentsPanel sections={challangeCommentSections}/>
                }
              />
            )}
            {currentColumnName === "Pré-Triagem" && (
              <CardPreScreeningContent featureId={cardData.id} handleApproveAndMove={handleApproveAndMove}/>
            )}
            {currentColumnName === "Triagem Detalhada" && (
              <CardDetailedScreeningContent featureId={cardData.id} handleApproveAndMove={handleApproveAndMove}/>
            )}
            {currentColumnName === "Ideação" && (
              <CardIdeationContent featureId={cardData.id} handleApproveAndMove={handleApproveAndMove}/>
            )}
            {currentColumnName === "Experimentação" && (
              <CardExperimentationContent featureId={cardData.id} handleApproveAndMove={handleApproveAndMove}/>
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
          <div className={`flex justify-center items-center p-3 text-base font-semibold 
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