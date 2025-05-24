import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Waypoints } from 'lucide-react'; // Changed from Rocket to Waypoints
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background';

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
        "antialiased min-h-screen flex flex-col relative"
        )}>
        <StarryBackground />
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Waypoints className="h-6 w-6 text-primary" /> {/* Changed Icon */}
              <span className="font-bold sm:inline-block text-lg">
                UniVerse
              </span>
            </Link>
            {/* Basic Navigation (optional, dashboard cards serve as primary nav from home) */}
            {/*
            <nav className="flex items-center space-x-4 lg:space-x-6 text-sm">
              <Link href="/study-sphere" className="transition-colors hover:text-primary">Study Sphere</Link>
              <Link href="/event-horizon" className="transition-colors hover:text-primary">Event Horizon</Link>
              <Link href="/celestial-chats" className="transition-colors hover:text-primary">Celestial Chats</Link>
              <Link href="/nebula-of-ideas" className="transition-colors hover:text-primary">Nebula of Ideas</Link>
            </nav>
            */}
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
