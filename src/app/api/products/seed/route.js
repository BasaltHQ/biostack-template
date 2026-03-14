import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

const SEED_PRODUCTS = [
    {
        name: "BioStack NAD+",
        slug: "biostack-nad",
        category: "Cellular Health",
        description:
            "Restore youth at the cellular level. Boost energy, repair DNA, and sharpen your mind.",
        price: 89.0,
    },
    {
        name: "Limitless Neuro",
        slug: "limitless-neuro",
        category: "Cognitive",
        description:
            "Enhance memory, focus, and mental clarity with our advanced nootropic stack.",
        price: 64.0,
    },
    {
        name: "Metabolic Fire",
        slug: "metabolic-fire",
        category: "Weight Management",
        description:
            "Optimize your metabolism to burn fat efficiently and maintain lean muscle mass.",
        price: 55.0,
    },
];

export async function POST() {
    try {
        await connectToDatabase();

        const results = [];
        for (const product of SEED_PRODUCTS) {
            const upserted = await Product.findOneAndUpdate(
                { slug: product.slug },
                { $set: product },
                { upsert: true, new: true }
            );
            results.push(upserted);
        }

        return NextResponse.json(
            {
                success: true,
                message: `Seeded ${results.length} products`,
                data: results,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error seeding products:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
