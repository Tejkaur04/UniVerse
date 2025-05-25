
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google';
import {
  UserRound,
  LogOut,
  Loader2,
  LogInIcon,
  Home as HomeIcon,
  Waypoints, // Logo icon
  UsersRound as StudySphereIcon,
  CalendarDays,
  MessageCircleQuestion,
  Lightbulb,
} from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarryBackground from '@/components/starry-background';
import AlienGuide from '@/components/AlienGuide';
import UserStatsSidebar from '@/components/UserStatsSidebar';
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

function AppContent({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, logout }
    = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !authLoading && !user && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isMounted, user, authLoading, pathname, router]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (authLoading && !['/login', '/signup'].includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !authLoading && !['/login', '/signup'].includes(pathname)) {
    // This state might be hit briefly if auth takes a moment after mount
    // and before the useEffect redirect kicks in.
    // Or if AuthProvider immediately determines no user (e.g. no stored token).
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  const showSidebarAndGuide = user && !['/login', '/signup'].includes(pathname);

  return (
    <div className="flex min-h-screen">
      {showSidebarAndGuide && <UserStatsSidebar />}
      <div className="flex flex-col flex-grow">
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center px-4">
            {/* UniVerse Logo/Name in Sidebar now */}
            <div className="flex-grow"></div> {/* Pushes user menu to the right */}

            <nav className="flex items-center space-x-1 sm:space-x-2">
              {/* Feature shortcuts removed from here, now in UserStatsSidebar */}
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
                    <DropdownMenuItem asChild className="hover:!bg-primary/20 focus:!bg-primary/20 cursor-pointer">
                        <Link href="/">
                            <HomeIcon className="mr-2 h-4 w-4" />
                            <span>Home / Main View</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      await logout(); 
                      router.push('/login'); 
                    }} className="hover:!bg-primary/20 focus:!bg-primary/20 cursor-pointer">
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
        <main className={cn("flex-1 flex flex-col items-center py-8 px-4 md:px-2 z-10 relative", showSidebarAndGuide ? "md:ml-64" : "")}> 
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      {showSidebarAndGuide && <AlienGuide />}
    </div>
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
          <TooltipProvider delayDuration={100}>
             <AppContent>{children}</AppContent>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
