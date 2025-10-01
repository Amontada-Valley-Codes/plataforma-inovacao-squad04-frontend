'use client'

import { ChevronDown, CircleCheckBig, ClipboardList } from "lucide-react";
import { useState } from "react";
import CreateChallengeButton from "./CreateChallengeButton";

export default function ChallengeFilter() {

  const [isSetorOpen, setSetorIsOpen] = useState(false);
  const [isStatusOpen, setStatusIsOpen] = useState(false);

  return (
    <div className="w-full justify-between flex pl-4 px-6">

      <div className="flex gap-2">
        {/* Filtro por Data */}
        <label className="flex items-center gap-2 border border-gray-200 dark:text-[#ced3db] dark:border-gray-800 dark:bg-gray-900 px-4 py-3 rounded-[12px] bg-white text-zinc-500 font-semibold cursor-pointer">
          <input
            type="date"
          />
        </label>

        {/* Filtro por Setor */}
        <div className="relative flex items-center">

          <div className="absolute left-3 text-zinc-500 dark:text-[#ced3db]">
            <ClipboardList size={20} />
          </div>

          <select
            onClick={() => setSetorIsOpen(!isSetorOpen)}
            onBlur={() => setSetorIsOpen(false)}
            className="flex items-center gap-2 border border-gray-200 dark:text-[#ced3db] dark:border-gray-800 dark:bg-gray-900 px-10 py-3 rounded-[12px] bg-white text-zinc-500 font-semibold appearance-none pr-8"
          >
            <option disabled >Setor</option>
            <option value="financeiro">Financeiro</option>
            <option value="rh">RH</option>
            <option value="ti">TI</option>
          </select>

          <ChevronDown
            size={20}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
              isSetorOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* Filtro por Status */}
        <div className="relative flex items-center">
          
          <div className="absolute left-3 text-zinc-500 dark:text-[#ced3db]">
            <CircleCheckBig size={20}/>
          </div>

          <select
            onClick={() => setStatusIsOpen(!isStatusOpen)}
            onBlur={() => setStatusIsOpen(false)}
            className="flex items-center gap-2 border border-gray-200 dark:text-[#ced3db] dark:border-gray-800 dark:bg-gray-900 px-10 py-3 rounded-[12px] bg-white text-zinc-500 font-semibold appearance-none pr-8"
          >
            <option disabled >Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>

          <ChevronDown
            size={20}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
              isStatusOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div>
        <CreateChallengeButton/>
      </div>
    </div>
  );
}
