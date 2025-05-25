
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarDays, Search, Filter, Users, Share2, CalendarPlus, CheckCircle, Info, Wand2, Star, Telescope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CampusEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  tags: string[];
  type: 'official' | 'peer';
  icon: LucideIcon;
}

const hardcodedEvents: CampusEvent[] = [
  {
    id: "evt1",
    title: "InnovateX Coding Workshop",
    date: "October 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Hub Auditorium",
    description: "Dive into the latest in web development technologies and build a mini-project.",
    organizer: "Computer Science Club",
    tags: ["Coding", "Workshop", "Technology"],
    type: "official",
    icon: Users, 
  },
  {
    id: "evt2",
    title: "Cosmic Poetry Night",
    date: "October 22, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Student Union Lounge",
    description: "Share your original poems or enjoy readings from fellow students under a starry theme.",
    organizer: "Literary Society",
    tags: ["Literature", "Arts", "Social"],
    type: "official",
    icon: Star,
  },
  {
    id: "evt3",
    title: "Quantum Physics Study Group",
    date: "October 18, 2024",
    time: "4:00 PM - 6:00 PM",
    location: "Library Room 4B",
    description: "Collaborative session to tackle challenging concepts in Quantum Physics 201.",
    organizer: "Alex & Nova",
    tags: ["Study", "Physics", "Peer"],
    type: "peer",
    icon: Users,
  },
  {
    id: "evt4",
    title: "Startup Pitch Competition",
    date: "November 5, 2024",
    time: "1:00 PM - 6:00 PM",
    location: "Entrepreneurship Center",
    description: "Present your innovative startup ideas to a panel of judges and win seed funding.",
    organizer: "UniVerse Innovation Hub",
    tags: ["Entrepreneurship", "Career", "Competition"],
    type: "official",
    icon: Wand2,
  },
];

const interestTags = ["Coding", "Literature", "Sports", "Entrepreneurship", "Science", "Arts", "Music", "Career", "Workshop", "Social", "Competition", "Peer", "Technology", "Physics"];

export default function EventHorizonPage() {
  const { toast } = useToast();

  const handleDemoClick = (message: string) => {
    toast({
      title: "Demo Action",
      description: message,
      duration: 3000,
    });
  };

  const officialEvents = hardcodedEvents.filter(event => event.type === 'official');
  const peerEvents = hardcodedEvents.filter(event => event.type === 'peer');

  // Check if the feature is fully implemented
  const isFeatureImplemented = false; 

  if (!isFeatureImplemented) {
    return (
      <div className="container mx-auto px-4 py-12 w-full max-w-4xl text-center">
        <Button asChild variant="outline" className="mb-10 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Telescope className="h-24 w-24 text-primary mx-auto mb-8 animate-pulse" />
        <h1 className="text-5xl font-bold text-primary mb-6">Event Horizon - Coming Soon!</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Get ready to explore a universe of campus happenings!
        </p>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Soon, Event Horizon will be your go-to telescope for discovering exciting academic workshops, career fairs, social gatherings, peer-led study sessions, and guest lectures. You'll be able to filter by your interests, RSVP, and never miss an opportunity to enrich your university experience.
        </p>
        <p className="text-md text-accent font-semibold">Stay tuned for launch!</p>
      </div>
    );
  }

  // Fully implemented feature content (currently unreachable due to the check above)
  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-4 text-center">
          <CalendarDays className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary">Event Horizon</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-10">
          Discover campus events, workshops, and seminars. Your telescope to university opportunities!
        </p>
      </div>

      <div className="space-y-10">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Search className="mr-3 h-7 w-7 text-accent" />Navigate the Cosmos</CardTitle>
            <CardDescription>Find specific events or filter by your interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input 
                type="search" 
                placeholder="Search for events by keyword (e.g., 'hackathon', 'guest lecture')" 
                className="bg-background/70"
                onChange={(e) => handleDemoClick(`Searching for: ${e.target.value} (Demo)`)}
              />
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => handleDemoClick(`Filtered by interest: ${value} (Demo)`)}>
                <SelectTrigger className="w-full bg-background/70">
                  <SelectValue placeholder="Filter by interest (e.g., Coding, Arts)" />
                </SelectTrigger>
                <SelectContent>
                  {interestTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <Button onClick={() => handleDemoClick("Search button clicked! (Demo)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters & Search
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><CalendarDays className="mr-3 h-7 w-7 text-accent" />Official Campus Constellations</CardTitle>
            <CardDescription>Browse university-organized events, workshops, and seminars.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {officialEvents.map(event => (
              <Card key={event.id} className="p-4 bg-background/50 border-border/50">
                <div className="flex items-start space-x-3">
                  <event.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                    <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                    <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Organized by: {event.organizer}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Button onClick={() => handleDemoClick(`Viewing details for ${event.title} (Demo)`)} size="sm" variant="outline"><Info className="mr-1 h-4 w-4" />Details</Button>
                  <Button onClick={() => handleDemoClick(`RSVP'd to ${event.title}! (Demo)`)} size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10"><CheckCircle className="mr-1 h-4 w-4" />RSVP</Button>
                  <Button onClick={() => handleDemoClick(`Marked interest in ${event.title} (Demo)`)} size="sm" variant="ghost"><Star className="mr-1 h-4 w-4" />Interested</Button>
                  <Button onClick={() => handleDemoClick(`Sharing ${event.title}! (Demo)`)} size="sm" variant="ghost"><Share2 className="mr-1 h-4 w-4" />Share</Button>
                </div>
              </Card>
            ))}
            {officialEvents.length === 0 && <p className="text-muted-foreground">No official events listed currently. Check back soon!</p>}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Users className="mr-3 h-7 w-7 text-accent" />Student-Led Star Clusters</CardTitle>
            <CardDescription>Discover study sessions and informal gatherings organized by your peers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {peerEvents.map(event => (
              <Card key={event.id} className="p-4 bg-background/50 border-border/50">
                 <div className="flex items-start space-x-3">
                  <event.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                    <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                    <p className="text-sm text-foreground/80 mt-1">{event.description}</p>
                     <p className="text-xs text-muted-foreground mt-1">Organized by: {event.organizer}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Button onClick={() => handleDemoClick(`Viewing details for ${event.title} (Demo)`)} size="sm" variant="outline"><Info className="mr-1 h-4 w-4" />Details</Button>
                  <Button onClick={() => handleDemoClick(`Joining ${event.title}! (Demo)`)} size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10"><CalendarPlus className="mr-1 h-4 w-4" />Join</Button>
                  <Button onClick={() => handleDemoClick(`Sharing ${event.title}! (Demo)`)} size="sm" variant="ghost"><Share2 className="mr-1 h-4 w-4" />Share</Button>
                </div>
              </Card>
            ))}
            {peerEvents.length === 0 && <p className="text-muted-foreground">No peer-organized events found at the moment.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Wand2 className="mr-3 h-7 w-7 text-accent" />Cosmic Compass (Recommendations)</CardTitle>
            <CardDescription>UniVerse will soon suggest events tailored to your academic path and interests!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90">
              As you explore UniVerse and define your study profile, this section will light up with event recommendations perfectly aligned with your journey. Stay tuned for personalized guidance through the event cosmos!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    