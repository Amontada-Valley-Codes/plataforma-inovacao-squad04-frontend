// src/app/api/dev/set-cookie/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { access_token } = await req.json().catch(() => ({}));
    const res = NextResponse.json({ ok: true });

    // Limpa cookie se token vazio
    if (!access_token) {
        res.cookies.set({
            name: "access_token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
        });
        return res;
    }

    // Grava cookie
    res.cookies.set({
        name: "access_token",
        value: access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2h
    });
    return res;
}
