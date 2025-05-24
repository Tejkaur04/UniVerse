import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function StudySpherePage() {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-15rem)]">
      <Card className="w-full max-w-2xl text-center bg-card/80 backdrop-blur-sm border-border/60 shadow-xl">
        <CardHeader className="pt-8">
          <div className="flex justify-center mb-4">
            <UsersRound className="h-20 w-20 text-accent animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Study Sphere</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">
            Connect with your perfect study partners.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <p className="text-2xl font-semibold text-amber-400 my-6">Feature Coming Soon!</p>
          <p className="mt-2 text-foreground/90 max-w-md mx-auto">
            This is where you'll find tools to connect with students taking the same courses, match study styles, and achieve your academic goals together. Get ready to form your study constellations!
          </p>
          <Button asChild variant="outline" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground hover:text-accent-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
