
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Users, UserRound, LogOut, Loader2, LogInIcon } from 'lucide-react';
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
            <Users className="h-6 w-6 text-primary" /> {/* Changed Icon */}
            <span className="font-bold sm:inline-block text-lg font-mono">
              PeerConnect {/* Changed App Name */}
            </span>
          </Link>

          <nav className="ml-auto flex items-center space-x-1 sm:space-x-2">
            {/* Navbar feature shortcuts removed */}
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
                    await logout(); 
                    router.push('/login'); 
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out (Demo)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              (pathname !== '/login' && pathname !== '/signup') && (
                <Button asChild variant="outline" size="sm" className="ml-2"> {/* Removed accent colors */}
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
      <main className="flex-1 flex flex-col items-center py-8 px-4 z-10 relative"> {/* Removed justify-start */}
        {children}
      </main>
      {/* AlienGuide removed */}
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
        {/* StarryBackground removed */}
        <AuthProvider>
          {/* TooltipProvider removed as navbar shortcuts are gone, can be added back if needed */}
             <AppContent>{children}</AppContent>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
