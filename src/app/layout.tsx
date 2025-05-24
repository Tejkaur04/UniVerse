import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background'; // Added import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UniVerse',
  description: 'Navigate your university journey with UniVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        geistSans.variable, 
        geistMono.variable, 
        "antialiased min-h-screen flex flex-col relative" // Added relative for z-indexing context if needed
        )}>
        <StarryBackground /> {/* Added StarryBackground component */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block text-lg">
                UniVerse
              </span>
            </Link>
            {/* Add navigation items here if needed */}
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10"> {/* Added z-10 to ensure main content is above background */}
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
