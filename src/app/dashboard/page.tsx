import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin, testSupabaseConnection } from "@/lib/supabase"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { RecentOrders } from "./components/recent-orders"
import { SalesChart } from "./components/sales-chart"

async function getDashboardData() {
  const connectionTest = await testSupabaseConnection()
  if (!connectionTest) throw new Error("Failed to connect to database")

  const [ordersResult, customersResult] = await Promise.all([
    supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("customers").select("*"),
  ])

  const orders = ordersResult.data || []
  const customers = customersResult.data || []

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalCustomers = customers.length
  const thisMonth = new Date()
  thisMonth.setDate(1)
  const thisMonthOrders = orders.filter((order) => new Date(order.created_at) >= thisMonth)
  const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0)
  const recentOrders = orders.slice(0, 5)

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    thisMonthRevenue,
    thisMonthOrders: thisMonthOrders.length,
    recentOrders,
    orders,
  }
}

export default async function DashboardPage() {
  let dashboardData;
  try {
    dashboardData = await getDashboardData();
  } catch (error) {
    console.error("Dashboard data error:", error);
    dashboardData = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      thisMonthRevenue: 0,
      thisMonthOrders: 0,
      recentOrders: [],
      orders: [],
    };
  }

  const { totalRevenue, totalOrders, totalCustomers, thisMonthRevenue, thisMonthOrders, recentOrders, orders } = dashboardData

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">PKR {thisMonthRevenue.toFixed(2)} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{thisMonthOrders} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart orders={orders} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}