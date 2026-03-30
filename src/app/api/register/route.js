import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Client from "@/models/Client";

// POST — Public registration (creates a pending registration request)
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            firstName, lastName, email, password,
            officePhone, website,
            billingAddress, shippingAddress,
            industry, description,
        } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: "First name, last name, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if registration already exists
        const existingReg = await Registration.findOne({ email: email.toLowerCase().trim() });
        if (existingReg) {
            return NextResponse.json(
                { error: "A registration request with this email already exists." },
                { status: 409 }
            );
        }

        // Check if client already exists (already approved before)
        const existingClient = await Client.findOne({ email: email.toLowerCase().trim() });
        if (existingClient) {
            return NextResponse.json(
                { error: "An account with this email already exists. Please sign in." },
                { status: 409 }
            );
        }

        const registration = await Registration.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password,
            officePhone: officePhone || "",
            website: website || "",
            billingAddress: billingAddress || {},
            shippingAddress: shippingAddress || {},
            industry: industry || "",
            description: description || "",
        });

        return NextResponse.json(
            { success: true, message: "Registration submitted! Your request is pending approval." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating registration:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { error: "A registration request with this email already exists." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
