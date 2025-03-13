import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoodJournal - Track Your Emotional Well-being",
  description: "Track your daily emotions, identify patterns, and improve your mental well-being with MoodJournal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <Providers>
          <RootLayoutWrapper>
            {children}
          </RootLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
