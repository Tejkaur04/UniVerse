
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading, error: authError, clearError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageError, setPageError] = useState<string | null>(null); // Separate from authError for form-specific issues
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear auth errors when component mounts or authError changes
    clearError();
  }, [clearError]);
  
  useEffect(() => {
    if (authError) {
        setPageError(authError);
    }
  }, [authError]);


  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setPageError(null); // Clear previous page-specific errors
    clearError(); // Clear previous global auth errors

    if (!email || !password) {
      setPageError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        setPageError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
    }

    const result = await login({ email, password });
    
    if (result && 'error' in result && result.error) {
        setPageError(result.error); // Display error from mock login
    } else if (result && 'uid' in result) {
      // Successful mock login handled by useEffect watching `user` state
    } else {
        setPageError("An unexpected issue occurred during mock login.");
    }
    setIsLoading(false);
  };

  // This covers the initial page load flicker before auth state is confirmed (even for mock)
  // And also handles redirect if user becomes available
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm border-border/70">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back to UniVerse!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Log in to continue your cosmic journey (Demo Mode).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pageError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{pageError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="•••••••• (min. 6 chars)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90" disabled={isLoading || authLoading}>
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Log In (Demo)"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
              <Link href="/signup">Sign up here</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
