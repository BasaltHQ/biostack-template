import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";

// POST — One-time admin setup. Once an admin exists, this endpoint is locked.
export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password, and name are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if any admin already exists — if so, lock this endpoint
        const existingAdmin = await Admin.countDocuments();
        if (existingAdmin > 0) {
            return NextResponse.json(
                { error: "Admin setup has already been completed. This endpoint is no longer accessible." },
                { status: 403 }
            );
        }

        const admin = await Admin.create({
            email: email.toLowerCase().trim(),
            password,
            name: name.trim(),
        });

        return NextResponse.json(
            { success: true, message: "Admin account created successfully!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in admin setup:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET — Check if admin setup is available
export async function GET() {
    try {
        await connectToDatabase();
        const count = await Admin.countDocuments();
        return NextResponse.json({ available: count === 0 });
    } catch {
        return NextResponse.json({ available: false });
    }
}
