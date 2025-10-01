"use client";
import { Tag, Calendar, Eye, EyeOff, MoreHorizontal } from "lucide-react";

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

  type Challenge = {
    ChallengeTitle: string,
    Author: string,
    Category: string,
    Status: string,
    Date: string,
    Visibility: string,
  }

  const challengesData: Challenge[] = [
    {
      ChallengeTitle: "Build a Todo App",
      Author: "Eduardo Albuquerque",
      Category: "Front-End",
      Status: "Completed",
      Date: "2025-09-17",
      Visibility: "Public",
    },
    {
      ChallengeTitle: "API RESTful com NestJS",
      Author: "João Silva",
      Category: "Back-End",
      Status: "In Progress",
      Date: "2025-09-12",
      Visibility: "Private",
    },
    {
      ChallengeTitle: "UI Dashboard com Tailwind",
      Author: "Maria Souza",
      Category: "Design/UI",
      Status: "Pending",
      Date: "2025-09-01",
      Visibility: "Public",
    },
    {
      ChallengeTitle: "Mobile App React Native",
      Author: "Carlos Lima",
      Category: "Mobile",
      Status: "Completed",
      Date: "2025-08-28",
      Visibility: "Private",
    },
    {
      ChallengeTitle: "GraphQL API",
      Author: "Ana Paula",
      Category: "Back-End",
      Status: "Pending",
      Date: "2025-09-05",
      Visibility: "Public",
    },
    {
      ChallengeTitle: "Landing Page HTML/CSS",
      Author: "Rafael Santos",
      Category: "Front-End",
      Status: "In Progress",
      Date: "2025-09-10",
      Visibility: "Public",
    },
    {
      ChallengeTitle: "E-commerce Fullstack",
      Author: "Luiza Martins",
      Category: "Fullstack",
      Status: "Completed",
      Date: "2025-08-20",
      Visibility: "Private",
    },
    {
      ChallengeTitle: "Chat App Socket.io",
      Author: "Bruno Costa",
      Category: "Back-End",
      Status: "In Progress",
      Date: "2025-09-14",
      Visibility: "Public",
    }
  ];

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

            <div className="flex items-center gap-2 text-gray-600 dark:text-[#ced3db] text-sm">
              <Calendar size={16} /> {challenge.Date}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-4 text-gray-600 dark:text-[#ced3db]">
            {challenge.Visibility === "Public" ? (
              <span title="Publico">
                <Eye size={18} />
              </span>
            ) : (
              <span title="Privado">
                <EyeOff size={18} />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}