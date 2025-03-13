'use client';

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function CTA() {
  const { data: session } = useSession();

  return (
    <section className="py-20 bg-primary/5">
      <Container>
        <div className="relative rounded-3xl overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground max-w-2xl">
              Start Your Journey to Better Emotional Health Today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Join thousands of users who have transformed their lives through better emotional awareness and understanding.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {session ? (
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link href="/auth/register">Get Started Now</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    asChild
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
            {!session && (
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required • Free 14-day trial
              </p>
            )}
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-primary/5" />
            <svg
              className="absolute left-0 top-0 h-full w-full"
              width="100%"
              height="100%"
              viewBox="0 0 800 400"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 0 Q 400 100 800 0 L 800 400 Q 400 300 0 400 Z"
                fill="currentColor"
                className="text-primary/[0.07] dark:text-primary/[0.02]"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
} 