'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Calendar,
  Settings,
  Home,
  BookOpen,
  Target,
  User,
  PenLine,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home
  },
  {
    name: "Daily Entry",
    href: "/dashboard/daily-entry",
    icon: PenLine
  },
  {
    name: "Journal",
    href: "/dashboard/journal",
    icon: BookOpen
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart
  },
  {
    name: "Goals",
    href: "/dashboard/goals",
    icon: Target
  },
];

const secondaryNavigation = [
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            MoodJournal
          </span>
        </Link>
      </div>

      <div className="flex-1 space-y-1 px-3">
        <div className="space-y-2">
          <div className="px-3">
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Menu</h2>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="px-3 pt-6">
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Settings</h2>
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 