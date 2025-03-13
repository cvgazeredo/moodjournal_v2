'use client';

import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <DashboardNav />
        <main>{children}</main>
      </div>
    </div>
  );
} 