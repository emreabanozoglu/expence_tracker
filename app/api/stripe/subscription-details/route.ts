import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's profile with subscription ID
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_subscription_id, is_pro')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        if (!profile.is_pro || !profile.stripe_subscription_id) {
            return NextResponse.json({
                status: 'none',
                message: 'No active subscription'
            });
        }

        // Fetch subscription details from Stripe
        const subscriptionResponse = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
        const subscription: any = subscriptionResponse;

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        // Get the price details
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);

        // Determine plan name
        const interval = price.recurring?.interval || 'month';
        const planName = interval === 'year' ? 'Yearly Pro' : 'Monthly Pro';

        return NextResponse.json({
            status: subscription.status,
            planName,
            amount: price.unit_amount || 0,
            currency: price.currency,
            interval: interval,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });

    } catch (error) {
        console.error('Error fetching subscription details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription details' },
            { status: 500 }
        );
    }
}
