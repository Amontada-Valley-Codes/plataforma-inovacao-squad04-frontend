"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 md:px-16 py-3 z-20 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo-ninna.png"
            alt="Ninna Logo"
            width={110}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white relative">
          <Link href="#" className="hover:text-[#A2FF00] transition">
            Sobre
          </Link>
          <Link href="#" className="hover:text-[#A2FF00] transition">
            Conheça o Sistema
          </Link>
          <Link href="#" className="hover:text-[#A2FF00] transition">
            Contatos
          </Link>

          {/* Dropdown Registre-se */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-[#A2FF00] transition"
            >
              Registre-se
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-[#0B005E] border border-white/10 rounded-xl shadow-lg overflow-hidden z-30 animate-fadeIn">
                <Link
                  href="/auth/register"
                  className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registre-se
                </Link>
                <Link
                  href="/auth/register-startups"
                  className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registrar Startup
                </Link>
                <Link
                  href="/auth/register-companies"
                  className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Registrar Empresa
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/auth/login"
            className="bg-[#A2FF00] text-[#0B005E] px-5 py-2 rounded-full font-semibold hover:opacity-90 transition"
          >
            Entrar
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="absolute top-20 left-0 w-full bg-[#0B005E] flex flex-col items-center gap-6 py-6 text-white text-lg font-medium shadow-lg md:hidden z-30">
            <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
              Sobre
            </Link>
            <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
              Conheça o Sistema
            </Link>
            <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
              Contatos
            </Link>

            {/* Dropdown Registre-se Mobile */}
            <div className="relative">
              <button
                onClick={() => setDropdownMobileOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:text-[#A2FF00] transition"
              >
                Registre-se
                <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownMobileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownMobileOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-[#0B005E] border border-white/10 rounded-xl shadow-lg overflow-visible z-50">
                  <Link
                    href="/auth/register"
                    className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                    onClick={() => setDropdownMobileOpen(false)}
                  >
                    Registre-se
                  </Link>
                  <Link
                    href="/auth/register-startups"
                    className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                    onClick={() => {
                      setDropdownMobileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Registrar Startup
                  </Link>
                  <Link
                    href="/auth/register-companies"
                    className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition"
                    onClick={() => {
                      setDropdownMobileOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Registrar Empresa
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#A2FF00] text-[#0B005E] px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
            >
              Entrar
            </Link>
          </div>
        )}
      </nav>

      {/* Conteúdo principal */}
      <div className="flex items-center justify-between flex-1 px-25 text-white">
        {/* Texto à esquerda */}
        <div className="flex flex-col max-w-[480px]">
          <h1 className="text-5xl font-bold leading-tight">
            Gere{" "}
            <span className="text-[#A2FF00]">inovação</span> de
            <br />
            forma{" "}
            <span className="text-[#A2FF00]">estratégica!</span>
          </h1>

          <p className="text-2xl mt-6 leading-relaxed text-gray-200">
            Lance desafios em nossa plataforma de inovação aberta, capte ideias
            e conecte-se a startups num único ambiente!
          </p>

          <div className="flex items-center gap-6 mt-8">
            <button className="bg-[#A2FF00] text-[#0B005E] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition">
              Conferir Oferta!
            </button>
          </div>
        </div>

        {/* Imagem à direita */}
        <div className="hidden md:flex justify-center md:justify-end items-center w-full md:w-1/2">
          <Image
            src="/images/ninna-image.svg"
            alt="ninna visual"
            width={500}
            height={500}
            className="object-contain w-full h-auto max-w-[500px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
