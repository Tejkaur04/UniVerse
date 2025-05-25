
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Waypoints } from 'lucide-react';

export default function DashboardMovedPage() {
  return (
    <div className="container mx-auto px-4 py-12 w-full text-center">
      <Waypoints className="h-24 w-24 text-primary mx-auto mb-8 animate-pulse" />
      <h1 className="text-4xl font-bold text-primary mb-6">Dashboard Has Evolved!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        The UniVerse dashboard features are now integrated into our main landing page for a more streamlined experience.
      </p>
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/">
          Explore UniVerse Home
        </Link>
      </Button>
    </div>
  );
}
