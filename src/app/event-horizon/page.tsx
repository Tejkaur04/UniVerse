
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Telescope, CalendarDays, Search, Tag, Users, Share2, Sparkles as RecommendIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';

interface CampusEvent {
  id: string;
  type: 'official' | 'peer';
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  tags: string[];
  icon: LucideIcon;
  dataAiHint?: string;
}

const hardcodedEvents: CampusEvent[] = [
  {
    id: "event1",
    type: 'official',
    title: "Guest Lecture: The Future of Quantum Computing",
    date: "November 20, 2024",
    time: "4:00 PM UTC",
    location: "Main Auditorium",
    description: "Join Prof. Anya Sharma as she discusses breakthroughs in quantum computing.",
    organizer: "Dept. of Physics",
    tags: ["Academia", "Tech", "Physics"],
    icon: CalendarDays,
    dataAiHint: "lecture hall"
  },
  {
    id: "event2",
    type: 'official',
    title: "Career Fair: Tech & Engineering",
    date: "November 25, 2024",
    time: "10:00 AM - 3:00 PM UTC",
    location: "University Grand Hall",
    description: "Connect with leading tech companies and explore internship/job opportunities.",
    organizer: "Career Services",
    tags: ["Career", "Tech", "Engineering"],
    icon: Users,
    dataAiHint: "career fair"
  },
  {
    id: "event3",
    type: 'peer',
    title: "Astro 101 Study Group - Midterm Prep",
    date: "November 15, 2024",
    time: "6:00 PM UTC",
    location: "Library Room 4B / Virtual",
    description: "Collaborative review session for the upcoming Astrophysics 101 midterm.",
    organizer: "Alex Cosmo (Student)",
    tags: ["Study Group", "Astrophysics"],
    icon: Users,
    dataAiHint: "students studying"
  },
];

const interestTags = ["Academia", "Tech", "Physics", "Career", "Engineering", "Study Group", "Astrophysics", "Arts", "Sports", "Social"];


export default function EventHorizonPage() {
  const { toast } = useToast();

  const handleDemoAction = (message: string) => {
    toast({
      title: "Demo Action",
      description: message,
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl">
      <div className="mb-8 text-center">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground absolute top-6 left-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to UniVerse Home
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-4 pt-16 sm:pt-0">
          <Telescope className="h-16 w-16 text-primary mr-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-primary font-mono">Event Horizon</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-6">
          Discover exciting campus events, workshops, and seminars. Your telescope to opportunities!
        </p>
        <Card className="bg-card/80 backdrop-blur-sm border-primary/30 shadow-lg p-6 mb-10 text-left">
          <CardTitle className="text-2xl text-primary mb-3 flex items-center">
            <RecommendIcon className="h-7 w-7 mr-3 text-accent animate-pulse" />
            What You'll Discover (Coming Soon!):
          </CardTitle>
          <ul className="list-disc list-inside space-y-2 text-foreground/90">
            <li><strong className="text-accent/90">Comprehensive Calendar:</strong> View all listed campus events, workshops, and seminars in one place.</li>
            <li><strong className="text-accent/90">Filter by Interests:</strong> Select tags like "coding," "literature," "sports," or "entrepreneurship" to find relevant events.</li>
            <li><strong className="text-accent/90">Keyword Search:</strong> Use keywords to find particular happenings you're interested in.</li>
            <li><strong className="text-accent/90">Detailed Info:</strong> Access date, time, location, description, and organizer details for each event.</li>
            <li><strong className="text-accent/90">RSVP & Interest:</strong> Indicate your attendance to stay updated.</li>
            <li><strong className="text-accent/90">Peer Events:</strong> Find study sessions and informal gatherings organized by fellow students.</li>
            <li><strong className="text-accent/90">Share with Friends:</strong> Easily spread the word about interesting opportunities.</li>
            <li><strong className="text-accent/90">Personalized Recommendations:</strong> Get event suggestions based on your profile and interests!</li>
          </ul>
          <p className="mt-4 text-center text-primary font-semibold">Stay tuned, explorer! The Event Horizon is expanding.</p>
        </Card>
      </div>

      <div className="space-y-10">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Search className="mr-3 h-7 w-7 text-accent" />Filter Your Cosmos (Demo)</CardTitle>
            <CardDescription>Search for specific events or filter by your interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              type="search" 
              placeholder="Search by keywords (e.g., 'Quantum', 'Career Fair')..." 
              className="bg-background/70"
              onChange={(e) => handleDemoAction(`Searching for: ${e.target.value} (Demo)`)}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/90">Filter by Interests:</p>
              <div className="flex flex-wrap gap-2">
                {interestTags.map(tag => (
                  <Button 
                    key={tag} 
                    variant="outline" 
                    size="sm" 
                    className="border-accent text-accent hover:bg-accent/10"
                    onClick={() => handleDemoAction(`Filtering by: ${tag} (Demo)`)}
                  >
                    <Tag className="mr-1 h-3 w-3" /> {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {hardcodedEvents.map(event => (
          <Card key={event.id} className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 overflow-hidden">
            <CardHeader className="pb-3">
               <div className="flex items-start space-x-3">
                  <event.icon className="h-10 w-10 text-accent mt-1 shrink-0" />
                  <div className="flex-grow">
                    <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                    <CardDescription className="text-sm">Organized by: {event.organizer} {event.type === 'peer' ? '(Peer Event)' : '(Official)'}</CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm text-muted-foreground"><CalendarDays className="inline mr-1.5 h-4 w-4 text-accent/80" />{event.date} at {event.time}</p>
              <p className="text-sm text-muted-foreground"><strong>Location:</strong> {event.location}</p>
              <p className="text-foreground/80 text-sm">{event.description}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {event.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
              </div>
            </CardContent>
            <CardContent className="pt-2 pb-4 border-t border-border/30">
              <div className="mt-3 flex flex-wrap gap-2 justify-start">
                <Button onClick={() => handleDemoAction(`Viewing details for ${event.title} (Demo)`)} size="sm" variant="outline"><Telescope className="mr-1 h-4 w-4" />View Details</Button>
                <Button onClick={() => handleDemoAction(`RSVPing to ${event.title} (Demo)`)} size="sm" variant="outline"><CalendarDays className="mr-1 h-4 w-4" />RSVP</Button>
                <Button onClick={() => handleDemoAction(`Marking interest in ${event.title} (Demo)`)} size="sm" variant="ghost" className="text-accent hover:text-accent/80"><RecommendIcon className="mr-1 h-4 w-4" />Mark Interest</Button>
                <Button onClick={() => handleDemoAction(`Sharing ${event.title} (Demo)`)} size="sm" variant="ghost" className="text-accent hover:text-accent/80"><Share2 className="mr-1 h-4 w-4" />Share</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {hardcodedEvents.length === 0 && (
            <p className="text-muted-foreground text-center py-6">No events currently listed. Check back soon for cosmic happenings!</p>
        )}
      </div>
    </div>
  );
}
