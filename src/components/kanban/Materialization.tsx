'use client'

import { Check, PenSquare, Plus, Trash2 } from "lucide-react";
import { CardContentsHeader } from "./CardsContents";
import { useState } from "react";
import CanvasMVP from "./CanvasMVP";

type CardMaterializationContentProps = {
  challengeTitle: string;
  challengeId: string;
  visibility: string;
  creator: string;
  endDate: string;
  startDate: string;

}

export default function Materialization({ challengeTitle, visibility, creator, endDate, startDate, challengeId}: CardMaterializationContentProps) {

  return (
    <div className="w-full flex flex-col overflow-y-auto scrollbar-hidden">
      <CardContentsHeader
        challengeTitle={challengeTitle}
        visibility={visibility} 
        creator={creator}
        endDate={endDate}
        startDate={startDate}
      />
      <div>
        <CanvasMVP/>
      </div>
    </div>
  )
}