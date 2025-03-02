/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLinkedInPost, LinkedInPostProps } from "@/app/actions";
import { getApolloClient } from "@/graphql/apollo-client";
import { UpdateJobStatusMutation } from "@/graphql/generated";
import { UPDATE_JOB_STATUS } from "@/graphql/queries";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const apolloClient = getApolloClient();

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            // "whsec_b052a201b08d7034feb4091b713a754a1f6c19382be07dc6d399066081508c53"
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }
    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object as Stripe.Checkout.Session;
                const successUrl = new URL(session.success_url!);
                const submissionId =
                    successUrl.searchParams.get("submission_id");

                if (submissionId) {
                    const { data, errors } =
                        await apolloClient.mutate<UpdateJobStatusMutation>({
                            mutation: UPDATE_JOB_STATUS,
                            variables: { submissionId, status: "ACTIVE" },
                        });

                    if (errors) {
                        console.error("Error updating job status:", errors);
                    }

                    if (data?.updateJobStatus) {
                        const jobData: LinkedInPostProps = {
                            company: data?.updateJobStatus?.company,
                            title: data?.updateJobStatus?.title,
                            location: data?.updateJobStatus?.location,
                            remote: data?.updateJobStatus?.remote ?? false,
                            featured: data?.updateJobStatus?.featured,
                            id: data?.updateJobStatus?.id,
                        };

                        createLinkedInPost(jobData);
                    }
                }

                break;
            default:
            // Unexpected event type
        }
    } catch (err: any) {
        console.dir(err, { depth: Infinity });
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    return NextResponse.json({ received: true });
}
