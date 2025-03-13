'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  // Return null or loading state while checking session
  if (session?.user) {
    return null;
  }

  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
}
