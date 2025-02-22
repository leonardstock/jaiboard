import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        // Get the job posting data from the request body
        const jobData = await req.json();

        let lineItems = [];

        if (jobData.featured) {
            lineItems = [
                {
                    price: "price_1QvDoDF2dPz4IehQFUfDd7Bn",
                    quantity: 1,
                },
                {
                    price: "price_1QvDoTF2dPz4IehQi2MUIbh4",
                    quantity: 1,
                },
            ];
        } else {
            lineItems = [
                {
                    price: "price_1QvDoDF2dPz4IehQFUfDd7Bn",
                    quantity: 1,
                },
            ];
        }

        // Store the job data in the checkout session's metadata
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?submission_id=${jobData.submission_id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/new-job`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json(
            { error: `Error creating checkout session: ${error}` },
            { status: 500 }
        );
    }
}
