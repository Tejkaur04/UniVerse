
"use client";

import Link from 'next/link';
import React, { useState, useEffect, type ChangeEvent, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Telescope, CalendarDays, Search, Tag, Users, Share2, Sparkles as RecommendIcon, CheckCircle, PlusCircle, ListChecks, Info, Filter, ListFilter } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Define an icon map
const iconMap: { [key: string]: LucideIcon } = {
  CalendarDays,
  Users,
  Telescope, // Add any other icons you might use
  // Add other icons as needed
};

const DefaultEventIcon = CalendarDays; // Fallback icon

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
  iconName: string; // Changed from icon: LucideIcon
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
    iconName: "CalendarDays", // Changed
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
    iconName: "Users", // Changed
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
    iconName: "Users", // Changed
    dataAiHint: "students studying group"
  },
];

const allInterestTags = ["All", "Academia", "Tech", "Physics", "Career", "Engineering", "Study Group", "Astrophysics", "Arts", "Workshop", "Digital Art", "Feedback", "Community", "Social"];

interface UserEventInteractions {
  [eventId: string]: {
    rsvpd?: boolean;
    interested?: boolean;
  };
}

const getLocalStorageKey = (baseKey: string) => {
  const mockUserId = "demoUser123"; 
  return `${baseKey}-${mockUserId}`;
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};


