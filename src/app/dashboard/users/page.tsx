import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseAdmin } from "@/lib/supabase"
import { CustomersTable } from "./components/customers-table"

async function getCustomers() {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">View all customer details</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Customers ({customers.length})</CardTitle></CardHeader>
        <CardContent><CustomersTable customers={customers} /></CardContent>
      </Card>
    </div>
  )
}