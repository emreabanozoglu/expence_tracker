
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return new NextResponse(JSON.stringify({ error: 'Session ID is required' }), { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;

            const supabase = await createClient();

            // Getting the user from session is safer than relying on metadata if possible, 
            // but for now let's use the customer_id association we made earlier.

            // However, we need to know WHICH user to update. 
            // 1. We can use client's auth session (best)
            // 2. We can use metadata from Stripe session if we added it (we did: userId)

            const userId = session.metadata?.userId;

            if (userId) {
                await supabase
                    .from('profiles')
                    .update({
                        is_pro: true,
                        stripe_subscription_id: subscriptionId,
                        stripe_customer_id: customerId,
                        // subscription_end_date: ... (would need to fetch subscription for this, or rely on webhook)
                    })
                    .eq('id', userId);
            } else {
                // Fallback: try to find profile by customer_id if we don't have userId metadata
                await supabase
                    .from('profiles')
                    .update({
                        is_pro: true,
                        stripe_subscription_id: subscriptionId,
                        stripe_customer_id: customerId,
                    })
                    .eq('stripe_customer_id', customerId);
            }


            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Payment not completed' });
        }

    } catch (err: any) {
        console.error('Verify Session Error:', err);
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
