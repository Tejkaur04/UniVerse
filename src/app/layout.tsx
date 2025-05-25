
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
  Waypoints,
  UsersRound,
  CalendarDays,
  MessageCircleQuestion,
  Lightbulb,
  Settings,
  HelpCircle,
  Home as HomeIcon,
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
  const { user, loading: authLoading, logout } = useAuth();
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

  const isPublicPage = ['/login', '/signup'].includes(pathname);
  
  const showAppStructure = isMounted && (!authLoading || user || isPublicPage);
  const showGlobalLoader = !isMounted || (authLoading && !user && !isPublicPage);

  const showSidebarAndGuide = isMounted && user && !isPublicPage;

  return (
    <div className="flex min-h-screen"> {/* This root div is always rendered */}
      {showSidebarAndGuide && <UserStatsSidebar />}
      
      <div className="flex flex-col flex-grow">
        {showGlobalLoader ? (
          <div className="flex flex-1 items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        ) : showAppStructure ? (
          <>
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                                <HomeIcon className="mr-2 h-4 w-4" />
                                <span>Home / Main View</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                          // await logout(); // Mock logout doesn't need to be async
                          logout(); 
                          router.push('/login');
                        }} className="hover:!bg-primary/20 focus:!bg-primary/20 cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out (Demo)</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    !isPublicPage && ( 
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
            <main className={cn(
              "flex-1 flex flex-col py-8 z-10 relative", 
              showSidebarAndGuide ? "md:ml-[25rem]" : "", 
              "px-4 md:px-0" // Changed from md:pl-0 md:pr-1 to md:px-0
            )}>
              <div className="w-full max-w-7xl">
                {children}
              </div>
            </main>
          </>
        ) : (
          // Fallback for unexpected states
          <div className="flex flex-1 items-center justify-center bg-background">
            <p className="text-lg text-muted-foreground">Initializing UniVerse...</p>
          </div>
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
