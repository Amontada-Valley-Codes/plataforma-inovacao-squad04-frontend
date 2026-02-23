'use client'

import { UserPlus } from "lucide-react"
import AddColaboratorForm from "./AddColaboratorForm"
import { useState, useEffect } from "react";
import { Role } from "@/lib/roles";
import { getUserRole } from "@/lib/auth";

export default function AddUsersButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const role: Role | null = getUserRole();
    setIsManager(role === "MANAGER");
  }, []);

  if (!isManager) return null;

  return (
    <div>
        <button 
          className="bg-[#15358D] rounded-[12px] h-11 w-11 flex justify-center items-center"
          onClick={() => setIsOpen(true)}
        >  
          <UserPlus className="text-white" size={20}/>
        </button>
    
        <AddColaboratorForm isOpen={isOpen} onClose={() => setIsOpen(false)}/>
    </div>
  )
}