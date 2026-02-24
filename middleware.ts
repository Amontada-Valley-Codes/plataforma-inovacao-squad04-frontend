import { NextRequest, NextResponse } from "next/server";
import { decodeJwtEdge } from "./src/lib/jwt-edge";
import {
  normalizeRole,
  isGlobalRole,
  isCompanyRole,
  isStartupRole,
  type Role,
} from "./src/lib/roles";



function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/sem-permissao" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/dev/set-cookie")
  );
}



const ROUTE_RULES: Record<string, Role[]> = {
  "/admin": ["ADMINISTRATOR", "MANAGER",  "INNOVATION_TEAM"],

  "/company": [
    "ADMINISTRATOR",
    "MANAGER",
    "INNOVATION_TEAM",
    "TRANSFORMATION_OFFICE",
    "STEERING_COMMITTEE",
    "COLLABORATOR", 
    "OBSERVER",
  ],

  "/startup": ["ADMINISTRATOR", "STARTUP"],
};



const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value?: string | null): value is string {
  return !!value && UUID_REGEX.test(value);
}

function redirectToLogin(req: NextRequest, pathname: string, search: string) {
  const url = new URL("/auth/login", req.url);
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

function redirectToForbidden(req: NextRequest) {
  return NextResponse.redirect(new URL("/sem-permissao", req.url));
}



export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;


  if (isPublicPath(pathname)) return NextResponse.next();


  const rawToken = req.cookies.get("access_token")?.value;
  if (!rawToken) return redirectToLogin(req, pathname, search);

  const token = decodeURIComponent(rawToken);
  const decoded = decodeJwtEdge(token);
  if (!decoded) return redirectToLogin(req, pathname, search);


  const role = normalizeRole(decoded.type_user);
  if (!role) return redirectToForbidden(req);


  const prefix = ("/" + pathname.split("/").filter(Boolean)[0]) as string;
  const allowedRoles = ROUTE_RULES[prefix];


  if (!allowedRoles) return NextResponse.next();


  if (!allowedRoles.includes(role)) return redirectToForbidden(req);


  if (isGlobalRole(role)) return NextResponse.next();


  if (prefix === "/company" && isCompanyRole(role)) {
    const routeEnterpriseId = pathname.split("/").filter(Boolean)[1];

    if (isUuid(routeEnterpriseId)) {
      const tokenEnterpriseId = decoded.enterpriseId;

      if (!isUuid(tokenEnterpriseId)) {
        return redirectToForbidden(req);
      }

      if (routeEnterpriseId !== tokenEnterpriseId) {
        return redirectToForbidden(req);
      }
    }
  }

  if (prefix === "/startup" && isStartupRole(role)) {
    const routeStartupId = pathname.split("/").filter(Boolean)[1];

    if (isUuid(routeStartupId)) {
      const tokenStartupId = decoded.startupId;

      if (!isUuid(tokenStartupId)) {
        return redirectToForbidden(req);
      }

      if (routeStartupId !== tokenStartupId) {
        return redirectToForbidden(req);
      }
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/startup/:path*",
  ],
};