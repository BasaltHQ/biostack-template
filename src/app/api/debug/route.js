import { NextResponse } from "next/server";

// Diagnostic endpoint — DELETE THIS ROUTE after debugging is complete
export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || "NOT SET",
        envVars: {
            SURGE_API_KEY: process.env.SURGE_API_KEY ? `SET (${process.env.SURGE_API_KEY.substring(0, 8)}...)` : "MISSING",
            SURGE_MERCHANT_WALLET: process.env.SURGE_MERCHANT_WALLET ? "SET" : "MISSING",
            DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
            DB_NAME: process.env.DB_NAME || "NOT SET (default: biostack)",
        },
        surgeApiTest: null,
    };

    // Test the actual Surge API call
    try {
        const surgeKey = process.env.SURGE_API_KEY;
        if (!surgeKey) {
            diagnostics.surgeApiTest = { status: "SKIPPED", reason: "No API key available" };
        } else {
            const res = await fetch("https://surge.basalthq.com/api/inventory", {
                method: "GET",
                headers: {
                    "Ocp-Apim-Subscription-Key": surgeKey,
                    "Content-Type": "application/json",
                },
            });

            const text = await res.text();
            let body = null;
            try { body = JSON.parse(text); } catch { body = text; }

            diagnostics.surgeApiTest = {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
                bodyPreview: typeof body === 'string' ? body.substring(0, 500) : body,
            };
        }
    } catch (fetchError) {
        diagnostics.surgeApiTest = {
            status: "FETCH_FAILED",
            error: fetchError.message,
            stack: fetchError.stack,
        };
    }

    return NextResponse.json(diagnostics, { status: 200 });
}
