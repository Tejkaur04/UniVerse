
"use client";

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; 
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircleQuestion, Users, Mic, Video, Bot, Archive, UserCheck, Home, Link2, ThumbsUp, XCircle } from 'lucide-react'; 
import CelestialChatsClient from '@/components/celestial-chats-client';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext'; 
import type { MockStudentProfile } from '@/app/study-sphere/page'; 

// Mock Data for Celestial Chats
const initialMentors = [
  { id: 'mentor_dr_orion', name: 'Dr. Orion Nebula', expertise: ['Starship Propulsion Systems', 'FTL Theory'], bio: 'Renowned expert in advanced spacecraft engineering and theoretical faster-than-light travel. Published multiple papers on warp field dynamics.', avatar: 'https://placehold.co/96x96.png?text=ON', dataAiHint: 'scientist portrait space' },
  { id: 'mentor_prof_lyra', name: 'Professor Lyra Pulsar', expertise: ['Ancient Alien Civilizations', 'Xeno-Archaeology'], bio: 'Leads groundbreaking expeditions to uncover the secrets of forgotten alien races. Can decipher over 50 extinct dialects.', avatar: 'https://placehold.co/96x96.png?text=LP', dataAiHint: 'professor archeology' },
  { id: 'mentor_cadet_nova', name: 'Senior Cadet Nova Stargazer', expertise: ['Xenolinguistics', 'Ancient Scripts', 'Cultural Exchange'], bio: 'Final year Xenolinguistics student, specialized in K\'laxi dialects. Successfully decoded three ancient scripts.', avatar: 'https://placehold.co/96x96.png?text=NS', dataAiHint: 'student linguist' },
  { id: 'mentor_cmdr_rex', name: 'Alumni Commander Rex Nebula', expertise: ['Spacecraft Engineering', 'Mission Command', 'Deep Space Ops'], bio: 'Lead Engineer on the ISS Ares V. Over 20 years experience in deep space exploration tech and high-pressure problem solving.', avatar: 'https://placehold.co/96x96.png?text=RN', dataAiHint: 'engineer commander space' },
];

const upcomingAMAs = [
  { id: 'ama1', mentorName: 'Dr. Orion Nebula', mentorId: 'mentor_dr_orion', expertise: 'Starship Propulsion Systems', topic: 'The Future of FTL Travel', dateTime: '2024-06-15 @ 17:00 GST', platform: 'Holo-Conference Room Alpha', avatar: 'https://placehold.co/80x80.png?text=ON', dataAiHint: 'scientist portrait space' },
  { id: 'ama2', mentorName: 'Professor Lyra Pulsar', mentorId: 'mentor_prof_lyra', expertise: 'Ancient Alien Civilizations', topic: 'Deciphering Xeno-Artifacts', dateTime: '2024-06-22 @ 14:00 GST', platform: 'Virtual Archaeology Dig Site 3', avatar: 'https://placehold.co/80x80.png?text=LP', dataAiHint: 'professor archeology' },
];

const pastSessions = [
  { id: 'past1', topic: 'Navigating Your First Galactic Internship', mentorName: 'Alumni Commander Rex Nebula', date: '2024-03-01', type: 'Recording Available', icon: Video },
  { id: 'past2', topic: 'Beginner\'s Guide to K\'laxi Phonetics', mentorName: 'Senior Cadet Nova Stargazer', date: '2024-02-15', type: 'Transcript Available', icon: Archive },
];

