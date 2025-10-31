"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter } from "next/navigation";
import { authService } from "@/api/services/auth.service";
import { LogOut } from "lucide-react";
import { ShowLoggedUserResponse } from "@/api/payloads/user.payload";
import { userService } from "@/api/services/user.service";

export default function UserDropdown() {
  const [user, setUser] = useState<ShowLoggedUserResponse>()
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await userService.showLoggedUser()
        setUser(response)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [])

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    authService.logout();
    router.push("/auth/login");
  }

  function translateRole(role?: string): string {
    switch ((role ?? "").toUpperCase()) {
      case "ADMIN":
        return "Administrador";
      case "MANAGER":
        return "Gestor";
      case "COMMON":
        return "Usuário";
      case "EVALUATOR":
        return "Avaliador";
      default:
        return "Usuário";
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <div className="flex items-center justify-center size-full rounded-full bg-gray-300">
            {user?.name.toUpperCase().charAt(0)}
          </div>
        </span>

        <div className="text-left">
          <span className="block mr-1 font-semibold text-theme-sm">{user?.name}</span>
          <span className="block mr-1 font-semibold text-xs text-[#6B7280]">{translateRole(user?.type_user)}</span>
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400" />
          Sair
        </button>
      </Dropdown>
    </div>
  );
}
