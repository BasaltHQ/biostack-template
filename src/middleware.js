import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Protect /shop routes — require biostack_session cookie
    if (pathname.startsWith("/shop")) {
        const session = request.cookies.get("biostack_session")?.value;

        if (!session) {
            const loginUrl = new URL("/portal", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Protect /api/admin/* routes (except /api/admin/setup and /api/admin/login)
    if (
        pathname.startsWith("/api/admin") &&
        !pathname.startsWith("/api/admin/setup") &&
        !pathname.startsWith("/api/admin/login")
    ) {
        const adminSession = request.cookies.get("biostack_admin_session")?.value;
        if (!adminSession) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/shop/:path*", "/api/admin/:path*"],
};
