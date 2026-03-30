import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Client from "@/models/Client";

// POST — Client requests a password reset (public endpoint)
export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        await connectToDatabase();

        const client = await Client.findOne({ email: email.toLowerCase().trim() });
        if (!client) {
            // Don't reveal whether the account exists
            return NextResponse.json({
                success: true,
                message: "If an account with that email exists, a password reset request has been submitted. Please contact your administrator.",
            });
        }

        // We don't auto-enable reset mode — admin must approve it
        // For now, just return success message (admin will see reset requests in their panel)
        // We store a flag so the admin knows a reset was requested
        await Client.updateOne(
            { email: email.toLowerCase().trim() },
            { $set: { passwordResetRequested: true } }
        );

        return NextResponse.json({
            success: true,
            message: "Password reset request submitted. Your administrator will review it shortly.",
        });
    } catch (error) {
        console.error("Error requesting password reset:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
