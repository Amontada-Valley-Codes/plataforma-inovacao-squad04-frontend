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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar menu com tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full z-20 relative">
        <div className="mx-auto max-w-7xl flex justify-between items-center px-8 md:px-32 py-3">
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
          <div className="hidden [@media(min-width:913px)]:flex items-center gap-10 text-sm font-medium text-white relative">
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
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-[#0B005E] border border-white/10 rounded-xl shadow-lg overflow-hidden z-30 animate-fadeIn">
                  <Link href="/auth/register" className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition">
                    Registre-se
                  </Link>
                  <Link href="/auth/register-startups" className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition">
                    Registrar Startup
                  </Link>
                  <Link href="/auth/register-companies" className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#A2FF00] transition">
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
            className="text-white [@media(min-width:913px)]:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay escurecido com blur */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Drawer lateral (menu mobile moderno) */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] sm:w-[60%] bg-[#0B005E] text-white z-40 shadow-2xl transform transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
          <Image
            src="/images/logo-ninna.png"
            alt="Logo"
            width={100}
            height={60}
            className="object-contain"
          />
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-[#A2FF00] transition"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6 text-lg font-medium">
          <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
            Sobre
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
            Conheça o Sistema
          </Link>
          <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
            Contatos
          </Link>

          {/* Dropdown Mobile */}
          <div className="flex flex-col gap-2">
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
              <div className="flex flex-col pl-3 border-l border-white/20 gap-2 mt-1">
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
                  Registre-se
                </Link>
                <Link href="/auth/register-startups" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
                  Registrar Startup
                </Link>
                <Link href="/auth/register-companies" onClick={() => setMenuOpen(false)} className="hover:text-[#A2FF00] transition">
                  Registrar Empresa
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/auth/login"
            onClick={() => setMenuOpen(false)}
            className="mt-4 bg-[#A2FF00] text-[#0B005E] px-6 py-3 rounded-full font-semibold hover:opacity-90 transition w-fit"
          >
            Entrar
          </Link>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-full px-8 md:px-32 pt-0 text-white">
          {/* Texto */}
          <div className="flex flex-col max-w-[480px] -mt-6 md:-mt-8">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Gere <span className="text-[#A2FF00]">inovação</span> de
              <br />
              forma <span className="text-[#A2FF00]">estratégica!</span>
            </h1>

            <p className="text-lg sm:text-2xl mt-6 leading-relaxed text-gray-200">
              Lance desafios em nossa plataforma de inovação aberta, capte ideias
              e conecte-se a startups num único ambiente!
            </p>

            <div className="flex items-center gap-6 mt-8">
              <button className="bg-[#A2FF00] text-[#0B005E] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition">
                Conheça o Sistema!
              </button>
            </div>
          </div>

          {/* Imagem à direita */}
          <div className="hidden md:flex justify-center items-center w-full md:w-1/2 -mt-8 [@media(max-width:950px)]:hidden">
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
    </div>
  );
}
