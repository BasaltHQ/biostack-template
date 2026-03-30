import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Client from "@/models/Client";

// GET — List all registrations (admin only, checked via cookie)
export async function GET(req) {
    // Verify admin session
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await connectToDatabase();

    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
        filter.status = status;
    }

    const registrations = await Registration.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: registrations });
}

// PATCH — Approve or reject a registration
export async function PATCH(req) {
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { registrationId, action } = body;

        if (!registrationId || !["approve", "reject", "reset"].includes(action)) {
            return NextResponse.json(
                { error: "registrationId and action (approve|reject|reset) are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const registration = await Registration.findById(registrationId).select("+password");
        if (!registration) {
            return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        }

        // RESET — move back to pending regardless of current status
        if (action === "reset") {
            registration.status = "pending";
            registration.reviewedAt = null;
            registration.reviewedBy = null;
            await registration.save();

            return NextResponse.json({
                success: true,
                message: "Registration reset to pending",
                data: registration,
            });
        }

        if (registration.status !== "pending") {
            return NextResponse.json(
                { error: `Registration has already been ${registration.status}` },
                { status: 400 }
            );
        }

        if (action === "reject") {
            registration.status = "rejected";
            registration.reviewedAt = new Date();
            registration.reviewedBy = adminSession;
            await registration.save();

            return NextResponse.json({
                success: true,
                message: "Registration rejected",
                data: registration,
            });
        }

        // APPROVE — Create a Client record with the password from registration
        // Check if client already exists
        const existingClient = await Client.findOne({ email: registration.email });
        if (existingClient) {
            registration.status = "approved";
            registration.reviewedAt = new Date();
            registration.reviewedBy = adminSession;
            await registration.save();

            return NextResponse.json({
                success: true,
                message: "Registration approved (client already existed)",
                data: registration,
            });
        }

        // Create the client — password is already hashed in registration
        const client = new Client({
            email: registration.email,
            name: `${registration.firstName} ${registration.lastName}`,
            phone: registration.officePhone || "",
            address: registration.billingAddress || {},
            shippingAddress: registration.shippingAddress || {},
            website: registration.website || "",
            industry: registration.industry || "",
            bio: registration.description || "",
        });
        // Set the pre-hashed password directly to avoid double-hashing
        client.password = registration.password;
        // Use updateOne to bypass the pre-save hook
        await Client.create([{
            email: registration.email,
            name: `${registration.firstName} ${registration.lastName}`,
            phone: registration.officePhone || "",
            address: registration.billingAddress || {},
            shippingAddress: registration.shippingAddress || {},
            website: registration.website || "",
            industry: registration.industry || "",
            bio: registration.description || "",
        }], { validateBeforeSave: false });

        // Now set the password directly (bypass pre-save hook)
        await Client.updateOne(
            { email: registration.email },
            { $set: { password: registration.password } }
        );

        registration.status = "approved";
        registration.reviewedAt = new Date();
        registration.reviewedBy = adminSession;
        await registration.save();

        return NextResponse.json({
            success: true,
            message: "Registration approved and client account created",
            data: registration,
        });
    } catch (error) {
        console.error("Error processing registration:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
