import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

export async function POST(req: Request) {
    const body = await req.text();
    // Headers are async in Next.js 15+, but in 14 they were sync.
    // Assuming Next 15 based on `next: 16.1.4` in package.json (likely Next 15 canary or similar).
    // Actually, `next: 16.1.4` sounds very new. Let's stick to standard `headers()`.
    const headersList = await headers();
    const sig = headersList.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return new NextResponse('Webhook secret not found', { status: 400 });
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Error message: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        const supabase = await createClient();
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription as string;
                        const customerId = checkoutSession.customer as string;

                        // Fulfill the purchase...
                        await supabase
                            .from('profiles')
                            .update({
                                is_pro: true,
                                stripe_subscription_id: subscriptionId,
                                stripe_customer_id: customerId,
                            })
                            .eq('stripe_customer_id', customerId);
                        // Note: We might need to map userId here if customerId wasn't already in DB?
                        // But create-checkout session ensures we create customer and save ID first.
                        // Fallback: use metadata if available.
                    }
                    break;
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    const status = subscription.status === 'active';

                    await supabase
                        .from('profiles')
                        .update({
                            is_pro: status,
                            subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
                        })
                        .eq('stripe_subscription_id', subscription.id);
                    break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (error) {
            console.error(error);
            return new NextResponse('Webhook handler failed. View logs.', { status: 400 });
        }
    }

    return new NextResponse(JSON.stringify({ received: true }));
}
