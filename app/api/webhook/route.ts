import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();

    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhooks error: ${error.message}`, {status: 400});

    }

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if(event.type === 'checkout.session.completed'){
        if(!userId || !courseId){
            return new NextResponse("Webhook Error: Missing Metadata", {status: 400});
        }

        await db.purchase.create({
            data:{
                courseId,
                userId
            }
        })
    } else {  // here we are using the status code of 200 becausse we don't want stripe to turn off the webhook as it does when there are too many 400 status codes so just because of an unhandled event type we don't use 400
        return new NextResponse(`Webhook Error: Unhandled Event type ${event.type}`, {status: 200});
    }
     // same reason as above
    return new NextResponse(null, {status: 200});
}