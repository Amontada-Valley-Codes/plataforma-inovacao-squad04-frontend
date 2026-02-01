/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState } from "react";
import { CardContentsHeader } from "./CardsContents"
import { Toaster } from "react-hot-toast";
import CanvasPoC from "./CanvasPoc";
import ResultsReport from "./ResultsReport";

type CardExperimentationContentProps = {
  challangeTitle: string;
  challengeId: string
  category: string;
  description: string;
  startDate: string;
  creator: string;
  visibility: string;
}

export const Experimentation = ({ challangeTitle, challengeId, category, startDate, creator, visibility }: CardExperimentationContentProps) => {
  const [page, setPage] = useState('1')
  return (
    <div  className="w-full flex flex-col overflow-y-auto">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challangeTitle}
          category={category}
          startDate={startDate}
          creator={creator}
          visibility={visibility}
        />
        <div className="relative flex items-center">
          <div className="flex gap-4 items-start xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${
                  page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                }`}
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Canvas PoC</span>
            </div>

            <div className="flex flex-col items-center">
              <button 
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${
                  page === '2' ? "bg-[#0B2B72] text-white" : "border-gray-400 dark:placeholder:text-white border-2 text-gray-500"
                }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Relatório</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        {page === '1' ? (
          <CanvasPoC/>
        ) : (
          <ResultsReport/>
        )}
      </div>
    </div>
  )
}