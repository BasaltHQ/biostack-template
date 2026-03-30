import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Client from "@/models/Client";
import Registration from "@/models/Registration";

// POST — Login with email and password, set session cookie
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

        // Check registration status FIRST. If they have a pending/rejected registration,
        // block login even if a client record technically exists.
        const registration = await Registration.findOne({ email: email.toLowerCase().trim() });
        if (registration) {
            if (registration.status === "pending") {
                return NextResponse.json(
                    { error: "REGISTRATION_PENDING", message: "Your registration is currently under review. You'll be able to log in once it's been approved by our team." },
                    { status: 403 }
                );
            }
            if (registration.status === "rejected") {
                return NextResponse.json(
                    { error: "REGISTRATION_REJECTED", message: "Your registration was not approved. Please contact us for more information." },
                    { status: 403 }
                );
            }
        }

        const client = await Client.findOne({ email: email.toLowerCase().trim() }).select("+password");
        if (!client) {
            return NextResponse.json(
                { error: "No account found with this email" },
                { status: 401 }
            );
        }

        // Detect passwordless account (created via checkout)
        if (!client.password || client.password.length < 10) {
            return NextResponse.json(
                { error: "PASSWORD_REQUIRED", message: "This account was created at checkout. Please set a password to continue." },
                { status: 403 }
            );
        }

        // Check if password reset mode is active
        if (client.passwordResetMode) {
            return NextResponse.json(
                { error: "PASSWORD_RESET", message: "Your password has been reset by an administrator. Please set a new password." },
                { status: 403 }
            );
        }

        const isMatch = await client.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 401 }
            );
        }

        // Set session cookie
        const response = NextResponse.json(
            { success: true, message: "Welcome back!", data: client },
            { status: 200 }
        );

        response.cookies.set("biostack_session", client.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
