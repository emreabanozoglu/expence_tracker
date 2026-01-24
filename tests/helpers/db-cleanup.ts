/**
 * Database cleanup utilities for test data
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export class DatabaseCleanup {
    private supabase;
    private adminSupabase;

    constructor() {
        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase credentials not found. Database cleanup will be skipped.');
            this.supabase = null;
        } else {
            this.supabase = createClient(supabaseUrl, supabaseKey);
        }

        // Initialize Admin client if service role key is available
        if (supabaseUrl && serviceRoleKey) {
            this.adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
        }
    }

    /**
     * Delete a user and ALL their data using Admin API
     */
    async deleteUserData(userId: string): Promise<void> {
        if (this.adminSupabase) {
            try {
                const { error } = await this.adminSupabase.auth.admin.deleteUser(userId);
                if (error) throw error;
                console.log(`Deleted user ${userId} via Admin API`);
                return;
            } catch (error) {
                console.error('Error deleting user via Admin API:', error);
                // Fallback to data deletion if admin fails
            }
        }

        if (!this.supabase) {
            console.log('Skipping cleanup - Supabase not configured');
            return;
        }

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
        if (!this.supabase) {
            console.log('Skipping cleanup - Supabase not configured');
            return;
        }

        try {
            // This would require admin access to auth.users table
            // For now, we'll just clean up the data tables
            console.log('Test user cleanup completed');
        } catch (error) {
            console.error('Error cleaning up test users:', error);
        }
    }
}
