'use client';

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserDropdown } from "@/components/UserDropdown";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  // If user is logged in, redirect to dashboard
  React.useEffect(() => {
    if (session?.user) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Don't render navbar if user is logged in
  if (session?.user) return null;

  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                MoodJournal
              </span>
            </Link>
            <div className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex md:gap-4">
              <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 py-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button variant="ghost" asChild className="justify-start text-muted-foreground hover:text-primary">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </Container>
    </header>
  );
} 