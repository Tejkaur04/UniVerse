
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Waypoints, UserRound, LogOut, Loader2, LogInIcon, UsersRound as StudySphereIcon, CalendarDays as EventHorizonIcon, MessageCircleQuestion as CelestialChatsIcon, Lightbulb as NebulaOfIdeasIcon } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Removed AvatarImage as it's not used for fallback
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AlienGuide from '@/components/AlienGuide';

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
  { href: "/study-sphere", Icon: StudySphereIcon, label: "Study Sphere" },
  { href: "/event-horizon", Icon: EventHorizonIcon, label: "Event Horizon" },
  { href: "/celestial-chats", Icon: CelestialChatsIcon, label: "Celestial Chats" },
  { href: "/nebula-of-ideas", Icon: NebulaOfIdeasIcon, label: "Nebula of Ideas" },
];

function AppContent({ children }: { children: ReactNode }) {
  const { user, loading, logout, error: authError } = useAuth(); // Added authError
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simplified redirection logic
  useEffect(() => {
    if (isMounted && !loading && !user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
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
  
  // Show loader if auth is loading AND we are not on a public page (/, /login, /signup)
  // or if we are trying to redirect.
  if (loading && !['/', '/login', '/signup'].includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated and trying to access a protected page
  if (!user && !loading && !['/', '/login', '/signup'].includes(pathname)) {
     // This case should ideally be handled by the useEffect redirect,
     // but as a fallback, show a loader or minimal content.
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
            <Waypoints className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg font-mono">
              UniVerse
            </span>
          </Link>

          <nav className="ml-auto flex items-center space-x-1 sm:space-x-2"> {/* Reduced space-x slightly */}
            {navFeatures.map((feature) => (
              <Tooltip key={feature.href}>
                <TooltipTrigger asChild>
                  <Button 
                    asChild 
                    variant="ghost" 
                    size="icon" // Uses h-10 w-10 by default
                    className="text-foreground/80 hover:text-accent hover:bg-accent/10 rounded-md" // Ensure rounded-md for hover bg
                  >
                    <Link href={feature.href}>
                      <feature.Icon className="h-5 w-5" /> {/* Icon size is 5, button is 10. Good padding. */}
                      <span className="sr-only">{feature.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{feature.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 ml-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserRound size={20}/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Logged In (Demo)</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    await logout(); // This is the mock logout
                    router.push('/login'); 
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out (Demo)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              (pathname !== '/login' && pathname !== '/signup') && (
                <Button asChild variant="outline" size="sm" className="ml-2 bg-accent text-accent-foreground hover:bg-accent/90">
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
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10 relative"> {/* Added relative for main content */}
        {children}
      </main>
      <AlienGuide /> {/* AlienGuide is global */}
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
        <StarryBackground />
        <AuthProvider>
          <TooltipProvider>
             <AppContent>{children}</AppContent>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
