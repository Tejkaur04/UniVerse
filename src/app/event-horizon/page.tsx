
"use client";
import type { FC, FormEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger, DialogFooter } from "@/components/ui/dialog"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays, Search, Tags, CheckCircle, Star, Share2, PlusCircle, Telescope, Rocket, Users, ListFilter,
  CalendarCheck, Info, Filter as FilterIcon, Eye, Compass, CalendarPlus, Home
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  iconName: string;
  dataAiHint?: string;
}

interface UserEventInteractions {
  [eventId: string]: {
    rsvpd?: boolean;
    interested?: boolean;
  };
}

const ALL_INTEREST_TAGS = ["All", "Coding", "Literature", "Science", "Tech Talk", "Workshop", "Social", "Career", "Arts", "Sports", "Entrepreneurship", "Study Group"];

const iconMap: { [key: string]: LucideIcon } = {
  CalendarDays: CalendarDays,
  Users: Users,
  DefaultEventIcon: Info,
  PlusCircle: PlusCircle,
  Star: Star,
  ListFilter: ListFilter,
  Search: Search,
  FilterIcon: FilterIcon,
  Telescope: Telescope,
  Rocket: Rocket,
};

const initialHardcodedEvents: CampusEvent[] = [
  { id: 'event1', title: 'Galaxy Gala: Annual Starlight Ball', date: '2024-12-15', time: '19:00 GST', location: 'Grand Celestial Hall', description: 'A night of cosmic celebration and networking.', organizer: 'University Student Council', tags: ['Social', 'Networking'], type: 'official', iconName: 'CalendarDays', dataAiHint: 'gala event' },
  { id: 'event2', title: 'Intro to Quantum Coding Workshop', date: '2024-11-20', time: '14:00 GST', location: 'Tech Dome - Lab 7', description: 'Learn the basics of quantum algorithms.', organizer: 'Dept. of Quantum Engineering', tags: ['Coding', 'Workshop', 'Tech Talk'], type: 'official', iconName: 'CalendarDays', dataAiHint: 'coding workshop' },
  { id: 'event3', title: 'Peer Study: Astro 101 Midterm Prep', date: '2024-10-25', time: '16:00 GST', location: 'Library Sector Gamma', description: 'Collaborative review for Astrophysics midterm.', organizer: 'Alex Comet (Student)', tags: ['Study Group', 'Astrophysics'], type: 'peer', iconName: 'Users', dataAiHint: 'students studying' },
];


