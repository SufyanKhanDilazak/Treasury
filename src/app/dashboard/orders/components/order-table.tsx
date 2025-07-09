"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { RefreshCw, Eye, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/supabase"
import Image from "next/image"

// Define the OrderItem type to match your Supabase Order interface
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
  imageUrl?: string
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  // Define allowed statuses with const assertion to narrow types
  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
  const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;

  async function updateOrder(orderNumber: string, updates: Partial<Order>) {
    try {
      const response = await fetch("/api/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, ...updates }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.order_number === orderNumber ? { ...o, ...updates } : o))
        )
        toast.success("Order updated successfully")
      } else {
        throw new Error(result.error || "Update failed")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Failed to update order")
    }
  }

  async function refreshOrders() {
    setIsRefreshing(true)
    try {
      router.refresh()
      toast.success("Orders refreshed")
    } catch (error) {
      console.error("Error refreshing orders:", error)
      toast.error("Failed to refresh orders")
    } finally {
      setIsRefreshing(false)
    }
  }

  const getTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemsSummary = (items: OrderItem[]) => {
    if (items.length === 0) return "No items"
    if (items.length === 1) {
      return `${items[0].name} (${items[0].quantity})`
    }
    return `${items[0].name} (${items[0].quantity}) +${items.length - 1} more`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={refreshOrders} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-sm truncate">{getItemsSummary(order.items)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getTotalItems(order.items)} items
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {orderStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => updateOrder(order.order_number, { status })}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                        {order.payment_status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {paymentStatuses.map((paymentStatus) => (
                        <DropdownMenuItem
                          key={paymentStatus}
                          onClick={() => updateOrder(order.order_number, { payment_status: paymentStatus })}
                        >
                          {paymentStatus}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="font-medium">PKR {order.total.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Order Details - {order.order_number}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Customer Information</h3>
                            <div className="space-y-1 text-sm">
                              <p><strong>Name:</strong> {order.customer_name}</p>
                              <p><strong>Email:</strong> {order.customer_email}</p>
                              <p><strong>Phone:</strong> {order.customer_phone}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <div className="text-sm">
                              <p>{order.shipping_address.address}</p>
                              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h3 className="font-semibold mb-3">Order Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                  <Image 
                                    src={item.imageUrl || "/placeholder.svg"} 
                                    alt={item.name || "Product"} 
                                    fill 
                                    className="object-cover" 
                                    sizes="64px" 
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                                    {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: PKR {item.price.toFixed(2)} each</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                          <h3 className="font-semibold mb-3">Order Summary</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>PKR {order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>PKR {order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>PKR {order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                              <span>Total:</span>
                              <span>PKR {order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}