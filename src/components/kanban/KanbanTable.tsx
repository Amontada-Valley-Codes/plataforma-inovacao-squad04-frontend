'use client'

import { PaginatedChallengesResponse, ShowAllChallengeResponse } from "@/api/payloads/challenge.payload"
import { dateFormatter, getCategoryLabel } from "./Kanban"
import { useEffect, useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight, Circle, Scaling, X } from "lucide-react";
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
  const [loading, setLoading] = useState(false)
  const colors: Record<string, string> = {
    GENERATION: "bg-violet-500",          
    PRE_SCREENING: "bg-amber-500",       
    DETAILED_SCREENING: "bg-orange-500", 
    MATERIALIZATION: "bg-blue-500",      
    EXPERIMENTATION: "bg-teal-500",      
    SCALE: "bg-green-500",               
    DEFAULT: "bg-gray-500",              
  }

  async function fetchChallenges() {
    try {
      setLoading(true)

      const res = await ChallengeService.paginatedChallenges({
        page,
        limit: 10,
        sector,
        status,
        search: search || undefined,
        orderBy: sortKey,
        orderDirection: sortDirection,
      })

      setChallenges(res)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
      <div className="rounded-[12px] overflow-hidden border-x-2 border-b-2 border-[#15358D]">
        <table className="table-auto min-w-[700px] w-full border-separate border-spacing-0">
          <thead className="bg-[#15358D]">
            <tr>
              <th 
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  <span>Identificador</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  {sortKey === 'createdAt' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Data de Submissão</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th 
                onClick={() => handleSort("name")}
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  {sortKey === 'name' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Titulo da Ideia</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('proponentName')}
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  {sortKey === 'proponentName' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Colaborador</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('proponentArea')}
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  {sortKey === 'proponentArea' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Área</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="pl-3 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 relative">
                  {sortKey === 'status' && (
                    <ArrowUp 
                      size={16}
                      className={`transition-transform duration-300
                        ${sortDirection === 'desc' ? "rotate-180" : "rotate-0"}`}
                    />
                  )} 
                  <span>Status</span>

                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[1.5px] rounded bg-gray-500"></span>
                </div>
              </th>
              <th
                className="px-3 py-3 text-sm font-semibold text-white"
              >
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-[#15358D]">
            {loading && (
              <tr>
                <td colSpan={7} className="py-16">
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground dark:text-gray-400">Carregando </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {challenges && challenges.data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-500 text-sm"
                >
                  Nenhum desafio encontrado.
                </td>
              </tr>
            )}

            {!loading && challenges?.data.map((challenge, i) => {
              const isLast = i === challenges.data.length - 1

              return (
                <tr 
                  key={challenge.id}
                  className="odd:bg-white dark:odd:bg-[#101828]
                  border-b-2 border-[#15358D] border-r-2"
                >
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-bl-[12px]" : ""}`}
                  >
                    {challenge.ideaIdentifier}
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  >
                    {dateFormatter.format(new Date(challenge.createdAt))}
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  >
                    {challenge.name}
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  >
                    {challenge.proponentName}
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  >
                    {getCategoryLabel(challenge.proponentArea)}
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""}`}
                  >
                    <span
                      className={`pl-6 px-3 py-1 rounded-full text-white text-sm font-semibold
                      ${colors[challenge.status] ?? colors.DEFAULT} relative`}
                    >
                      <span className="absolute left-[10px] top-[10px]"><Circle fill="white" size={6}/></span>
                      {getStatusLabel(challenge.status)}
                    </span>
                  </td>
                  <td 
                    className={`px-10 py-3 text-sm text-left text-gray-600 dark:text-white font-medium
                    border-[#15358D] ${!isLast ? "border-b-2" : ""} ${isLast ? "rounded-br-[12px]" : ""}`}
                  > 
                    <div
                      onClick={() => onRowClick(challenge)}
                      className="flex cursor-pointer items-center justify-center"
                      title="Clique para ver mais">
                      <Scaling size={18}/>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {challenges && (
        <div className="absolute bottom-0 left-0 w-full pt-4 flex justify-center items-center gap-2 bg-white">

          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-1 border rounded-[8px] disabled:opacity-50"
          >
            <ChevronLeft size={20}/>
          </button>

          {Array.from({ length: challenges.meta.lastPage }, (_, index) => index + 1)
            .filter((pageNumber) => {
              const lastPage = challenges.meta.lastPage

              if (lastPage <= 3) return true

              if (page === 1) return pageNumber <= 3
              if (page === lastPage) return pageNumber >= lastPage - 2

              return pageNumber >= page - 1 && pageNumber <= page + 1
            })
            .map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-3 py-1 border rounded-[8px]
                  ${
                    page === pageNumber
                      ? "bg-[#0b2b72] text-white"
                      : "text-[#0b2b72]"
                  }
                `}
              >
                {pageNumber}
              </button>
            ))}

          <button
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, challenges.meta.lastPage)
              )
            }
            disabled={page === challenges.meta.lastPage}
            className="p-1 border rounded-[8px] disabled:opacity-50"
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      )}
    </div>
  )
}