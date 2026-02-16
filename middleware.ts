import { NextRequest, NextResponse } from "next/server";
import { decodeJwtEdge, type DecodedToken } from "./src/lib/jwt-edge";

type RoleEn =
  | "COMMON"
  | "ADMINISTRATOR"
  | "EVALUATOR"
  | "MANAGER"
  | "STARTUP"
  | "ORGANIZER"
  | "COLLABORATOR"
  | "OBSERVER"
  | "INNOVATION_OFFICE"
  | "STEERING_COMMITTEE";

type TokenWithScope = DecodedToken & {
  companyId?: string | number;
  enterpriseId?: string | number;
  startupId?: string | number;
};

const rules: Record<string, RoleEn[]> = {
  "/admin": ["ADMINISTRATOR"],

  "/company": [
    "ADMINISTRATOR",
    "MANAGER",
    "EVALUATOR",
    "ORGANIZER",
    "INNOVATION_OFFICE",
    "STEERING_COMMITTEE",
    "OBSERVER",
  ],

  "/user": [
    "COMMON",
    "COLLABORATOR",
    "ADMINISTRATOR",
    "MANAGER",
    "EVALUATOR",
    "ORGANIZER",
    "INNOVATION_OFFICE",
    "STEERING_COMMITTEE",
    "OBSERVER",
  ],

  "/startup": [
    "STARTUP",
    "ADMINISTRATOR",
    "INNOVATION_OFFICE",
    "STEERING_COMMITTEE",
    "OBSERVER",
  ],
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

    case "ORGANIZER":
      return "ORGANIZER";
    case "COLLABORATOR":
      return "COLLABORATOR";
    case "OBSERVER":
      return "OBSERVER";
    case "INNOVATION_OFFICE":
      return "INNOVATION_OFFICE";
    case "STEERING_COMMITTEE":
      return "STEERING_COMMITTEE";

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

  const tokenValue = decodeURIComponent(token);

  const decoded = decodeJwtEdge<TokenWithScope>(tokenValue);

  if (!decoded) {
    const login = new URL("/auth/login", req.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }

  const rawRole =
    (decoded as any).type_user ??
    (decoded as any).typeUser ??
    (decoded as any).role ??
    (decoded as any).userType;

  const role = normalizeRole(rawRole);


  const prefix = ("/" + pathname.split("/").filter(Boolean)[0]) || "/";
  const allow = rules[prefix];

  const isUuid = (s?: string) => !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

  const isPrivileged = role === "ADMINISTRATOR" || role === "INNOVATION_OFFICE" || role === "STEERING_COMMITTEE";


  if (allow && (!role || !allow.includes(role))) {
    return NextResponse.redirect(new URL("/sem-permissao", req.url));
  }

  if (prefix === "/company") {
    const parts = pathname.split("/").filter(Boolean); // ["company", ":id", ...]
    const routeCompanyId = parts[1]; // pode ser UUID ou slug tipo "dashboard"
    const tokenCompanyId = String(decoded.companyId ?? decoded.enterpriseId ?? "");

    // Só valida escopo quando o 2º segmento for realmente um UUID
    if (isUuid(routeCompanyId) && tokenCompanyId) {
      if (!isPrivileged && routeCompanyId !== tokenCompanyId) {
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
      if (!isPrivileged && routeStartupId !== tokenStartupId) {
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