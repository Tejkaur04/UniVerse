
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Telescope } from 'lucide-react'; // Changed icon to Telescope

export default function EventHorizonPage() {
  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl text-center">
      <Button asChild variant="outline" className="mb-10 bg-card hover:bg-accent hover:text-accent-foreground">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Telescope className="h-24 w-24 text-primary mx-auto mb-8 animate-pulse" />
      <h1 className="text-5xl font-bold text-primary mb-6">Event Horizon - Charting Your Course!</h1>
      <p className="text-xl text-muted-foreground mb-4">
        Get ready to explore a universe of campus happenings and opportunities!
      </p>
      <div className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto space-y-3 text-left">
        <p>
          The Event Horizon is currently under construction and will soon be your central telescope for discovering everything exciting happening across UniVerse. Imagine a place where you can:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-foreground/70">
          <li><strong>Browse a comprehensive calendar:</strong> View all listed campus events, workshops, and seminars in one convenient place.</li>
          <li><strong>Filter by your cosmic interests:</strong> Select tags like "Astrophysics," "Coding Comets," "Literary Galaxies," or "Entrepreneurial Expeditions" to see events tailored to you.</li>
          <li><strong>Search for specific stellar events:</strong> Use keywords to pinpoint particular happenings, guest lectures, or career fairs.</li>
          <li><strong>View detailed event transmissions:</strong> Access all you need to know – date, time, location (or virtual coordinates), event descriptions, and organizers.</li>
          <li><strong>RSVP or mark your trajectory:</strong> Indicate your intention to attend events and receive updates or reminders.</li>
          <li><strong>Discover peer-organized star clusters:</strong> Find study sessions, social meetups, and informal gatherings launched by fellow students.</li>
          <li><strong>Share cosmic signals:</strong> Easily spread the word about interesting opportunities with your friends and study groups.</li>
          <li><strong>Receive personalized navigation (Future Feature):</strong> Based on your profile and interests, UniVerse might suggest stellar events you won't want to miss!</li>
        </ul>
        <p className="pt-3 text-center">
          We're working hard to calibrate the sensors and polish the lenses. Prepare for a clear view of your university's vibrant event landscape!
        </p>
      </div>
      <p className="text-md text-accent font-semibold">Stay tuned for launch!</p>
    </div>
  );
}
