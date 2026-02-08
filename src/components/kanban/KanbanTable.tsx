'use client'

import { ShowAllChallengeResponse } from "@/api/payloads/challenge.payload"
import { dateFormatter, getCategoryLabel } from "./Kanban"
import { useState } from "react";
import { ArrowUp, X } from "lucide-react";

type KanbanTableProps = {
  challenges: ShowAllChallengeResponse[];
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

type SortKey = 'date' | 'user' | 'area' | 'status'

export default function KanbanTable({ challenges, onRowClick }: KanbanTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (!sortKey) return 0

    let valueA: any
    let valueB: any

    switch (sortKey) {
      case 'date':
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      case 'user':
        valueA = a.Users.name.toLowerCase()
        valueB = b.Users.name.toLowerCase()
        break
      case 'area':
        valueA = getCategoryLabel(a.involvedAreas[0])
        valueB = getCategoryLabel(b.involvedAreas[0])
        break
      case 'status':
        valueA = getStatusLabel(a.status)
        valueB = getStatusLabel(b.status)
        break
    }

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }
  return (
    <div className="overflow-x-auto sm:overflow-x-visible">
      <table className="table-auto min-w-[700px] w-full border-collapse border-2 border-[#15358D]">
        <thead className="bg-[#15358D]">
          <tr>
            <th 
              onClick={() => handleSort('date')}
              className="px-3 py-2 text-sm font-semibold text-white"
            >
              <div className="flex items-center justify-center gap-2">
                {sortKey === 'date' && (
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
              className="px-3 py-2 text-sm font-semibold text-white"
            >
              Titulo da ideia
            </th>
            <th 
              onClick={() => handleSort('user')}
              className="px-3 py-2 text-sm font-semibold text-white"
            >
              <div className="flex items-center justify-center gap-2">
                {sortKey === 'user' && (
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
              onClick={() => handleSort('area')}
              className="px-3 py-2 text-sm font-semibold text-white"
            >
              <div className="flex items-center justify-center gap-2">
                {sortKey === 'area' && (
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
              className="px-3 py-2 text-sm font-semibold text-white"
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
          </tr>
        </thead>

        <tbody className="divide-y-2 divide-[#15358D]">
          {sortedChallenges.map((challenge) => (
            <tr 
              key={challenge.id} 
              onClick={() => onRowClick(challenge)}
              className="divide-x-2 divide-[#15358D] text-center cursor-pointer odd:bg-white dark:odd:bg-[#101828] dark:even:bg-[#151d2c] even:bg-blue-100"
            >
              <td className="px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold">{dateFormatter.format(new Date(challenge.createdAt))}</td>
              <td className="px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold">{challenge.name}</td>
              <td className="px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold">{challenge.Users.name}</td>
              <td className="px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold">{getCategoryLabel(challenge.involvedAreas[0])}</td>
              <td className="px-2 py-1 text-sm text-gray-600 dark:text-white font-semibold">{getStatusLabel(challenge.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}