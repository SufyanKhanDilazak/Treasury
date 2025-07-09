import type { Order } from "@/lib/supabase"

interface TopProductsProps {
  orders: Order[]
}

export function TopProducts({ orders }: TopProductsProps) {
  const productStats = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      acc[item.name] = acc[item.name] || { quantity: 0, revenue: 0 }
      acc[item.name].quantity += item.quantity
      acc[item.name].revenue += item.price * item.quantity
    })
    return acc
  }, {} as Record<string, { quantity: number; revenue: number }>)

  const topProducts = Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.name} className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.quantity} sold</p>
          </div>
          <p className="text-sm font-medium">PKR {product.revenue.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}