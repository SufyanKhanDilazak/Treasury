import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/supabase"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{order.customer_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium">{order.customer_name}</p>
            <p className="text-xs text-muted-foreground">{order.order_number}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
            <p className="text-sm font-medium">PKR {order.total.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}