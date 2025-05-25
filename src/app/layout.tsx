
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react'; // Added useState, useEffect
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Geist } from 'next/font/google'; // Changed from next/font/google to next/font directly
import { Waypoints, UserRound, LogOut, Loader2, LogInIcon } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";


const geistSans = Geist({ // Corrected initialization if Geist is directly from next/font/google
  variable: '--font-geist-sans',
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
    // Only attempt redirection after the component has mounted and auth state is settled
    if (isMounted && !loading && !user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
      router.push('/login');
    }
  }, [isMounted, user, loading, pathname, router]);

  if (!isMounted) {
    // Render a consistent placeholder or loader on the server and initial client render
    // This ensures the server and client match before client-specific logic runs
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
    // This state is usually brief as the useEffect above will trigger a redirect.
    // Showing a loader here is good practice.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // User is authenticated, or on a public page, and not loading, and component is mounted
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Waypoints className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
              UniVerse
            </span>
          </Link>

          <div className="ml-auto flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      {/* <AvatarImage src="/path-to-user-image.png" alt={user.email || "User"} /> */}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserRound size={20}/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Logged In</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    await logout();
                    router.push('/login'); // Redirect to login after logout
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              (pathname !== '/login' && pathname !== '/signup') && ( // Only show Login button if not on login/signup pages
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">
                    <LogInIcon className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10">
        {children}
      </main>
    </>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", geistSans.variable)}>
      <head>
        {/* Next.js will automatically inject other head elements here from metadata or child components */}
      </head>
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
