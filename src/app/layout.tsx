
"use client"; // Required for hooks like usePathname, useRouter, useEffect

import type { Metadata } from 'next'; // Keep this for potential static metadata
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Waypoints, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, UserRound as UserIconLucide, LogOut, Loader2, Settings, Mail } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import StarryBackground from '@/components/starry-background';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Static metadata can be defined here if needed, but dynamic title based on auth state is tricky
// export const metadata: Metadata = {
//   title: 'UniVerse',
//   description: 'Navigate your university journey with UniVerse.',
// };

const navLinks = [
  { href: "/study-sphere", label: "Study Sphere", icon: UsersRound },
  { href: "/event-horizon", label: "Event Horizon", icon: CalendarDays },
  { href: "/celestial-chats", label: "Celestial Chats", icon: MessageCircleQuestion },
  { href: "/nebula-of-ideas", label: "Nebula of Ideas", icon: Lightbulb },
];

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="sr-only">Loading UniVerse...</p>
      </div>
    );
  }

  if (!user && pathname !== '/login' && pathname !== '/signup') {
     // This case should ideally be handled by the useEffect redirect,
     // but as a fallback, show loader or minimal content.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
         <p className="sr-only">Redirecting to login...</p>
      </div>
    );
  }
  
  // Allow login and signup pages to render without the main layout's protected content logic
  if (pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
  }


  return (
    <div className={cn(
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
            
            {user && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Tooltip key={link.label}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-accent/50">
                      <Link href={link.href} aria-label={link.label}>
                        <link.icon className="h-5 w-5" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
            )}

            <div className="ml-auto flex items-center space-x-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                        <AvatarFallback>
                          <UserIconLucide className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "UniVerse User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Add more items like Profile, Settings if needed */}
                    {/* <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={async () => {
                        await logout();
                        router.push('/login'); // Ensure redirect after logout
                      }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-accent/50">
                        <Link href="/login" aria-label="Login">
                           <UserIconLucide className="h-5 w-5" />
                        </Link>
                     </Button>
                  </TooltipTrigger>
                   <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                    <p>Login / Sign Up</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </header>
      </TooltipProvider>
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 z-10">
        {children}
      </main>
      <Toaster />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
