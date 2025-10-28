'use client'

import { UserPlus } from "lucide-react"
import AddColaboratorForm from "./AddColaboratorForm"
import { useState } from "react";

export default function AddUsersButton() {

  const [isOpen, setIsOpen] = useState(false);

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