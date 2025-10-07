"use client";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { challengesData } from "@/mocks/ChallengeData";

export default function ChallengeCard() {  

  const getStatusColor = (status: string) => {
      switch (status) {
        case "Completed":
          return "bg-emerald-400";
        case "In Progress":
          return "bg-yellow-400"; 
        case "Pending":
          return "bg-red-400";
        default:
          return "bg-gray-400"; 
      }
    };

  return (
    <div className="grid grid-cols-4 gap-6 w-full p-4">
      {challengesData.map((challenge, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-5 flex flex-col justify-between hover:scale-[1.025] transition-transform transform"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-800">
                {challenge.ChallengeTitle}
              </h2>
              <p className="text-gray-500 dark:text-[#ced3db] text-sm">{challenge.Author}</p>
            </div>

            <button>
              <MoreHorizontal className="text-gray-400 dark:text-[#ced3db] hover:text-gray-600 cursor-pointer"/>
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Tag size={16} /> {challenge.Category}
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(challenge.Status)}`}></span>
              {challenge.Status}
            </div>

            <div className="grid grid-cols-2 items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{challenge.Date}</span>
              </div>

              <div className="flex justify-end">
                {challenge.Visibility === "Public" ? (
                  <span title="Público">
                    <Eye size={18} />
                  </span>
                ) : (
                  <span title="Privado">
                    <EyeOff size={18} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}