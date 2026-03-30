import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";
import { upsertAccount, upsertContact } from "@/lib/crm";

// POST — Push an approved registration to the CRM
export async function POST(req) {
    const adminSession = req.cookies.get("biostack_admin_session")?.value;
    if (!adminSession) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { registrationId } = await req.json();

        if (!registrationId) {
            return NextResponse.json({ error: "registrationId is required" }, { status: 400 });
        }

        await connectToDatabase();

        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        }

        if (registration.status !== "approved") {
            return NextResponse.json(
                { error: "Only approved registrations can be pushed to CRM" },
                { status: 400 }
            );
        }

        // Upsert account in CRM
        const accountName = `${registration.firstName} ${registration.lastName}`;
        const accountResult = await upsertAccount({
            name: accountName,
            email: registration.email,
            type: "Customer",
            website: registration.website || undefined,
            officePhone: registration.officePhone || undefined,
            billingAddress: registration.billingAddress || undefined,
            shippingAddress: registration.shippingAddress || undefined,
            industry: registration.industry || undefined,
            description: registration.description || undefined,
        });

        // Upsert contact in CRM
        const contactResult = await upsertContact({
            email: registration.email,
            first_name: registration.firstName,
            last_name: registration.lastName,
            mobile_phone: registration.officePhone || undefined,
            office_phone: registration.officePhone || undefined,
            tags: ["biostack", "registered-client"],
        });

        // Store CRM IDs
        const updates = {};
        if (accountResult?.id) updates.crmAccountId = accountResult.id;
        if (contactResult?.id) updates.crmContactId = contactResult.id;

        if (Object.keys(updates).length > 0) {
            await Registration.findByIdAndUpdate(registrationId, { $set: updates });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully pushed to CRM",
            data: {
                accountId: accountResult?.id || null,
                contactId: contactResult?.id || null,
            },
        });
    } catch (error) {
        console.error("Error pushing to CRM:", error);
        return NextResponse.json(
            { success: false, error: "Failed to push to CRM" },
            { status: 500 }
        );
    }
}
