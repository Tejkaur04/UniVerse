
"use client";

import Link from 'next/link';
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Telescope, CalendarDays, Search, Tag, Users, Share2, Sparkles as RecommendIcon, CheckCircle } from 'lucide-react';
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

const initialHardcodedEvents: CampusEvent[] = [
  {
    id: "event1",
    type: 'official',
    title: "Guest Lecture: The Future of Quantum Computing",
    date: "November 20, 2024",
    time: "4:00 PM UTC",
    location: "Main Auditorium",
    description: "Join Prof. Anya Sharma as she discusses breakthroughs in quantum computing and its impact on technology.",
    organizer: "Dept. of Physics",
    tags: ["Academia", "Tech", "Physics"],
    icon: CalendarDays,
    dataAiHint: "lecture hall modern"
  },
  {
    id: "event2",
    type: 'official',
    title: "Career Fair: Tech & Engineering",
    date: "November 25, 2024",
    time: "10:00 AM - 3:00 PM UTC",
    location: "University Grand Hall",
    description: "Connect with leading tech companies and explore internship/job opportunities in various engineering fields.",
    organizer: "Career Services",
    tags: ["Career", "Tech", "Engineering"],
    icon: Users,
    dataAiHint: "career fair students"
  },
  {
    id: "event3",
    type: 'peer',
    title: "Astro 101 Study Group - Midterm Prep",
    date: "November 15, 2024",
    time: "6:00 PM UTC",
    location: "Library Room 4B / Virtual",
    description: "Collaborative review session for the upcoming Astrophysics 101 midterm. All welcome!",
    organizer: "Alex Cosmo (Student)",
    tags: ["Study Group", "Astrophysics"],
    icon: Users,
    dataAiHint: "students studying group"
  },
  {
    id: "event4",
    type: 'official',
    title: "Digital Art Workshop: Intro to Procreate",
    date: "December 2, 2024",
    time: "2:00 PM - 5:00 PM UTC",
    location: "Fine Arts Studio C",
    description: "Learn the basics of digital painting and illustration using Procreate on iPad. No prior experience needed.",
    organizer: "Arts Department",
    tags: ["Arts", "Workshop", "Digital Art"],
    icon: CalendarDays, // Using CalendarDays, could be Brush or similar if available
    dataAiHint: "digital art workshop"
  },
  {
    id: "event5",
    type: 'peer',
    title: "UniVerse App Feedback Session",
    date: "December 5, 2024",
    time: "4:00 PM UTC",
    location: "Student Union Room 101 / Virtual",
    description: "Help shape the future of UniVerse! Join us to share your feedback and ideas for new features.",
    organizer: "UniVerse Dev Team (Student Lead)",
    tags: ["Tech", "Feedback", "Community"],
    icon: Users,
    dataAiHint: "students discussion group"
  }
];

const allInterestTags = ["All", "Academia", "Tech", "Physics", "Career", "Engineering", "Study Group", "Astrophysics", "Arts", "Workshop", "Digital Art", "Feedback", "Community", "Social"];

interface UserEventInteractions {
  [eventId: string]: {
    rsvpd?: boolean;
    interested?: boolean;
  };
}

const getLocalStorageKey = (baseKey: string) => {
  // In a real app, you'd use a user ID here if authentication was in place.
  // For mock auth, we can use a generic key or a mock user ID if available.
  const mockUserId = "demoUser123"; // Example mock user ID
  return `${baseKey}-${mockUserId}`;
};


