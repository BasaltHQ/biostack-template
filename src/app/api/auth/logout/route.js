import { NextResponse } from "next/server";

// POST — Logout (clear session cookies)
export async function POST() {
    const response = NextResponse.json({ success: true, message: "Logged out" });

    response.cookies.set("biostack_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    response.cookies.set("biostack_admin_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return response;
}
