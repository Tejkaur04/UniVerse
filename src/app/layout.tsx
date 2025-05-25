
"use client"; 

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Geist } from 'next/font/google'; // Removed Geist_Mono as it wasn't used
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


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  // weight: ['300', '400', '500', '700'] // If you need specific weights
});


function AppContent({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // Allow access to landing page even if not logged in.
  if (!user && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
     // This case should be handled by the useEffect redirect, but as a fallback:
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
                      {/* Placeholder for user avatar image if available */}
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
              (pathname !== '/login' && pathname !== '/signup') && (
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
    <html lang="en" className="dark">
      <body 
        className={cn(
          geistSans.variable,
          // geistMono.variable, // Removed as Geist_Mono was removed
          "antialiased min-h-screen flex flex-col relative"
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
