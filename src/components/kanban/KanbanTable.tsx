'use client'

import { PaginatedChallengesResponse, ShowAllChallengeResponse } from "@/api/payloads/challenge.payload"
import { dateFormatter, getCategoryLabel } from "./Kanban"
import { useEffect, useState } from "react";
import { ArrowUp, Scaling, X } from "lucide-react";
import { ChallengeService } from "@/api/services/challenge.service";

type KanbanTableProps = {
  status: string | undefined;
  sector: string | undefined;
  search: string | undefined;
  onRowClick: (challenge: ShowAllChallengeResponse) => void;
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "GENERATION":
      return "Desafios"
    case "PRE_SCREENING":
      return "Pré-Triagem"
    case "DETAILED_SCREENING":
      return "Triagem Detalhada"
    case "MATERIALIZATION":
      return "Materialização"
    case "EXPERIMENTATION":
      return "Experimentação"
    case "SCALE":
      return "Escala"
    default:
      return "Outro"
  }
}

type SortKey = "createdAt" | "name" | "proponentName" | "proponentArea" | "status"

export default function KanbanTable({ onRowClick, search, sector, status }: KanbanTableProps) {
  const [challenges, setChallenges] = useState<PaginatedChallengesResponse>()
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<SortKey>("createdAt")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  async function fetchChallenges() {
    const res = await ChallengeService.paginatedChallenges({
      page,
      limit: 15,
      sector,
      status,
      search: search || undefined,
      orderBy: sortKey,
      orderDirection: sortDirection,
    })

    setChallenges(res)
  }

  useEffect(() => {
    fetchChallenges()
  }, [page, sortKey, sortDirection, search, sector, status])

  useEffect(() => {
    setPage(1)
  }, [search, sector, status])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }
  return (
    <div className="overflow-x-auto sm:overflow-x-visible relative h-[calc(100vh-175px)]">
      <div className="rounded-[2px] overflow-hidden border-x-2 border-b-2 border-[#15358D]">
        <table className="table-auto min-w-[700px] w-full border-separate border-spacing-0">
          <thead className="bg-[#15358D]">
            <tr>
              <th 
                onClick={() => handleSort('createdAt')}
                className="px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  {sortKey === 'createdAt' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Data de Submissão</span>
                </div>
              </th>
              <th 
                onClick={() => handleSort("name")}
                className="px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  {sortKey === 'name' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Titulo da Ideia</span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('proponentName')}
                className="px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  {sortKey === 'proponentName' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Colaborador</span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('proponentArea')}
                className="px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  {sortKey === 'proponentArea' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Área</span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="px-3 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2">
                  {sortKey === 'status' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Status</span>
                </div>
              </th>
              <th
                className="px-3 py-2 text-sm font-semibold text-white"
              >
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-[#15358D]">
            {challenges?.data.map((challenge, i) => {
              const isLast = i === challenges.data.length - 1

              return (
                <tr 
                  key={challenge.id}
                  className="text-center odd:bg-white dark:odd:bg-[#101828]
                  border-b-2 border-[#15358D] border-r-2"
                >
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] border-r-2 ${!isLast ? "border-b-2" : ""}`}
                  >
                    {dateFormatter.format(new Date(challenge.createdAt))}
                  </td>
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] border-r-2 ${!isLast ? "border-b-2" : ""}`}
                  >
                    {challenge.name}
                  </td>
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] border-r-2 ${!isLast ? "border-b-2" : ""}`}
                  >
                    {challenge.proponentName}
                  </td>
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] border-r-2 ${!isLast ? "border-b-2" : ""}`}
                  >
                    {getCategoryLabel(challenge.proponentArea)}
                  </td>
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] border-r-2 ${!isLast ? "border-b-2" : ""}`}
                  >
                    {getStatusLabel(challenge.status)}
                  </td>
                  <td 
                    className={`px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  > 
                    <div
                      onClick={() => onRowClick(challenge)}
                      className="flex cursor-pointer items-center justify-center"
                      title="Clique para ver mais">
                      <Scaling size={20}/>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {challenges && (
        <div className="absolute bottom-0 left-0 w-full pt-4 flex justify-center gap-2 bg-white border-t-2 border-gray-600">
          {Array.from({ length: challenges.meta.lastPage }, (_, index) => {
            const pageNumber = index + 1
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 border rounded-[8px]
                  ${page === pageNumber ? "bg-[#0b2b72] text-white" : "text-[#0b2b72]"}
                `}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}