import { createClient } from '@supabase/supabase-js'

// Database types for your new schema
export interface Item {
  id: string;
  product_title: string;
  current_listing_price: number;
  brand_name?: string;
  retailer_name?: string;
  product_image_url?: string;
  external_source_url?: string;
  sustainability_rating_score?: number;
  material_composition?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  monthly_spending_limit: number;
  is_student_verified: boolean;
  preferred_brand_list: string[];
  style_tags: string[];
  clothing_size_prefs: string[];
  avatar_url?: string;
  created_at: string;
}

export interface UserWishlist {
  id: string;
  user_id: string;
  item_id: string;
  is_private_board?: boolean;
  notes?: string;
  added_at?: string;
}

export interface PurchaseHistory {
  id: string;
  user_id: string;
  item_id: string;
  final_purchase_price: number;
  estimated_co2_saved_kg?: number;
  estimated_water_saved_litres?: number;
  sustainability_rating_score?: number;
  transaction_date?: string;
}

export interface MonthlyAnalytics {
  id: string;
  user_id: string;
  target_month: string;
  allocated_budget_limit: number;
  total_spent_amount: number;
  total_savings_generated: number;
  updated_at?: string;
}

const SUPABASE_URL = import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Typed database helpers
export const fromProducts = () => supabase.from('items');
export const fromUserWishlists = () => supabase.from('user_wishlists');
export const fromPurchaseHistory = () => supabase.from('purchase_history');
export const fromProfiles = () => supabase.from('profiles');
export const fromMonthlyAnalytics = () => supabase.from('monthly_analytics');
