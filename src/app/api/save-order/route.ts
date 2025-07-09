import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { sendOrderNotification } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json()
    const orderNumber = `ORD-${Date.now()}`

    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: orderData.email,
        customer_name: orderData.name,
        customer_phone: orderData.phone,
        shipping_address: {
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zip: orderData.zip,
        },
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Send email notification
    if (newOrder) {
      await sendOrderNotification(newOrder)
    }

    await supabaseAdmin
      .from("customers")
      .upsert(
        {
          email: orderData.email,
          name: orderData.name,
          phone: orderData.phone,
          total_orders: orderData.total_orders || 1,
          total_spent: orderData.total_spent || orderData.total,
        },
        { onConflict: "email" }
      )

    // Revalidate the orders dashboard page
    revalidatePath("/admin/orders")
    revalidatePath("/dashboard/orders")

    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}