const EventHorizonPage: FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("discover");

  const userLocalStorageKey = (dataKey: string) => `uniVerse-eventHorizon-${dataKey}-mockUser`; // Simplified key for demo

  const loadData = <T,>(keySuffix: string, fallbackData: T): T => {
    if (typeof window === 'undefined') return fallbackData;
    const key = userLocalStorageKey(keySuffix);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch (error) {
        console.error(`Failed to parse ${keySuffix} from localStorage`, error);
        return fallbackData;
      }
    }
    return fallbackData;
  };

  const saveData = <T,>(keySuffix: string, data: T) => {
    if (typeof window === 'undefined') return;
    const key = userLocalStorageKey(keySuffix);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const [allEvents, setAllEvents] = useState<CampusEvent[]>(() => loadData('allEvents', initialHardcodedEvents));
  const [displayedEvents, setDisplayedEvents] = useState<CampusEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [userInteractions, setUserInteractions] = useState<UserEventInteractions>(() => loadData('userEventInteractions', {}));

  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('');
  const [newEventTags, setNewEventTags] = useState('');

  useEffect(() => { saveData('allEvents', allEvents); }, [allEvents]);
  useEffect(() => { saveData('userEventInteractions', userInteractions); }, [userInteractions]);

  useEffect(() => {
    let filtered = allEvents;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTag !== 'All') {
      filtered = filtered.filter(event => event.tags.includes(selectedTag));
    }
    setDisplayedEvents(filtered);
  }, [allEvents, searchTerm, selectedTag]);

  const handleInteraction = (eventId: string, interactionType: 'rsvpd' | 'interested') => {
    setUserInteractions(prev => {
      const eventInteraction = { ...prev[eventId] };
      eventInteraction[interactionType] = !eventInteraction[interactionType];
      return { ...prev, [eventId]: eventInteraction };
    });
    const event = allEvents.find(e => e.id === eventId);
    const actionText = interactionType === 'rsvpd' ? (userInteractions[eventId]?.rsvpd ? 'RSVP Canceled' : 'RSVP Confirmed') : (userInteractions[eventId]?.interested ? 'Interest Removed' : 'Marked as Interested');
    toast({
      title: actionText,
      description: `${event ? event.title : 'Event'} status updated. Your choice is saved in your browser.`,
      action: <CheckCircle className="h-5 w-5 text-green-500" />
    });
  };

  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim() || !newEventTime.trim()) {
      toast({ variant: 'destructive', title: 'Missing Crucial Info', description: 'Title, Date, and Time are required to launch an event.' });
      return;
    }
    const newEvent: CampusEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation || 'To Be Announced',
      description: newEventDescription,
      organizer: newEventOrganizer || 'Peer Organizer',
      tags: newEventTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      type: 'peer',
      iconName: 'Users', // Default icon for peer events
    };
    setAllEvents(prev => [newEvent, ...prev]);
    setIsCreateEventDialogOpen(false);
    setNewEventTitle(''); setNewEventDate(''); setNewEventTime(''); setNewEventLocation(''); setNewEventDescription(''); setNewEventOrganizer(''); setNewEventTags('');
    toast({ title: 'New Event Orbit Launched!', description: `${newEvent.title} is now on the horizon. Saved locally in your browser.`, action: <CheckCircle className="h-5 w-5 text-green-500" /> });
  };
  
  const recommendedEvents = useMemo(() => {
    const uninteractedEvents = allEvents.filter(event => !(userInteractions[event.id]?.rsvpd || userInteractions[event.id]?.interested));
    return uninteractedEvents.slice(0, 2);
  }, [allEvents, userInteractions]);

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-5xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Back to UniVerse Home
          </Link>
        </Button>
        <div className="text-center">
          <CalendarDays className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
          <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">Event Horizon</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chart your course through campus happenings. Workshops, seminars, social galaxies, and more!
            Your interactions and created events are saved locally in your browser.
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 mb-8 border-b border-border pb-1">
            <TabsTrigger value="discover" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
                <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Filter & Discover
            </TabsTrigger>
            <TabsTrigger value="create" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
                <PlusCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Create Peer Event
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
                <Star className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Recommendations
            </TabsTrigger>
            <TabsTrigger value="all" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
                <ListFilter className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> All Events List
            </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
        <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[400px]" 
        >
        {activeTab === "discover" && (
        <TabsContent value="discover" forceMount>
            <Card className="mb-10 shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                <div className="flex items-center space-x-3">
                    <FilterIcon className="h-8 w-8 text-primary animate-subtle-pulse" />
                    <CardTitle className="text-2xl font-mono text-primary">Filter Your Cosmos</CardTitle>
                </div>
                <CardDescription>Scan the event horizon for specific signals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <Input
                    type="search"
                    placeholder="Search by keyword (title, description, organizer)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-input placeholder:text-muted-foreground"
                />
                <div className="flex flex-wrap gap-2">
                    {ALL_INTEREST_TAGS.map(tag => (
                    <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTag(tag)}
                        className={`transition-all ${selectedTag === tag ? 'bg-accent text-accent-foreground scale-105' : 'border-accent/40 text-accent hover:bg-accent/10'}`}
                    >
                        {tag}
                    </Button>
                    ))}
                </div>
                </CardContent>
            </Card>

            {displayedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedEvents.map(event => {
                    const IconComponent = iconMap[event.iconName] || iconMap.DefaultEventIcon;
                    const isRsvpd = userInteractions[event.id]?.rsvpd;
                    const isInterested = userInteractions[event.id]?.interested;
                    return (
                    <Card key={event.id} className="flex flex-col bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-3">
                        <div className="flex items-start space-x-3">
                            <IconComponent className="h-10 w-10 text-accent mt-1 shrink-0" />
                            <div className="flex-grow">
                            <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                            <CardDescription className="text-sm">Organized by: {event.organizer} <Badge variant={event.type === 'official' ? 'secondary' : 'outline'} className='ml-2 text-xs bg-primary/20 text-primary-foreground'>{event.type === 'official' ? 'Official Event' : 'Peer Event'}</Badge></CardDescription>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent className="space-y-2 flex-grow text-sm">
                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Date:</span> {event.date} | <span className="font-semibold">Time:</span> {event.time}</p>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Location:</span> {event.location}</p>
                        <p className="text-foreground/80 line-clamp-3">{event.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                            {event.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs border-accent/50 text-accent">{tag}</Badge>)}
                        </div>
                        </CardContent>
                        <CardFooter className="grid grid-cols-2 gap-2 pt-3">
                        <Button variant={isRsvpd ? "default" : "outline"} size="sm" onClick={() => handleInteraction(event.id, 'rsvpd')} className={isRsvpd ? "bg-accent text-accent-foreground" : "border-accent text-accent hover:bg-accent/10"}>
                            {isRsvpd ? <CheckCircle className="mr-1 h-4 w-4"/> : <CalendarPlus className="mr-1 h-4 w-4"/>} {isRsvpd ? "RSVP'd" : "RSVP"}
                        </Button>
                        <Button variant={isInterested ? "default" : "outline"} size="sm" onClick={() => handleInteraction(event.id, 'interested')} className={isInterested ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary/10"}>
                           {isInterested ? <Star className="mr-1 h-4 w-4 fill-current"/> : <Star className="mr-1 h-4 w-4"/>} {isInterested ? "Interested" : "Mark Interest"}
                        </Button>
                        </CardFooter>
                    </Card>
                    );
                })}
                </div>
            ) : (
                <Card className="text-center py-10 bg-background/50 border border-border/50 shadow-md"><CardContent><Telescope className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-primary">No Signals Detected</h3><p className="text-muted-foreground">Adjust your filters or broaden your search horizon.</p></CardContent></Card>
            )}
        </TabsContent>
        )}

        {activeTab === "create" && (
        <TabsContent value="create" forceMount>
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30 max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <PlusCircle className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Launch Your Own Orbit</CardTitle>
                    </div>
                    <CardDescription>Organize and list your own study sessions or informal gatherings for others to join.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-primary hover:bg-accent hover:text-accent-foreground">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create New Peer Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-primary/50">
                      <DialogHeader>
                        <DialogTitle className="font-mono text-primary flex items-center"><PlusCircle className="mr-2 h-5 w-5" />Launch Your Peer Event</DialogTitle>
                        <DialogDescription>Share the details of your event with the UniVerse community.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateEvent} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
                          <div><Label htmlFor="newEventTitle">Event Title</Label><Input id="newEventTitle" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="e.g., Casual Coding Catch-up" /></div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><Label htmlFor="newEventDate">Date</Label><Input id="newEventDate" type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} /></div>
                              <div><Label htmlFor="newEventTime">Time</Label><Input id="newEventTime" type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} /></div>
                          </div>
                          <div><Label htmlFor="newEventLocation">Location / Platform</Label><Input id="newEventLocation" value={newEventLocation} onChange={e => setNewEventLocation(e.target.value)} placeholder="e.g., Campus Cafe or Discord" /></div>
                          <div><Label htmlFor="newEventDescription">Description</Label><Textarea id="newEventDescription" value={newEventDescription} onChange={e => setNewEventDescription(e.target.value)} placeholder="Briefly describe your event." /></div>
                          <div><Label htmlFor="newEventOrganizer">Organizer Name (Optional)</Label><Input id="newEventOrganizer" value={newEventOrganizer} onChange={e => setNewEventOrganizer(e.target.value)} placeholder="Your Name/Group Name (Defaults to your user if empty)" /></div>
                          <div><Label htmlFor="newEventTags">Tags (comma-separated)</Label><Input id="newEventTags" value={newEventTags} onChange={e => setNewEventTags(e.target.value)} placeholder="e.g., Coding, Social, Casual" /></div>
                          <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsCreateEventDialogOpen(false)}>Cancel Launch</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Launch Event</Button></DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
            </Card>
        </TabsContent>
        )}
        
        {activeTab === "recommendations" && (
        <TabsContent value="recommendations" forceMount>
             <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <Star className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Cosmic Alignments</CardTitle>
                    </div>
                    <CardDescription>Event signals aligning with your trajectory (Simulated Recommendations).</CardDescription>
                </CardHeader>
                <CardContent>
                    {recommendedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recommendedEvents.map(event => {
                             const IconComponent = iconMap[event.iconName] || iconMap.DefaultEventIcon;
                             const isRsvpd = userInteractions[event.id]?.rsvpd;
                             const isInterested = userInteractions[event.id]?.interested;
                            return (
                            <Card key={event.id} className="flex flex-col bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-3">
                                <div className="flex items-start space-x-3">
                                     <IconComponent className="h-8 w-8 text-accent mt-1 shrink-0" />
                                    <div>
                                        <CardTitle className="text-2xl text-primary">{event.title}</CardTitle>
                                        <CardDescription className="text-xs">By: {event.organizer}</CardDescription>
                                    </div>
                                </div>
                                </CardHeader>
                                <CardContent className="space-y-1 flex-grow text-sm">
                                    <p className="text-xs text-muted-foreground">{event.date} @ {event.time}</p>
                                    <p className="text-foreground/80 line-clamp-2">{event.description}</p>
                                </CardContent>
                                <CardFooter className="grid grid-cols-2 gap-2 pt-3">
                                    <Button variant={isRsvpd ? "default" : "outline"} size="sm" onClick={() => handleInteraction(event.id, 'rsvpd')} className={isRsvpd ? "bg-accent text-accent-foreground" : "border-accent text-accent hover:bg-accent/10"}>
                                        {isRsvpd ? <CheckCircle className="mr-1 h-4 w-4"/> : <CalendarPlus className="mr-1 h-4 w-4"/>} {isRsvpd ? "RSVP'd" : "RSVP"}
                                    </Button>
                                    <Button variant={isInterested ? "default" : "outline"} size="sm" onClick={() => handleInteraction(event.id, 'interested')} className={isInterested ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary/10"}>
                                        {isInterested ? <Star className="mr-1 h-4 w-4 fill-current"/> : <Star className="mr-1 h-4 w-4"/>} {isInterested ? "Interested" : "Mark Interest"}
                                    </Button>
                                </CardFooter>
                            </Card>
                            );
                        })}
                        </div>
                    ) : (
                         <Card className="text-center py-10 bg-background/50 border border-border/50 shadow-md"><CardContent><Telescope className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-primary">No Specific Alignments</h3><p className="text-muted-foreground">Explore all events or mark some as interesting to help us find alignments!</p></CardContent></Card>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        )}

        {activeTab === "all" && (
        <TabsContent value="all" forceMount>
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                    <div className="flex items-center space-x-3">
                        <ListFilter className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Celestial Timetable</CardTitle>
                    </div>
                    <CardDescription>A comprehensive log of all detected event signals.</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                    {allEvents.length > 0 ? (
                        allEvents.map(event => {
                             const IconComponent = iconMap[event.iconName] || iconMap.DefaultEventIcon;
                             const isRsvpd = userInteractions[event.id]?.rsvpd;
                             const isInterested = userInteractions[event.id]?.interested;
                            return (
                            <Card key={event.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-background/50 border border-border/50 shadow-sm hover:border-border/70 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center space-x-3">
                                     <IconComponent className="h-7 w-7 text-accent shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-primary text-sm">{event.title}</h4>
                                        <p className="text-xs text-muted-foreground">{event.date} @ {event.time} | By: {event.organizer} | Type: {event.type}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:ml-auto shrink-0">
                                     <Button variant={isRsvpd ? "default" : "outline"} size="xs" onClick={() => handleInteraction(event.id, 'rsvpd')} className={`text-xs ${isRsvpd ? "bg-accent text-accent-foreground" : "border-accent text-accent hover:bg-accent/10"}`}>
                                        {isRsvpd ? "✓ RSVP'd" : "RSVP"}
                                    </Button>
                                    <Button variant={isInterested ? "default" : "outline"} size="xs" onClick={() => handleInteraction(event.id, 'interested')} className={`text-xs ${isInterested ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary/10"}`}>
                                        {isInterested ? "★ Int." : "Interest"}
                                    </Button>
                                </div>
                            </Card>
                            );
                        })
                    ) : (
                        <Card className="text-center py-10 bg-background/50 border border-border/50 shadow-md"><CardContent><Rocket className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-primary">Quiet Cosmos</h3><p className="text-muted-foreground">The event horizon is clear. No events logged yet. Perhaps create one?</p></CardContent></Card>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        )}
        </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default EventHorizonPage;
