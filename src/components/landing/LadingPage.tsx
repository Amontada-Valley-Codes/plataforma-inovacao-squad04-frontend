"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  cubicBezier,
  type Variants,
} from "framer-motion";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Registre-se (desktop)
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [startupOpen, setStartupOpen] = useState(false);   // Startups (desktop)
  const startupRef = useRef<HTMLDivElement>(null);

  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false); // Registre-se (mobile)
  const [startupMobileOpen, setStartupMobileOpen] = useState(false);   // Startups (mobile)

  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ---------- Helpers de scroll com offset ----------
  const ease = cubicBezier(0.22, 1, 0.36, 1);
  const NAV_OFFSET_DESKTOP = 64; // altura aproximada da navbar no desktop (h-16 + padding)
  const NAV_OFFSET_MOBILE  = 64; // altura ligeiramente maior no mobile

  const getOffset = () => (window.innerWidth < 913 ? NAV_OFFSET_MOBILE : NAV_OFFSET_DESKTOP);

  function scrollToWithOffset(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const off = getOffset();
    const y = el.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Fecha dropdowns clicando fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (startupRef.current && !startupRef.current.contains(target)) {
        setStartupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ESC fecha menus
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
        setStartupOpen(false);
        setDropdownMobileOpen(false);
        setStartupMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Observa scroll para aplicar blur/sombra
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Variants SEM bug de tipos no framer v11
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  };

  const pop: Variants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease } },
    exit: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.98, transition: { duration: 0.2, ease: "easeIn" } },
  };

  const stagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: 0.12,
      },
    },
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-cover bg-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B005E]/40 via-[#0B005E]/20 to-[#0B005E]/60" />

      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-[#0B005E]/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="mx-auto max-w-7xl flex justify-between items-center px-8 md:px-32 py-0 h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center"
            aria-label="Voltar ao início"
          >
            <Image
              src="/images/logo-ninna.png"
              alt="Ninna Logo"
              width={110}
              height={70}
              className="object-contain"
              priority
            />
          </button>

          {/* Menu Desktop */}
          <div className="hidden [@media(min-width:913px)]:flex items-center gap-10 text-sm font-medium text-white relative">
            <Link href="#sobre" className="hover:text-[#62D105] transition">Sobre</Link>
            <Link href="#plataforma-inovacao" className="hover:text-[#62D105] transition">Conheça o Sistema</Link>
            <Link href="#funil-inovacao" className="hover:text-[#62D105] transition">Funil de Inovação</Link>

            {/* STARTUPS (DROPDOWN) */}
            <div ref={startupRef} className="relative">
              <button
                onClick={() => {
                  setStartupOpen((p) => !p);
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-1 hover:text-[#62D105] transition"
                aria-haspopup="menu"
                aria-expanded={startupOpen}
                aria-controls="dropdown-startups"
              >
                Startup
                <motion.span
                  animate={{ rotate: startupOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, type: "tween" }}
                  className="inline-flex"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>

              <AnimatePresence>
                {startupOpen && (
                  <motion.div
                    id="dropdown-startups"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
                    className="absolute left-0 mt-2 w-56 bg-[#0B005E] border border-white/10 rounded-xl shadow-lg overflow-hidden z-30"
                    role="menu"
                  >
                    <a
                      href="#startups"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToWithOffset("startups");
                        setStartupOpen(false);
                      }}
                      className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#62D105] transition"
                      role="menuitem"
                    >
                      Sobre
                    </a>

                    <Link
                      href="/auth/login"
                      className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#62D105] transition"
                      role="menuitem"
                      onClick={() => setStartupOpen(false)}
                    >
                      Visualizar Desafios
                    </Link>

                    <Link
                      href="/auth/register-startups"
                      className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#62D105] transition"
                      role="menuitem"
                      onClick={() => setStartupOpen(false)}
                    >
                      Registrar Startup
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="#resumo"
              onClick={(e) => { e.preventDefault(); scrollToWithOffset("resumo"); }}
              className="hover:text-[#62D105] transition"
            >
              Resumo
            </Link>

            <Link
              href="#contatos"
              onClick={(e) => { e.preventDefault(); scrollToWithOffset("contatos"); }}
              className="hover:text-[#62D105] transition"
            >
              Contatos
            </Link>

            {/* Dropdown Registre-se (desktop) */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => {
                  setDropdownOpen((prev) => !prev);
                  setStartupOpen(false);
                }}
                className="flex items-center gap-1 hover:text-[#62D105] transition"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                Registre-se
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className="inline-flex"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } }}
                    exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } }}
                    className="absolute left-0 mt-2 w-52 bg-[#0B005E] border border-white/10 rounded-xl shadow-lg overflow-hidden z-30"
                    role="menu"
                  >
                    <Link href="/auth/register-startups" className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#62D105] transition" role="menuitem">
                      Registrar Startup
                    </Link>
                    <Link href="/auth/register-companies" className="block px-4 py-3 hover:bg-[#1A26B8] hover:text-[#62D105] transition" role="menuitem">
                      Registrar Empresa
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}>
              <Link
                href="/auth/login"
                className="bg-[#62D105] text-[#0B005E] px-5 py-2 rounded-full font-semibold hover:opacity-90 transition inline-flex"
              >
                Entrar
              </Link>
            </motion.div>
          </div>

          {/* Botão Mobile */}
          <button
            className="text-white [@media(min-width:1260px)]:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-controls="mobile-drawer"
            aria-expanded={menuOpen}
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Espaço para compensar nav fixa */}
      <div className="h-[80px]" />

      {/* Overlay + Drawer Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            />

            <motion.aside
              key="drawer"
              id="mobile-drawer"
              className="fixed top-0 right-0 h-full w-[80%] sm:w-[60%] bg-[#0B005E] text-white z-40 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { duration: 0.28, ease } }}
              exit={{ x: "100%", transition: { duration: 0.22, ease: "easeIn" } }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu móvel"
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
                <Image src="/images/logo-ninna.png" alt="Logo" width={100} height={60} className="object-contain" priority />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-[#62D105] transition"
                  aria-label="Fechar menu"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-5 px-6 py-6 text-lg font-medium">
                <a
                  href="#sobre"
                  onClick={(e) => { e.preventDefault(); scrollToWithOffset("sobre"); setMenuOpen(false); }}
                  className="hover:text-[#62D105] transition"
                >
                  Sobre
                </a>

                <a
                  href="#plataforma-inovacao"
                  onClick={(e) => { e.preventDefault(); scrollToWithOffset("plataforma-inovacao"); setMenuOpen(false); }}
                  className="hover:text-[#62D105] transition"
                >
                  Saiba mais
                </a>

                <a
                  href="#funil-inovacao"
                  onClick={(e) => { e.preventDefault(); scrollToWithOffset("funil-inovacao"); setMenuOpen(false); }}
                  className="hover:text-[#62D105] transition"
                >
                  Funil de Inovação
                </a>

                {/* Startups (MOBILE DROPDOWN) */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setStartupMobileOpen((prev) => !prev)}
                    className="flex items-center gap-1 hover:text-[#62D105] transition"
                    aria-haspopup="menu"
                    aria-expanded={startupMobileOpen}
                  >
                    Startups
                    <motion.span
                      animate={{ rotate: startupMobileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {startupMobileOpen && (
                      <motion.div
                        key="mobile-startups-dropdown"
                        variants={pop}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col pl-3 border-l border-white/20 gap-2 mt-2">
                          <a
                            href="#startups"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToWithOffset("startups");
                              setMenuOpen(false);
                              setStartupMobileOpen(false);
                            }}
                            className="hover:text-[#62D105] transition"
                          >
                            Sobre
                          </a>
                          <Link
                            href="/auth/login"
                            onClick={() => { setMenuOpen(false); setStartupMobileOpen(false); }}
                            className="hover:text-[#62D105] transition"
                          >
                            Visualizar Desafios
                          </Link>
                          <Link
                            href="/auth/register-startups"
                            onClick={() => { setMenuOpen(false); setStartupMobileOpen(false); }}
                            className="hover:text-[#62D105] transition"
                          >
                            Registrar Startup
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a
                  href="#resumo"
                  onClick={(e) => { e.preventDefault(); scrollToWithOffset("resumo"); setMenuOpen(false); }}
                  className="hover:text-[#62D105] transition"
                >
                  Resumo
                </a>

                <a
                  href="#contatos"
                  onClick={(e) => { e.preventDefault(); scrollToWithOffset("contatos"); setMenuOpen(false); }}
                  className="hover:text-[#62D105] transition"
                >
                  Contatos
                </a>

                {/* Dropdown Mobile Registre-se */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setDropdownMobileOpen((prev) => !prev)}
                    className="flex items-center gap-1 hover:text-[#62D105] transition"
                    aria-haspopup="menu"
                    aria-expanded={dropdownMobileOpen}
                  >
                    Registre-se
                    <motion.span
                      animate={{ rotate: dropdownMobileOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {dropdownMobileOpen && (
                      <motion.div
                        key="mobile-dropdown"
                        variants={pop}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col pl-3 border-l border-white/20 gap-2 mt-2">
                          <Link href="/auth/register-startups" onClick={() => setMenuOpen(false)} className="hover:text-[#62D105] transition">
                            Registrar Startup
                          </Link>
                          <Link href="/auth/register-companies" onClick={() => setMenuOpen(false)} className="hover:text-[#62D105] transition">
                            Registrar Empresa
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}>
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 bg-[#62D105] text-[#0B005E] px-6 py-3 rounded-full font-semibold hover:opacity-90 transition w-fit inline-flex"
                  >
                    Entrar
                  </Link>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* HERO */}
      <div className="flex-1 w-full">
        <div className="mx-auto max-w-7xl flex items-center justify-between h-full px-8 md:px-32 pt-0 text-white">
          {/* Texto */}
          <motion.div
            className="flex flex-col max-w-[480px] -mt-6 md:-mt-8"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold leading-tight">
              Gere <span className="text-[#62D105]">inovação</span> de
              <br />
              forma <span className="text-[#62D105]">estratégica!</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-2xl mt-6 leading-relaxed text-gray-200">
              Lance desafios em nossa plataforma de inovação aberta, capte ideias
              e conecte-se a startups num único ambiente!
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-6 mt-8">
              <motion.button
                whileHover={{ y: prefersReducedMotion ? 0 : -2 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                onClick={() => scrollToWithOffset("plataforma-inovacao")}
                className="bg-[#62D105] text-[#0B005E] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Saiba Mais
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Imagem à direita */}
          <div className="hidden md:flex justify-center items-center w-full md:w-1/2 -mt-8 [@media(max-width:950px)]:hidden">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease } }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                transition={prefersReducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/ninna-image.svg"
                  alt="ninna visual"
                  width={500}
                  height={500}
                  className="object-contain w-full h-auto max-w-[500px]"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CSS global para scroll suave + margem por seção */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        /* Compensação da navbar fixa para âncoras */
        #sobre, #plataforma-inovacao, #funil-inovacao, #startups, #resumo, #contatos {
          scroll-margin-top: ${NAV_OFFSET_MOBILE}px;
        }
        @media (min-width: 913px) {
          #sobre, #plataforma-inovacao, #funil-inovacao, #startups, #resumo, #contatos {
            scroll-margin-top: ${NAV_OFFSET_DESKTOP}px;
          }
        }
      `}</style>
    </div>
  );
}
