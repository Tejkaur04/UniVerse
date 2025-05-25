
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google'; // Reverted from Geist
import {
  Waypoints, // UniVerse Logo
  UsersRound, // Study Sphere
  CalendarDays, // Event Horizon
  MessageCircleQuestion, // Celestial Chats
  Lightbulb, // Nebula of Ideas
  UserRound,
  LogOut,
  Loader2,
  LogInIcon
} from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Mock Auth
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarryBackground from '@/components/starry-background'; // UniVerse background
import AlienGuide from '@/components/AlienGuide'; // UniVerse guide
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
});

const navFeatures = [
  { href: "/study-sphere", label: "Study Sphere", icon: UsersRound },
  { href: "/event-horizon", label: "Event Horizon", icon: CalendarDays },
  { href: "/celestial-chats", label: "Celestial Chats", icon: MessageCircleQuestion },
  { href: "/nebula-of-ideas", label: "Nebula of Ideas", icon: Lightbulb },
];

function AppContent({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !loading && !user && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isMounted, user, loading, pathname, router]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (loading && !['/login', '/signup'].includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !loading && !['/login', '/signup'].includes(pathname)) {
    // This ensures that if not logged in and not on auth pages, user is shown loading then redirected by useEffect
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Waypoints className="h-7 w-7 text-primary" />
            <span className="font-bold sm:inline-block text-xl font-mono text-primary">
              UniVerse
            </span>
          </Link>

          <nav className="ml-auto flex items-center space-x-1 sm:space-x-2">
            {navFeatures.map((feature) => (
              <Tooltip key={feature.label}>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="icon" className="text-foreground/80 hover:text-accent-foreground hover:bg-accent/20 rounded-md overflow-hidden">
                    <Link href={feature.href}>
                      <feature.icon className="h-5 w-5" />
                      <span className="sr-only">{feature.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-card border-primary/50 text-foreground">
                  <p>{feature.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 ml-2">
                    <Avatar className="h-9 w-9 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserRound size={20}/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-primary/50" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">Logged In (Demo)</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={async () => {
                    await logout(); 
                    router.push('/login'); 
                  }} className="hover:!bg-primary/20 focus:!bg-primary/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out (Demo)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              (pathname !== '/login' && pathname !== '/signup') && (
                <Button asChild variant="outline" size="sm" className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link href="/login">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Login/Sign Up
                  </Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-8 px-4 z-10 relative">
        {children}
      </main>
      {/* Render AlienGuide globally if user is logged in and not on auth pages */}
      {user && !['/login', '/signup'].includes(pathname) && <AlienGuide />}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, robotoMono.variable)}>
      <head></head>
      <body
        className={cn(
          "antialiased min-h-screen flex flex-col relative font-sans" 
      )}>
        <StarryBackground /> {/* UniVerse Starry Background */}
        <AuthProvider>
          <TooltipProvider delayDuration={100}>
             <AppContent>{children}</AppContent>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
