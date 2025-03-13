'use client';

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Hero() {
  const { data: session } = useSession();

  return (
    <div className="relative overflow-hidden bg-background pt-[6.4rem]">
      <Container className="relative">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Unlock Your Emotional Wellness
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl">
                Discover the power of understanding your emotions. Our app helps you track your mood daily, identify patterns, and take control of your mental well-being. Start your journey towards better emotional health today!
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {session ? (
                <Button size="lg" className="shadow-lg bg-primary hover:bg-primary/90" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="shadow-lg bg-primary hover:bg-primary/90" asChild>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10 hover:text-primary" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] lg:max-w-[640px]">
              <svg
                className="w-full h-auto"
                viewBox="0 0 550 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Meditation figure */}
                <circle cx="275" cy="250" r="150" className="fill-primary/10" />
                <path
                  d="M275 150c41.4 0 75 33.6 75 75s-33.6 75-75 75-75-33.6-75-75 33.6-75 75-75z"
                  className="fill-primary/20"
                />
                <path
                  d="M275 180c24.8 0 45 20.2 45 45s-20.2 45-45 45-45-20.2-45-45 20.2-45 45-45z"
                  className="fill-primary"
                />
                
                {/* Floating elements */}
                <circle cx="150" cy="150" r="20" className="fill-primary/30" />
                <circle cx="400" cy="350" r="25" className="fill-primary/40" />
                <circle cx="450" cy="150" r="15" className="fill-primary/20" />
                <circle cx="100" cy="350" r="30" className="fill-primary/15" />
                
                {/* Decorative lines */}
                <path
                  d="M150 250c50-20 100-20 150 0s100 20 150 0"
                  stroke="currentColor"
                  className="stroke-primary/30"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M100 300c100-40 200-40 300 0"
                  stroke="currentColor"
                  className="stroke-primary/20"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 