import { createClient } from "@supabase/supabase-js"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { error } = await supabaseAdmin.from("orders").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    console.log("Supabase connection successful")
    return true
  } catch (error) {
    console.error("Supabase connection error:", error)
    return false
  }
}

export interface Order {
  id: string
  order_number: string
  customer_email: string
  customer_name: string
  customer_phone?: string
  shipping_address: {
    address: string
    city: string
    state: string
    zip: string
  }
  billing_address?: {
    address: string
    city: string
    state: string
    zip: string
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    selectedSize?: string
    selectedColor?: string
    imageUrl?: string
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "confirmed" | undefined
  payment_status: "pending" | "paid" | "failed" | "refunded" | undefined
  payment_intent_id?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  clerk_user_id?: string
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
}