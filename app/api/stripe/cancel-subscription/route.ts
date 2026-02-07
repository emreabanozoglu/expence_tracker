import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
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
                error: 'No active subscription to cancel'
            }, { status: 400 });
        }

        // Cancel the subscription at period end (user keeps access until end of billing period)
        const subscriptionResponse = await stripe.subscriptions.update(
            profile.stripe_subscription_id,
            {
                cancel_at_period_end: true,
            }
        );
        const subscription: any = subscriptionResponse;

        // Note: We don't update is_pro in the database yet because the user still has access
        // The webhook will handle updating is_pro when the subscription actually ends

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });

    } catch (error) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
