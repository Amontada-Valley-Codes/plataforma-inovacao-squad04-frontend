/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";

type RoleEn = "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER" | "STARTUP";

const rules: Record<string, RoleEn[]> = {
    "/admin": ["ADMINISTRATOR"],
    "/manager": ["MANAGER"],
    "/evaluator": ["EVALUATOR"],
    "/company": ["MANAGER", "EVALUATOR"],
    "/startup": ["STARTUP"],  
    "/user": ["COMMON", "ADMINISTRATOR", "MANAGER", "EVALUATOR", "STARTUP"],
};

// Edge runtime: use atob/base64url, não Buffer
function decodeJwtPayload<T = any>(token: string): T | null {
    try {
        const [, payload] = token.split(".");
        if (!payload) return null;
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const withHeader = (res: NextResponse) => {
        res.headers.set("x-mw", "hit");
        return res;
    };

    // Rotas públicas + assets
    if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/public") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/api/dev/set-cookie")
    ) {
        return withHeader(NextResponse.next());
    }

    // Exige cookie
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
        const login = new URL("/login", req.url);
        login.searchParams.set("next", pathname);
        return withHeader(NextResponse.redirect(login));
    }

    const decoded = decodeJwtPayload<{ type_user?: RoleEn }>(token);
    const role = decoded?.type_user;

    // prefixo da rota (/user, /admin, ...)
    const segs = pathname.split("/").filter(Boolean);
    const prefix = segs.length ? `/${segs[0]}` : "/";

    const allow = rules[prefix];
    if (!allow) return withHeader(NextResponse.next());

    if (!role || !allow.includes(role)) {
        return withHeader(NextResponse.redirect(new URL("/sem-permissao", req.url)));
    }

    return withHeader(NextResponse.next());
}

export const config = {
    matcher: ["/admin/:path*", "/manager/:path*", "/evaluator/:path*", "/company/:path*", "/user/:path*", "/startup/:path*"],
};
