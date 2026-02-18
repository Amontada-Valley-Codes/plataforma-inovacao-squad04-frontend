'use client'

import { CardContentsHeader } from "./CardsContents";
import CanvasMVP from "./CanvasMVP";
import { useEffect, useState } from "react";
import { ShowAllUsersResponse } from "@/api/payloads/user.payload";
import { userService } from "@/api/services/user.service";
import { sponsorsService } from "@/api/services/sponsor.service";
import { ChevronDown } from "lucide-react";
import MakeforBuy from "./MakeForBuy";

type CardMaterializationContentProps = {
  challengeTitle: string;
  challengeId: string;
  visibility: string;
  creator: string;
  startDate: string;
}

export function translateUserType(type: string): string {
  switch (type) {
    case "ORGANIZER": return "Organizador";
    case "COLLABORATOR": return "Colaborador";
    case "OBSERVER": return "Observador";
    case "INNOVATION_OFFICE": return "Escritório de Inovação";
    case "STEERING_COMMITTEE": return "Comitê de Direção";
    case "ADMINISTRATOR": return "Administrador";
    case "MANAGER": return "Gestor";
    case "STARTUP": return "Startup";
    default: return "Usuário";
  }
}

export default function Materialization({ challengeTitle, visibility, creator, startDate, challengeId }: CardMaterializationContentProps) {
  const [users, setUsers] = useState<ShowAllUsersResponse>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [sponsorRelationId, setSponsorRelationId] = useState<string | null>(null)
  
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState<'1' | '2'>('1')

  const fetchSponsor = async () => {
    try {
      const [usersResponse, sponsorsResponse] = await Promise.all([
        userService.showAllUsers(),
        sponsorsService.ShowSponsors()
      ])

      setUsers(usersResponse)

      const currentSponsor = sponsorsResponse.find(s => s.challengeId === challengeId)

      if (currentSponsor) {
        setSelectedUserId(currentSponsor.sponsor.id)
        setSponsorRelationId(currentSponsor.id)
      } else {
        setSelectedUserId("")
        setSponsorRelationId(null)
      }

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSponsor()
  }, [challengeId])

  const handleSponsorChange = async (newUserId: string) => {
    try {
      if (!newUserId) {
        if (sponsorRelationId) {
          await sponsorsService.DeleteSponsor(sponsorRelationId)
          setSponsorRelationId(null)
          setSelectedUserId("")
        }
        return
      }

      if (sponsorRelationId) {
        const response = await sponsorsService.UpdateSponsor(sponsorRelationId, {
          challengeId: challengeId,
          userId: newUserId
        })
        setSelectedUserId(response.sponsorId)
      } 
      else {
        const response = await sponsorsService.AddSponsor({
          challengeId: challengeId,
          userId: newUserId
        })
        setSponsorRelationId(response.id)
        setSelectedUserId(response.sponsor.id)
      }

    } catch (error) {
      console.error(error)
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <div className="w-full flex flex-col overflow-y-auto">
      <div className="flex flex-col xl:flex-row xl:justify-between mb-6">
        <CardContentsHeader
          challengeTitle={challengeTitle}
          visibility={visibility}
          creator={creator}
          startDate={startDate}
        />
        <div className="relative flex items-center">
          <div className="flex gap-4 items-start xl:justify-center w-full max-w-md">
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full font-semibold flex items-center justify-center ${page === '1' ? "bg-[#0B2B72] text-white" : "border-gray-400 border-2 text-gray-500"
                  }`}
                onClick={() => setPage('1')}
              >
                1
              </button>
              <span className="text-sm mt-1 whitespace-nowrap">Canvas</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 rounded-full  font-semibold flex items-center justify-center ${page === '2' ? "bg-[#0B2B72] text-white" : "border-gray-400 dark:placeholder:text-white border-2 text-gray-500"
                  }`}
                onClick={() => setPage('2')}
              >
                2
              </button>
              <span className="text-sm mt-1 text-center flex flex-col leading-tight">
                <span className="mt-0.5">Materialização</span>
                <span>para Buy</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          {page === '1' && (
            <>
              <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
                Canvas do MVP
              </h1>

              <div
                className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
                text-[14px] rounded-[8px] pr-10 relative w-40 min-w-[200px]"
              >
                <select
                  value={selectedUserId}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setIsOpen(false)}
                  onChange={(e) => handleSponsorChange(e.target.value)}
                  className="flex w-full justify-center p-2 pl-4 appearance-none
                  cursor-pointer rounded-[8px] outline-none bg-transparent"
                >
                  <option value={""}>
                    Definir Sponsor
                  </option>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} - {translateUserType(user.type_user)}
                    </option>
                  ))}
                </select>

                <div className="absolute right-2 pointer-events-none text-[#0B2B70]">
                  <ChevronDown
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} 
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {page === '1' ? (
          <CanvasMVP challengeId={challengeId} />
        ) : (
          <MakeforBuy challengeId={challengeId} />
        )}
      </div>
    </div>
  )
}