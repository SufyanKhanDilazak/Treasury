import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";
import { CustomersTable } from "./components/customers-table";

// ✅ Prevent build-time prerender; always render at request time
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCustomers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getCustomers error:", e);
    // ✅ Safe fallback so render doesn’t crash if DB is unreachable
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">View all customer details</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
