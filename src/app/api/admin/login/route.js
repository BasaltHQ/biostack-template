import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";

// POST — Admin login
export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!admin) {
            return NextResponse.json(
                { error: "Invalid admin credentials" },
                { status: 401 }
            );
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid admin credentials" },
                { status: 401 }
            );
        }

        const response = NextResponse.json(
            {
                success: true,
                message: "Admin login successful",
                data: { email: admin.email, name: admin.name, role: "admin" },
            },
            { status: 200 }
        );

        response.cookies.set("biostack_admin_session", admin.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Error in admin login:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
