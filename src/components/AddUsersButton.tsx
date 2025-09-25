import { UserPlus } from "lucide-react"

export default function AddUsersButton() {
  return (
    <button className="bg-[#15358D] rounded-[12px] h-11 w-11   flex justify-center items-center">
      <UserPlus className="text-white" size={20}/>
    </button>
  )
}