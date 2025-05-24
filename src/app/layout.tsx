import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Waypoints, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const navLinks = [
  { href: "/study-sphere", label: "Study Sphere", icon: UsersRound },
  { href: "/event-horizon", label: "Event Horizon", icon: CalendarDays },
  { href: "/celestial-chats", label: "Celestial Chats", icon: MessageCircleQuestion },
  { href: "/nebula-of-ideas", label: "Nebula of Ideas", icon: Lightbulb },
];

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
        <TooltipProvider>
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <Waypoints className="h-6 w-6 text-primary" />
                <span className="font-bold sm:inline-block text-lg">
                  UniVerse
                </span>
              </Link>
              <nav className="ml-auto flex items-center space-x-2 lg:space-x-3">
                {navLinks.map((link) => (
                  <Tooltip key={link.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-accent/50 focus:outline-none focus-visible:text-primary focus-visible:bg-accent/50"
                        aria-label={link.label}
                      >
                        <link.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </nav>
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