const CelestialChatsPage: FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const userLocalStorageKey = useCallback((baseKey: string): string | null => {
    return user ? `uniVerse-${baseKey}-${user.uid}` : null;
  }, [user]);

  const loadData = useCallback(<T,>(baseKey: string, fallbackData: T): T => {
    if (typeof window === 'undefined') return fallbackData;
    const key = userLocalStorageKey(baseKey);
    if (!key) return fallbackData;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved) as T; }
      catch (error) { console.error(`Failed to parse ${key} from localStorage`, error); return fallbackData; }
    }
    return fallbackData;
  }, [userLocalStorageKey]);

  const saveData = useCallback(<T,>(baseKey: string, data: T) => {
    if (typeof window === 'undefined' || !user) return;
    const key = userLocalStorageKey(baseKey);
    if(!key) return;
    localStorage.setItem(key, JSON.stringify(data));
  }, [user, userLocalStorageKey]);
  
  const [sentRequests, setSentRequests] = useState<string[]>(() => loadData('sentRequests', []));
  // connections state is not directly used here for displaying, but we'll update it
  // const [connections, setConnections] = useState<MockStudentProfile[]>(() => loadData('connections', []));

  useEffect(() => { saveData('sentRequests', sentRequests); }, [sentRequests, user, saveData]);
  // useEffect(() => { saveData('connections', connections); }, [connections, user, saveData]);


  const handleConnectMentor = (mentor: typeof initialMentors[0]) => {
     if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Mock user session not found to connect.' });
      return;
    }
    setSentRequests(prev => [...new Set([...prev, mentor.id])]);

    const connectionsKey = userLocalStorageKey('connections');
    if (connectionsKey) {
      const currentConnections: MockStudentProfile[] = loadData('connections', []);
      if (!currentConnections.find(c => c.id === mentor.id)) {
        const newConnection: MockStudentProfile = {
          id: mentor.id,
          name: mentor.name,
          department: mentor.expertise.join(', '), 
          year: 'Mentor', 
          profilePictureUrl: mentor.avatar,
          dataAiHint: mentor.dataAiHint,
          skills: mentor.expertise, 
          interests: [], 
          projectAreas: [], 
          learningStyles: [], 
          role: 'Mentor',
        };
        const newConnections = [...currentConnections, newConnection];
        saveData('connections', newConnections);
        window.dispatchEvent(new CustomEvent('connectionsUpdated')); // Dispatch event
      }
    }
    
    toast({ title: 'Connection Signal Sent!', description: `Request transmitted to ${mentor.name}. (Simulated auto-acceptance). Your connections list is updated locally.`, action: <ThumbsUp className="h-5 w-5 text-green-500" />});
  }


  return (
    <div className="w-full">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Back to UniVerse Home
          </Link>
        </Button>
        <div className="text-center">
            <MessageCircleQuestion className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
            <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">Celestial Chats</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Engage with cosmic wisdom from our Stellar Assist AI, experienced seniors, and distinguished alumni. Ask, learn, and connect.
            </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* AI Chat Section */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Stellar Assist AI</CardTitle>
            </div>
            <CardDescription>Pose your questions to our AI, trained on the collective wisdom of the UniVerse academic community. (AI Feature Currently Inactive)</CardDescription>
          </CardHeader>
          <CardContent>
            <CelestialChatsClient />
          </CardContent>
        </Card>

        {/* Upcoming AMA Sessions */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Mic className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Upcoming AMA Transmissions</CardTitle>
            </div>
            <CardDescription>Live Q&A sessions with seniors and alumni. Tune in to gain direct insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAMAs.length > 0 ? upcomingAMAs.map(ama => (
              <Card key={ama.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-accent">
                    <Image src={ama.avatar} alt={ama.mentorName} width={64} height={64} className="rounded-full object-cover" data-ai-hint={ama.dataAiHint || 'mentor portrait'}/>
                    <AvatarFallback>{ama.mentorName.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-md text-primary">{ama.topic}</h4>
                    <p className="text-sm text-muted-foreground">With: {ama.mentorName} ({ama.expertise})</p>
                    <p className="text-xs text-muted-foreground">When: {ama.dateTime} | Where: {ama.platform}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10" onClick={() => toast({title: "Submitting Question (Demo)", description: `Your question for ${ama.mentorName} will be routed.`})}>Submit Question</Button>
                    <Button size="sm" className="w-full sm:w-auto bg-primary hover:bg-accent hover:text-accent-foreground" onClick={() => toast({title: "Joining Transmission (Demo)", description: `Connecting to ${ama.platform}...`})}>Join Transmission</Button>
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No upcoming AMA transmissions. Stay tuned!</p>}
          </CardContent>
        </Card>

        {/* Meet Our Mentors */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Meet Our Galactic Guides</CardTitle>
            </div>
            <CardDescription>Learn about the seniors and alumni sharing their stellar experiences. You can add them to your connections!</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialMentors.map(mentor => (
              <Card key={mentor.id} className="p-4 bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4">
                  <Avatar className="h-20 w-20 border-2 border-accent mb-3 sm:mb-0">
                     <Image src={mentor.avatar} alt={mentor.name} width={80} height={80} className="rounded-full object-cover" data-ai-hint={mentor.dataAiHint || 'person professional'}/>
                    <AvatarFallback>{mentor.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow text-center sm:text-left">
                    <h4 className="font-semibold text-lg text-primary">{mentor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{mentor.bio}</p>
                    <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                      {mentor.expertise.map(skill => <Badge key={skill} variant="secondary" className="text-xs bg-primary/20 text-primary-foreground">{skill}</Badge>)}
                    </div>
                  </div>
                </div>
                <CardFooter className="mt-4 pt-4 border-t border-border/30 justify-center sm:justify-end">
                  <Button 
                    onClick={() => handleConnectMentor(mentor)} 
                    disabled={sentRequests.includes(mentor.id)}
                    variant={sentRequests.includes(mentor.id) ? "secondary" : "outline"}
                    size="sm" 
                    className={sentRequests.includes(mentor.id) ? "bg-muted text-muted-foreground cursor-not-allowed" : "border-accent text-accent hover:bg-accent/10"}
                  >
                    <Link2 className="mr-2 h-4 w-4"/> {sentRequests.includes(mentor.id) ? 'Signal Sent' : 'Connect'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Past Session Archives */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Archive className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Stellar Guidance Archives</CardTitle>
            </div>
            <CardDescription>Access recordings or transcripts from previous Celestial Chats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastSessions.map(session => {
              const IconComponent = session.icon || Archive;
              return (
              <Card key={session.id} className="p-3 flex items-center justify-between bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-accent shrink-0"/>
                    <div>
                        <h4 className="font-medium text-primary text-sm">{session.topic}</h4>
                        <p className="text-xs text-muted-foreground">With: {session.mentorName} | Date: {session.date}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10" onClick={() => toast({title: `Accessing ${session.type} (Demo)`, description: `Loading archive for "${session.topic}"...`})}>
                  View {session.type.split(' ')[0]}
                </Button>
              </Card>
            );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CelestialChatsPage;
