import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { access_token } = await req.json().catch(() => ({}));
    const res = NextResponse.json({ ok: true });

    res.cookies.set({
        name: "access_token",
        value: access_token || "",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: access_token ? 60 * 60 * 2 : 0,
    });
    
    return res;
}
