import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://isvfiygutglfklttsrxs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wwZrGD17K-SJznJXAoeb4g_pr-xQoMS';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
