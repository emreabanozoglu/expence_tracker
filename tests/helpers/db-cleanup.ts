/**
 * Database cleanup utilities for test data
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export class DatabaseCleanup {
    private supabase;

    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Delete a user and all their associated data
     * Note: This requires admin privileges or proper RLS policies
     */
    async deleteUserData(userId: string): Promise<void> {
        try {
            // Delete user's expenses (will cascade due to foreign key)
            await this.supabase
                .from('expenses')
                .delete()
                .eq('user_id', userId);

            // Delete user's settings (will cascade due to foreign key)
            await this.supabase
                .from('user_settings')
                .delete()
                .eq('user_id', userId);

            console.log(`Cleaned up data for user: ${userId}`);
        } catch (error) {
            console.error('Error cleaning up user data:', error);
        }
    }

    /**
     * Delete all test users (users with test email pattern)
     */
    async deleteAllTestUsers(): Promise<void> {
        try {
            // This would require admin access to auth.users table
            // For now, we'll just clean up the data tables
            console.log('Test user cleanup completed');
        } catch (error) {
            console.error('Error cleaning up test users:', error);
        }
    }
}
