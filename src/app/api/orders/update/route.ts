import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, status, payment_status } = await req.json()
    
    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString()
    }
    
    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status

    const { error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("order_number", orderNumber)

    if (error) throw error

    // Revalidate the orders dashboard page
    revalidatePath("/admin/orders")
    revalidatePath("/dashboard/orders")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}