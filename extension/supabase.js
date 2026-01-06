// Supabase configuration
// These will be injected during build
const SUPABASE_URL = 'https://isvfiygutglfklttsrxs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wwZrGD17K-SJznJXAoeb4g_pr-xQoMS';

// Initialize Supabase client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in popup.js
window.supabaseClient = supabase;
