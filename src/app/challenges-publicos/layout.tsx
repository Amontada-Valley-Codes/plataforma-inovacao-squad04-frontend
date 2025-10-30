"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ChallengesPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [showModal, setShowModal] = useState(false);

  // Define role "startup" e intercepta todos os cliques
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      if (storedRole !== "startup") {
        localStorage.setItem("role", "startup");
      }

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest("#login-required-modal")) return;
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
      };

      document.addEventListener("click", handleClick, true);
      return () => document.removeEventListener("click", handleClick, true);
    }
  }, []);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Sidebar e Backdrop */}
      <AppSidebar />
      <Backdrop />

      {/* Conteúdo principal */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <AppHeader />
        </div>

        <main className="p-3 sm:p-4 md:p-6 mx-auto w-full max-w-screen-2xl overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Modal bloqueando interação */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            id="login-required-modal"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative bg-white/90 backdrop-blur-xl border border-white/40 text-gray-900 rounded-2xl p-8 w-[90%] max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-center"
            >
              {/* Botão Fechar */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-semibold mb-3 text-[#0B005E]">
                Acesso restrito
              </h2>

              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Para interagir com os desafios, é necessário estar autenticado.
                Crie uma conta ou inicie sessão para continuar.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="/auth/login"
                  className="bg-[#0B005E] text-white font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-[#0B005E]/90 transition-all"
                >
                  Fazer login
                </a>
                <a
                  href="/auth/register-startups"
                  className="border border-[#0B005E] text-[#0B005E] font-medium px-6 py-2 rounded-full hover:bg-[#0B005E]/10 transition-all"
                >
                  Criar conta
                </a>
              </div>

              <p className="text-xs text-gray-500 mt-5">
                A PIAC garante a segurança e privacidade das suas informações.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
