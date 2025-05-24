
"use client"; 

import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Waypoints } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background';
import { TooltipProvider } from "@/components/ui/tooltip";


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body 
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col relative"
      )}>
        <StarryBackground />
        <TooltipProvider> {/* TooltipProvider can remain if other tooltips are used elsewhere */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Waypoints className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block text-lg">
                  UniVerse
                </span>
              </Link>
              
              {/* Simplified header: Removed nav links and user avatar/dropdown */}
              <div className="ml-auto flex items-center space-x-2">
                {/* Placeholder for any future, non-auth related header items */}
              </div>
            </div>
          </header>
        </TooltipProvider>
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
