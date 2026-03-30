import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Client from "@/models/Client";

// PATCH — Admin enables password reset mode for a client
export async function PATCH(req) {
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { clientId, email } = await req.json();

        if (!clientId && !email) {
            return NextResponse.json(
                { error: "clientId or email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const filter = clientId ? { _id: clientId } : { email: email.toLowerCase().trim() };
        const client = await Client.findOneAndUpdate(
            filter,
            { $set: { passwordResetMode: true } },
            { new: true }
        );

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Password reset mode enabled for ${client.email}. They will be prompted to set a new password on next login.`,
            data: client,
        });
    } catch (error) {
        console.error("Error enabling password reset:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET — List all clients (for admin directory)
export async function GET(req) {
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const clients = await Client.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: clients });
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE — Admin deletes a client account
export async function DELETE(req) {
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { clientId, email } = await req.json();

        if (!clientId && !email) {
            return NextResponse.json(
                { error: "clientId or email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const filter = clientId ? { _id: clientId } : { email: email.toLowerCase().trim() };
        const client = await Client.findOneAndDelete(filter);

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Client ${client.email} has been deleted.`,
        });
    } catch (error) {
        console.error("Error deleting client:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
