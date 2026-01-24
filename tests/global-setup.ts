/**
 * Global setup for Playwright tests
 * Loads environment variables from .env.local
 */

import dotenv from 'dotenv';
import path from 'path';

async function globalSetup() {
    // Load .env.local file
    dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

    console.log('Environment variables loaded for tests');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Loaded' : '✗ Missing');
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? '✓ Loaded' : '✗ Missing');
}

export default globalSetup;
