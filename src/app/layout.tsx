
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google'; 
import { usePathname, useRouter } from 'next/navigation'; 
import {
  UserRound,
  LogOut,
  Loader2,
  LogInIcon,
  Waypoints, 
  UsersRound,
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
import UserStatsSidebar from '@/components/UserStatsSidebar'; 
import AlienGuide from '@/components/AlienGuide';
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
  const { user, loading: authLoading, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const isPublicPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !authLoading && !user && !isPublicPage) {
      router.push('/login');
    }
  }, [isMounted, authLoading, user, isPublicPage, router, pathname]); 

  const showSidebarAndGuide = isMounted && user && !isPublicPage;


  // Consistent root structure for AppContent
  return (
    <div className="flex min-h-screen">
      {showSidebarAndGuide && <UserStatsSidebar />}
      
      <div className="flex flex-col flex-grow">
        {(!isMounted || authLoading) && !isPublicPage && user == null ? ( // Show main loader if not mounted OR auth is loading (and not on public page without user)
           <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        ) : !user && !isPublicPage ? ( // Show loader if no user and not on public page (during redirect phase)
            <div className="flex items-center justify-center flex-1">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        ) : ( // Render main app content
          <>
            <header className={cn(
                "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
              )}>
              <div className="container flex h-16 max-w-screen-2xl items-center px-4">
                <Link href="/" className="flex items-center space-x-2 group mr-6">
                  <Waypoints className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                  <span className="font-bold text-xl font-mono text-primary group-hover:text-accent transition-colors">
                    UniVerse
                  </span>
                </Link>
                
                <div className="flex-grow"></div> 

                <nav className="flex items-center space-x-1 sm:space-x-2">
                  {/* Feature Icons removed from here as they are in UserStatsSidebar now */}
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
                                <Waypoints className="mr-2 h-4 w-4" />
                                <span>Home / Main</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { 
                            logout(); 
                            router.push('/login'); 
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
              "flex-1 flex flex-col z-10 relative", 
              showSidebarAndGuide ? "md:ml-[25rem]" : "", 
              "px-4 md:px-0" // No horizontal padding on main for md+, sidebar offset handles it
            )}>
              <div className="w-full max-w-7xl p-4 md:py-6 md:px-4"> {/* Content wrapper with padding */}
                {children}
              </div>
            </main>
          </>
        )}
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

