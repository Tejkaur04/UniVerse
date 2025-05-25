
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google';
import {
  UserRound,
  LogOut,
  Loader2,
  LogInIcon,
  Waypoints,
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
  TooltipProvider,
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
  const { user, loading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine if the current page is public (login/signup)
  // For mock auth, we rely on user state; for real auth, middleware might handle this.
  // This simplified check works with mock auth.
  const isPublicPage = typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/signup');

  const showSidebarAndGuide = isMounted && user;

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // If still authenticating (for real auth this would be important)
  // or if not logged in and trying to access a protected page
  if (authLoading || (!user && !isPublicPage)) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {showSidebarAndGuide && <UserStatsSidebar />}
      
      <div className="flex flex-col flex-grow">
        <header className={cn(
            "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          )}>
          <div className="container flex h-16 max-w-screen-2xl items-center px-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <Waypoints className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
              <span className="font-bold text-xl font-mono text-primary group-hover:text-accent transition-colors">
                UniVerse
              </span>
            </Link>
            
            <div className="flex-grow"></div> 

            <nav className="flex items-center space-x-1 sm:space-x-2">
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
                            <Waypoints className="mr-2 h-4 w-4" /> {/* Using Waypoints as a generic home/dashboard icon */}
                            <span>Home / Main</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { 
                        const authContext = useAuth(); 
                        authContext.logout(); 
                    }} className="hover:!bg-primary/20 focus:!bg-primary/20 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out (Demo)</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                  <Button asChild variant="outline" size="sm" className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href="/login">
                      <LogInIcon className="mr-2 h-4 w-4" />
                      Login/Sign Up
                    </Link>
                  </Button>
              )}
            </nav>
          </div>
        </header>
        <main className={cn(
          "flex-1 flex flex-col py-8 z-10 relative", 
          "md:px-0" 
        )}>
          {/* Added padding p-4 md:p-6 here for border spacing */}
          <div className="w-full max-w-7xl p-4 md:p-6"> 
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
          "min-h-screen bg-background text-foreground font-sans antialiased"
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
