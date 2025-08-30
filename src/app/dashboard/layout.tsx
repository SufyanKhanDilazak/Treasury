import type { Metadata } from "next";
import type React from "react";
import { DashboardHeader } from "./components/dashboard-header";

export const metadata: Metadata = {
  title: "Admin Dashboard | Treasury",
  description:
    "Admin console for Treasury—manage products (bags, perfumes, footwear), inventory, orders, customers, and analytics.",
  applicationName: "Treasury",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
