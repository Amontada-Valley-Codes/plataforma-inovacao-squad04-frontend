'use client'

import { CardContentsHeader } from "./CardsContents";
import CanvasMVP from "./CanvasMVP";
import { useEffect, useState } from "react";
import { ShowAllUsersResponse } from "@/api/payloads/user.payload";
import { userService } from "@/api/services/user.service";
import { ChevronDown } from "lucide-react";

type CardMaterializationContentProps = {
  challengeTitle: string;
  challengeId: string;
  visibility: string;
  creator: string;
  endDate: string;
  startDate: string;

}

export function translateUserType(type: string): string {
  switch (type) {
    case "ORGANIZER":
      return "Organizador";

    case "COLLABORATOR":
      return "Colaborador";

    case "OBSERVER":
      return "Observador";

    case "INNOVATION_OFFICE":
      return "Escritório de Inovação";

    case "STEERING_COMMITTEE":
      return "Comitê de Direção";

    case "ADMINISTRATOR":
      return "Administrador";

    case "MANAGER":
      return "Gestor";

    case "STARTUP":
      return "Startup";

    default:
      return "Usuário";
  }
}


export default function Materialization({ challengeTitle, visibility, creator, endDate, startDate, challengeId}: CardMaterializationContentProps) {
  const [users, setUsers] = useState<ShowAllUsersResponse>([])
  const [sponsorId, setSponsorId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await userService.showAllUsers()
      setUsers(response)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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
        <div className="flex justify-between items-center">
          <h1 className="text-[24px] text-[#0B2B70] dark:text-white font-semibold mb-4">
            Canvas do MVP
          </h1>

          <div 
            className="flex items-center bg-[#E7EEFF] hover:bg-[#dee2ec] transition-colors text-[#0B2B70] font-semibold
            text-[14px] rounded-[8px] relative"
          >
            <select
              value={sponsorId ?? ""}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              onChange={(e) => setSponsorId(e.target.value)}
              className="flex w-fit justify-center p-2 appearance-none
              cursor-pointer rounded-[8px] outline-none"
            >
              <option 
                value={""}
              >
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

            <ChevronDown 
              className={`text-[#0B2B70] absolute right-2 pointer-events-none
                          transition-transform duration-200
                          ${isOpen ? "rotate-180" : "rotate-0"}`}/>
          </div>
        </div>

        <CanvasMVP/>
      </div>
    </div>
  )
}