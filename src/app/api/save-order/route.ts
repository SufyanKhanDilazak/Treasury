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
        customer_phone: orderData.phone,
        customer_name: orderData.name,
        shipping_address: {
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
        },
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: 0,
        shipping: orderData.shipping,
        total: orderData.total,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Send order notification
    if (newOrder) {
      await sendOrderNotification(newOrder)
    }

    // Update customer record using phone as key
    await supabaseAdmin
      .from("customers")
      .upsert(
        {
          phone: orderData.phone,
          name: orderData.name,
        },
        { onConflict: "phone" }
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