export default function EventHorizonPage() {
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [displayedEvents, setDisplayedEvents] = useState<CampusEvent[]>(initialHardcodedEvents);
  const [userInteractions, setUserInteractions] = useState<UserEventInteractions>({});

  // Load interactions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInteractions = localStorage.getItem(getLocalStorageKey('uniVerseEventInteractions'));
      if (savedInteractions) {
        setUserInteractions(JSON.parse(savedInteractions));
      }
    }
  }, []);

  // Save interactions to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey('uniVerseEventInteractions'), JSON.stringify(userInteractions));
    }
  }, [userInteractions]);
  
  // Filter events based on search term and selected tag
  useEffect(() => {
    let filtered = initialHardcodedEvents;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag && selectedTag !== 'All') {
      filtered = filtered.filter(event => event.tags.includes(selectedTag));
    }
    setDisplayedEvents(filtered);
  }, [searchTerm, selectedTag]);


  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  const toggleRsvp = (eventId: string, eventTitle: string) => {
    setUserInteractions(prev => {
      const currentEventState = prev[eventId] || {};
      const newRsvpState = !currentEventState.rsvpd;
      toast({
        title: newRsvpState ? "RSVP'd Successfully!" : "RSVP Removed",
        description: `You have ${newRsvpState ? "confirmed your attendance for" : "removed your RSVP for"} "${eventTitle}". (Saved in browser)`,
      });
      return {
        ...prev,
        [eventId]: { ...currentEventState, rsvpd: newRsvpState },
      };
    });
  };

  const toggleInterest = (eventId: string, eventTitle: string) => {
    setUserInteractions(prev => {
      const currentEventState = prev[eventId] || {};
      const newInterestState = !currentEventState.interested;
      toast({
        title: newInterestState ? "Marked as Interested!" : "Interest Removed",
        description: `You have ${newInterestState ? "marked your interest in" : "removed your interest from"} "${eventTitle}". (Saved in browser)`,
      });
      return {
        ...prev,
        [eventId]: { ...currentEventState, interested: newInterestState },
      };
    });
  };
  
  const handleDemoAction = (message: string) => {
    toast({
      title: "Demo Action",
      description: message + " (This feature is for demonstration.)",
      duration: 3000,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to UniVerse Home
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-4 text-center">
          <Telescope className="h-16 w-16 text-primary mr-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-primary font-mono">Event Horizon</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-6">
          Discover exciting campus events, workshops, and seminars. Your telescope to opportunities! Your preferences are saved locally in your browser.
        </p>
      </div>
      
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 mb-10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center text-primary"><Search className="mr-3 h-7 w-7 text-accent" />Filter Your Cosmos</CardTitle>
          <CardDescription>Search for specific events or filter by your interests. Results update as you type or select a tag.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            type="search" 
            placeholder="Search by keywords (e.g., 'Quantum', 'Career Fair')..." 
            className="bg-background/70"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/90">Filter by Interests:</p>
            <div className="flex flex-wrap gap-2">
              {allInterestTags.map(tag => (
                <Button 
                  key={tag} 
                  variant={selectedTag === tag ? "default" : "outline"} 
                  size="sm" 
                  className={`border-accent ${selectedTag === tag ? 'bg-accent text-accent-foreground' : 'text-accent hover:bg-accent/10'}`}
                  onClick={() => handleTagChange(tag)}
                >
                  <Tag className="mr-1 h-3 w-3" /> {tag}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {displayedEvents.length > 0 ? displayedEvents.map(event => {
          const interactions = userInteractions[event.id] || {};
          const isRsvpd = !!interactions.rsvpd;
          const isInterested = !!interactions.interested;

          return (
            <Card key={event.id} className="bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-3">
                 <div className="flex items-start space-x-3">
                    <event.icon className="h-10 w-10 text-accent mt-1 shrink-0" />
                    <div className="flex-grow">
                      <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                      <CardDescription className="text-sm">Organized by: {event.organizer} <Badge variant={event.type === 'official' ? 'secondary' : 'outline'} className='ml-2 text-xs'>{event.type === 'official' ? 'Official' : 'Peer Event'}</Badge></CardDescription>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="text-sm text-muted-foreground"><CalendarDays className="inline mr-1.5 h-4 w-4 text-accent/80" />{event.date} at {event.time}</p>
                <p className="text-sm text-muted-foreground"><strong>Location:</strong> {event.location}</p>
                <p className="text-foreground/80 text-sm">{event.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {event.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs border-accent/70 text-accent/90">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardContent className="pt-2 pb-4 border-t border-border/30">
                <div className="mt-3 flex flex-wrap gap-2 justify-start">
                  <Button onClick={() => handleDemoAction(`Viewing details for ${event.title}`)} size="sm" variant="outline"><Telescope className="mr-1 h-4 w-4" />View Details</Button>
                  <Button 
                    onClick={() => toggleRsvp(event.id, event.title)} 
                    size="sm" 
                    variant={isRsvpd ? "default" : "outline"}
                    className={isRsvpd ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'border-primary text-primary hover:bg-primary/10'}
                  >
                    {isRsvpd ? <CheckCircle className="mr-1 h-4 w-4" /> : <CalendarDays className="mr-1 h-4 w-4" />}
                    {isRsvpd ? "RSVP'd" : "RSVP"}
                  </Button>
                  <Button 
                    onClick={() => toggleInterest(event.id, event.title)} 
                    size="sm" 
                    variant={isInterested ? "secondary" : "ghost"} 
                    className={isInterested ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'text-accent hover:text-accent/80'}
                  >
                    <RecommendIcon className="mr-1 h-4 w-4" />
                    {isInterested ? "Interested" : "Mark Interest"}
                  </Button>
                  <Button onClick={() => handleDemoAction(`Sharing ${event.title}`)} size="sm" variant="ghost" className="text-accent hover:text-accent/80"><Share2 className="mr-1 h-4 w-4" />Share</Button>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
            <Card className="p-6 text-center bg-card/70 backdrop-blur-sm border-border/50">
              <CardTitle className="text-xl text-primary">No Cosmic Events Found</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Adjust your filters or check back later for new happenings in the UniVerse!
              </CardDescription>
            </Card>
        )}
      </div>

       <Card className="mt-12 bg-card/80 backdrop-blur-sm border-primary/30 shadow-lg p-6 text-left">
          <CardTitle className="text-2xl text-primary mb-3 flex items-center">
            <RecommendIcon className="h-7 w-7 mr-3 text-accent animate-pulse" />
            Future Discoveries (Coming Soon!):
          </CardTitle>
          <ul className="list-disc list-inside space-y-2 text-foreground/90">
            <li><strong className="text-accent/90">Comprehensive Calendar View:</strong> Visualize all campus events, workshops, and seminars in a traditional calendar format.</li>
            <li><strong className="text-accent/90">Personalized Recommendations:</strong> Get event suggestions based on your profile and expressed interests!</li>
            <li><strong className="text-accent/90">Create Peer Events:</strong> Organize and list your own study sessions or informal gatherings for others to join.</li>
          </ul>
          <p className="mt-4 text-center text-primary font-semibold">Stay tuned, explorer! The Event Horizon is always expanding.</p>
        </Card>
    </div>
  );
}

    