export default function EventHorizonPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discover");
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  
  const [allEvents, setAllEvents] = useState<CampusEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getLocalStorageKey('uniVerseAllEvents'));
      // When parsing, icons will not be functions. We need to handle this.
      // For now, we'll re-map icon names later or ensure initial data is robust.
      return saved ? JSON.parse(saved) : initialHardcodedEvents;
    }
    return initialHardcodedEvents;
  });

  const [displayedEvents, setDisplayedEvents] = useState<CampusEvent[]>([]);
  
  const [userInteractions, setUserInteractions] = useState<UserEventInteractions>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getLocalStorageKey('uniVerseEventInteractions'));
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('Peer Organizer');
  const [newEventTags, setNewEventTags] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey('uniVerseEventInteractions'), JSON.stringify(userInteractions));
    }
  }, [userInteractions]);

  useEffect(() => {
    if (typeof window !== 'undefined' && allEvents.length >= 0) { 
      localStorage.setItem(getLocalStorageKey('uniVerseAllEvents'), JSON.stringify(allEvents));
    }
  }, [allEvents]);
  
  useEffect(() => {
    let filtered = [...allEvents];

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
  }, [searchTerm, selectedTag, allEvents]);


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

  const handleCreateEvent = () => {
    if (!newEventTitle || !newEventDate || !newEventTime || !newEventLocation || !newEventDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields for the new event.",
        variant: "destructive",
      });
      return;
    }
    const newEvent: CampusEvent = {
      id: `peer-${Date.now()}`,
      type: 'peer',
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDescription,
      organizer: newEventOrganizer || "Peer Organizer",
      tags: newEventTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      iconName: "Users", // Default icon for peer events
      dataAiHint: "group meeting"
    };
    setAllEvents(prevEvents => [newEvent, ...prevEvents]);
    setIsCreateEventDialogOpen(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    setNewEventDescription('');
    setNewEventOrganizer('Peer Organizer');
    setNewEventTags('');
    toast({
      title: "Peer Event Created!",
      description: `Your event "${newEvent.title}" has been added and saved in your browser.`,
    });
  };

  const recommendedEvents = useMemo(() => {
    return allEvents.filter(event => !(userInteractions[event.id]?.rsvpd || userInteractions[event.id]?.interested)).slice(0, 2);
  }, [allEvents, userInteractions]);
  
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
        <p className="text-xl text-center text-muted-foreground mb-10">
          Discover exciting campus events, workshops, and seminars. Your telescope to opportunities! Your preferences & created events are saved locally in your browser.
        </p>
      </div>
      
      <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          <TabsTrigger value="discover" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform animate-subtle-pulse" />Discover & Filter
          </TabsTrigger>
          <TabsTrigger value="create" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <PlusCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Create Peer Event
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <RecommendIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Recommended
          </TabsTrigger>
          <TabsTrigger value="all-events" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <ListChecks className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />All Events
          </TabsTrigger>
        </TabsList>

        <motion.div key={activeTab} variants={tabContentVariants} initial="hidden" animate="visible">
          <TabsContent value="discover">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 mb-10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary"><Filter className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Filter Your Cosmos</CardTitle>
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
                const Icon = iconMap[event.iconName] || DefaultEventIcon;

                return (
                  <Card key={event.id} className="bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                          <Icon className="h-10 w-10 text-accent mt-1 shrink-0" />
                          <div className="flex-grow">
                            <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                            <CardDescription className="text-sm">Organized by: {event.organizer} <Badge variant={event.type === 'official' ? 'secondary' : 'outline'} className='ml-2 text-xs'>{event.type === 'official' ? 'Official Event' : 'Peer Event'}</Badge></CardDescription>
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
          </TabsContent>

          <TabsContent value="create">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 mb-10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary"><PlusCircle className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Launch Your Own Orbit: Create a Peer Event</CardTitle>
                <CardDescription>Organize study sessions, club meetups, or informal gatherings for others to join. (Saved in browser).</CardDescription>
              </CardHeader>
              <CardContent>
                  <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
                      <DialogTrigger asChild>
                          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                              <PlusCircle className="mr-2 h-4 w-4" /> Create New Peer Event
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[480px] bg-card border-accent/50">
                          <DialogHeader>
                              <DialogTitle className="text-primary">Create New Peer Event</DialogTitle>
                              <DialogDescription>
                                  Share details about your gathering. It will be listed for other UniVerse explorers.
                              </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto px-2">
                              <div className="space-y-1">
                                  <Label htmlFor="event-title">Event Title</Label>
                                  <Input id="event-title" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="e.g., Midterm Study Sesh" className="bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-date">Date</Label>
                                  <Input id="event-date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} placeholder="e.g., November 30, 2024" className="bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-time">Time</Label>
                                  <Input id="event-time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} placeholder="e.g., 7:00 PM UTC" className="bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-location">Location / Link</Label>
                                  <Input id="event-location" value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} placeholder="e.g., Library Cafe / Virtual Meet Link" className="bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-description">Description</Label>
                                  <Textarea id="event-description" value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="What's your event about?" className="min-h-[80px] bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-organizer">Organizer Name (Optional)</Label>
                                  <Input id="event-organizer" value={newEventOrganizer} onChange={(e) => setNewEventOrganizer(e.target.value)} placeholder="Your Name / Group Name" className="bg-background/70" />
                              </div>
                              <div className="space-y-1">
                                  <Label htmlFor="event-tags">Tags (comma-separated)</Label>
                                  <Input id="event-tags" value={newEventTags} onChange={(e) => setNewEventTags(e.target.value)} placeholder="e.g., Study Group, Coding, Fun" className="bg-background/70" />
                              </div>
                          </div>
                          <DialogFooter>
                              <DialogClose asChild>
                                  <Button type="button" variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="button" onClick={handleCreateEvent} className="bg-primary hover:bg-primary/90 text-primary-foreground">Create Event</Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 mb-10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary"><RecommendIcon className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Cosmic Alignments: Recommended For You</CardTitle>
                <CardDescription>Event suggestions based on general campus activity. (True personalization coming soon!)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedEvents.length > 0 ? recommendedEvents.map(event => {
                  const Icon = iconMap[event.iconName] || DefaultEventIcon;
                  return (
                  <Card key={`rec-${event.id}`} className="p-4 bg-background/50 border-border/50">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">Organized by: {event.organizer} <Badge variant={event.type === 'official' ? 'secondary' : 'outline'} className='ml-1 text-xs'>{event.type === 'official' ? 'Official' : 'Peer Event'}</Badge></p>
                        <p className="text-sm text-muted-foreground">Date: {event.date} at {event.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 justify-end">
                      <Button onClick={() => handleDemoAction(`Viewing details for ${event.title}`)} size="sm" variant="outline"><Info className="mr-1 h-4 w-4" />Details</Button>
                      <Button 
                          onClick={() => toggleRsvp(event.id, event.title)} 
                          size="sm" 
                          variant={(userInteractions[event.id]?.rsvpd) ? "default" : "outline"}
                          className={(userInteractions[event.id]?.rsvpd) ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'border-primary text-primary hover:bg-primary/10'}
                        >
                        {(userInteractions[event.id]?.rsvpd) ? <CheckCircle className="mr-1 h-4 w-4" /> : <CalendarDays className="mr-1 h-4 w-4" />}
                        {(userInteractions[event.id]?.rsvpd) ? "RSVP'd" : "RSVP"}
                        </Button>
                    </div>
                  </Card>
                  );
                }) : <p className="text-muted-foreground text-center">No specific recommendations right now. Explore all events below!</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-events">
            <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30 mb-10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary"><ListChecks className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Celestial Timetable: All Events</CardTitle>
                <CardDescription>A comprehensive list of all known happenings in the UniVerse.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {allEvents.length > 0 ? allEvents.map(event => {
                  const Icon = iconMap[event.iconName] || DefaultEventIcon;
                  return (
                  <Card key={`all-${event.id}`} className="p-3 bg-background/40 border-border/40">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-accent shrink-0" />
                        <div>
                          <h5 className="font-medium text-foreground">{event.title}</h5>
                          <p className="text-xs text-muted-foreground">{event.date} - {event.organizer} <Badge variant={event.type === 'official' ? 'secondary' : 'outline'} className='ml-1 text-xs'>{event.type === 'official' ? 'Official' : 'Peer'}</Badge></p>
                        </div>
                      </div>
                      <Button onClick={() => handleDemoAction(`Viewing details for ${event.title}`)} size="sm" variant="ghost" className="text-accent hover:text-accent/80">Details</Button>
                    </div>
                  </Card>
                  );
                }) : <p className="text-muted-foreground text-center">No events listed. Be the first to create a peer event!</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
}
