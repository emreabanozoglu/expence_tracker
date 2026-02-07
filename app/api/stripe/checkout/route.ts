import { createClient } from '@/lib/supabase/server';
import { stripe, getURL } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { priceId, mode } = await request.json();
        const supabase = await createClient(); // Use createClient (async)

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) {
            console.error('Profile not found for user:', user.id);
            // handle case where profile doesn't exist?
        }

        // If user already has a Stripe customer ID, use it.
        let customerId = profile?.stripe_customer_id;
        console.log('Customer ID from profile:', customerId);

        if (!customerId) {
            console.log('Creating new Stripe customer...');
            const customerData: { email?: string; metadata: { supabaseUUID: string } } = {
                metadata: {
                    supabaseUUID: user.id,
                },
            };
            if (user.email) customerData.email = user.email;

            const customer = await stripe.customers.create(customerData);
            customerId = customer.id;
            console.log('Created Stripe customer:', customerId);

            // Update profile with stripe_customer_id
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        console.log('Creating Stripe session for price:', priceId);
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode || 'subscription', // 'subscription' or 'payment'
            success_url: `${getURL()}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${getURL()}`,
            metadata: {
                userId: user.id
            },
            // subscription_data: {
            //     metadata: {
            //         userId: user.id
            //     }
            // }
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Checkout API Error:', err);
        return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
