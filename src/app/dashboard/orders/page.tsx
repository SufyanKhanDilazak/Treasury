import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase"
import { OrdersTable } from "./components/order-table"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export default async function OrdersPage() {
  const orders = await getOrders()

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage all customer orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Total</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.pending}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Processing</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.processing}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivered</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.delivered}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Orders</CardTitle></CardHeader>
        <CardContent><OrdersTable orders={orders} /></CardContent>
      </Card>
    </div>
  )
}