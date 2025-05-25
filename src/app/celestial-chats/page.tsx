
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MessageCircleQuestion, CalendarClock, Users, Archive, Mic, Send, FileText, Star, Bot } from 'lucide-react';
import CelestialChatsClient from '@/components/celestial-chats-client';
import type { LucideIcon } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatarUrl: string;
  avatarFallback: string;
  bio: string;
  expertise: string[];
  dataAiHint?: string;
}

interface AmaSession {
  id:string;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
  expertiseArea: string;
  icon: LucideIcon;
}

interface PastSession {
  id: string;
  mentorName: string;
  topic: string;
  date: string;
  icon: LucideIcon;
}

const hardcodedMentors: Mentor[] = [
  {
    id: "mentor1",
    name: "Dr. Orion Nebula",
    avatarUrl: "https://placehold.co/100x100.png",
    dataAiHint: "scientist portrait",
    avatarFallback: "ON",
    bio: "Astrophysics Alumnus, now researching dark matter. Passionate about guiding students through complex cosmic theories.",
    expertise: ["Astrophysics", "Research", "Academia"],
  },
  {
    id: "mentor2",
    name: "Cmdr. Lyra Starstrider",
    avatarUrl: "https://placehold.co/100x100.png",
    dataAiHint: "engineer leader",
    avatarFallback: "LS",
    bio: "Senior Software Engineer at a leading space-tech company. Loves discussing career paths in tech and project management.",
    expertise: ["Software Engineering", "Career Advice", "Tech Industry"],
  },
];

const hardcodedUpcomingAmas: AmaSession[] = [
  {
    id: "ama1",
    mentorName: "Dr. Orion Nebula",
    topic: "Navigating Your Thesis in Astrophysics",
    date: "November 10, 2024",
    time: "3:00 PM UTC",
    expertiseArea: "Astrophysics",
    icon: Star,
  },
  {
    id: "ama2",
    mentorName: "Cmdr. Lyra Starstrider",
    topic: "Landing Your First Tech Internship",
    date: "November 17, 2024",
    time: "5:00 PM UTC",
    expertiseArea: "Career in Tech",
    icon: Mic,
  },
];

const hardcodedPastSessions: PastSession[] = [
  {
    id: "past1",
    mentorName: "Prof. Elena Cosmos",
    topic: "Intro to Quantum Entanglement",
    date: "October 5, 2024",
    icon: FileText,
  },
  {
    id: "past2",
    mentorName: "Alex Stellar (Alumni)",
    topic: "Surviving First Year Engineering",
    date: "September 20, 2024",
    icon: FileText,
  },
];


export default function CelestialChatsPage() {
  const { toast } = useToast();

  const handleDemoClick = (message: string) => {
    toast({
      title: "Demo Action",
      description: message,
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
          <MessageCircleQuestion className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary font-mono">Celestial Chats</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-10">
          Gain wisdom from experienced navigators – university seniors and alumni. Ask questions, join AMAs, and explore shared knowledge.
        </p>
      </div>

      <div className="space-y-10">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Bot className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Stellar Assist AI</CardTitle>
            <CardDescription>Have a specific question? Get instant, AI-powered advice, drawing from the collective experience of seniors and alumni.</CardDescription>
          </CardHeader>
          <CardContent>
            <CelestialChatsClient />
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><CalendarClock className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Upcoming AMA Sessions</CardTitle>
            <CardDescription>Join live discussions with seniors and alumni. Submit your questions in advance!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hardcodedUpcomingAmas.map(ama => (
              <Card key={ama.id} className="p-4 bg-background/50 border-border/50">
                <div className="flex items-start space-x-3">
                  <ama.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-foreground">{ama.topic}</h4>
                    <p className="text-sm text-muted-foreground">With: {ama.mentorName} ({ama.expertiseArea})</p>
                    <p className="text-sm text-muted-foreground">Date: {ama.date} at {ama.time}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Button onClick={() => handleDemoClick(`Submitting question for ${ama.topic} (Demo)`)} size="sm" variant="outline"><Send className="mr-1 h-4 w-4" />Submit Question</Button>
                  <Button onClick={() => handleDemoClick(`Joining session: ${ama.topic} (Demo)`)} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><Mic className="mr-1 h-4 w-4" />Join Session</Button>
                </div>
              </Card>
            ))}
            {hardcodedUpcomingAmas.length === 0 && <p className="text-muted-foreground">No upcoming AMA sessions scheduled. Check back soon!</p>}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Users className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Meet Our Mentors</CardTitle>
            <CardDescription>Learn about the seniors and alumni guiding you through UniVerse.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hardcodedMentors.map(mentor => (
              <Card key={mentor.id} className="p-4 bg-background/50 border-border/50 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mentor.avatarUrl} alt={mentor.name} data-ai-hint={mentor.dataAiHint} />
                  <AvatarFallback>{mentor.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-foreground">{mentor.name}</h4>
                  <div className="mt-1 mb-2 flex flex-wrap gap-1">
                    {mentor.expertise.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                  </div>
                  <p className="text-sm text-foreground/80">{mentor.bio}</p>
                </div>
                <Button onClick={() => handleDemoClick(`Attempting to connect with ${mentor.name} (Demo - subject to mentor availability)`)} size="sm" variant="outline" className="shrink-0 self-start sm:self-center">Connect</Button>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Archive className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Stellar Guidance Archives</CardTitle>
            <CardDescription>Browse transcripts or recordings from past AMA sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hardcodedPastSessions.map(session => (
              <Card key={session.id} className="p-4 bg-background/50 border-border/50">
                 <div className="flex items-start space-x-3">
                  <session.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-foreground">{session.topic}</h4>
                    <p className="text-sm text-muted-foreground">With: {session.mentorName}</p>
                    <p className="text-sm text-muted-foreground">Date: {session.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => handleDemoClick(`Viewing archive for ${session.topic} (Demo)`)} size="sm" variant="outline"><FileText className="mr-1 h-4 w-4" />View Content</Button>
                </div>
              </Card>
            ))}
            {hardcodedPastSessions.length === 0 && <p className="text-muted-foreground">No past sessions archived yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
