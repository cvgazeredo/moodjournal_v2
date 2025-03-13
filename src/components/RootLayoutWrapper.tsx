"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";

export function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // List of paths where we don't want to show any navigation
  const noNavPaths = ['/auth/login', '/auth/register'];
  
  // List of paths that are part of the dashboard
  const dashboardPaths = ['/dashboard'];

  const isNoNavPath = noNavPaths.some(path => pathname.startsWith(path));
  const isDashboardPath = dashboardPaths.some(path => pathname.startsWith(path));

  // Redirect to dashboard if user is logged in and trying to access root
  useEffect(() => {
    if (session?.user && pathname === '/') {
      router.replace('/dashboard');
    }
  }, [session, pathname, router]);

  // Don't show navbar on auth pages or dashboard pages
  const showNavbar = !isNoNavPath && !isDashboardPath && !session;

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
} 