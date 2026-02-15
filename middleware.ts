import { NextRequest, NextResponse } from "next/server";
import { decodeJwtEdge, type DecodedToken } from "./src/lib/jwt-edge";

type RoleEn = "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER" | "STARTUP";

type TokenWithScope = DecodedToken & {
  companyId?: string | number;
  enterpriseId?: string | number;
  startupId?: string | number;
};

const rules: Record<string, RoleEn[]> = {
  "/admin": ["ADMINISTRATOR"],
  "/company": ["ADMINISTRATOR", "MANAGER", "EVALUATOR"],
  "/user": ["COMMON", "ADMINISTRATOR", "MANAGER", "EVALUATOR"],
  "/startup": ["STARTUP"],
};

function normalizeRole(raw?: unknown): RoleEn | undefined {
  const v = String(raw ?? "").trim().toUpperCase();
  switch (v) {
    case "ADMIN":
    case "ADMINISTRATOR":
      return "ADMINISTRATOR";
    case "MANAGER":
    case "GESTOR":
      return "MANAGER";
    case "EVALUATOR":
    case "AVALIADOR":
      return "EVALUATOR";
    case "STARTUP":
      return "STARTUP";
    case "COMMON":
    case "USER":
    case "USUARIO":
    default:
      return "COMMON";
  }
}

const isPublic = (p: string) =>
  p === "/" ||
  p === "/sem-permissao" ||
  p.startsWith("/auth/login") ||
  p.startsWith("/register") ||
  p.startsWith("/public") ||
  p.startsWith("/_next") ||
  p.startsWith("/favicon") ||
  p.startsWith("/api/dev/set-cookie");


export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const login = new URL("/auth/login", req.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }

  const decoded = decodeJwtEdge<TokenWithScope>(token);
  if (!decoded) {
    const login = new URL("/auth/login", req.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  const role = normalizeRole(decoded.type_user ?? (decoded as any).role);

  const prefix = ("/" + pathname.split("/").filter(Boolean)[0]) || "/";
  const allow = rules[prefix];

  const isUuid = (s?: string) => !!s &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

  if (allow && (!role || !allow.includes(role))) {
    return NextResponse.redirect(new URL("/sem-permissao", req.url));
  }

  // Escopo por companyId em /company/:companyId/*
   if (prefix === "/company") {
    const parts = pathname.split("/").filter(Boolean); // ["company", ":id", ...]
    const routeCompanyId = parts[1]; // pode ser número ou UUID
    const tokenCompanyId = String(decoded.companyId ?? decoded.enterpriseId ?? "");

    // Se a rota tem :id e o token tem companyId, valida
    if (routeCompanyId && tokenCompanyId) {
      if (role !== "ADMINISTRATOR" && routeCompanyId !== tokenCompanyId) {
        return NextResponse.redirect(new URL("/sem-permissao", req.url));
      }
    }
  }

  // Escopo por startupId em /startup/:startupId/*
  if (prefix === "/startup") {
    const parts = pathname.split("/").filter(Boolean);
    const routeStartupId = parts[1];
    const tokenStartupId = String(decoded.startupId ?? "");

    // Só valida se o segundo segmento for realmente um UUID
    if (isUuid(routeStartupId) && tokenStartupId) {
      if (role !== "ADMINISTRATOR" && routeStartupId !== tokenStartupId) {
        return NextResponse.redirect(new URL("/sem-permissao", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/user/:path*",
    "/startup/:path*",
  ],
};