import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/lib/supabase"

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Total Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{customer.name}</span>
              </div>
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone || "N/A"}</TableCell>
            <TableCell>{customer.total_orders}</TableCell>
            <TableCell>PKR {customer.total_spent.toFixed(2)}</TableCell>
            <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}