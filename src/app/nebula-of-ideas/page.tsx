
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Lightbulb, Search, Users, Rocket, CheckSquare, MessageSquare, Trophy, Brain, Edit3, Paperclip, UserPlus, Info, GalleryVerticalEnd } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  skillsSought: string[];
  initiator: string;
  initiatorAvatar: string;
  dataAiHint?: string;
}

interface CollaboratorProfile {
  id: string;
  name: string;
  avatarUrl: string;
  avatarFallback: string;
  skills: string[];
  interestedIn?: string; 
  dataAiHint?: string;
}

const hardcodedUserSkills = ["Frontend Development (React)", "UX/UI Design (Figma)", "Node.js", "Creative Writing"];

const hardcodedProjectIdeas: ProjectIdea[] = [
  {
    id: "idea1",
    title: "Campus Sustainability App",
    description: "An app to track and promote eco-friendly practices on campus, like waste reduction and energy saving challenges.",
    skillsSought: ["Mobile Dev (React Native)", "Backend (Firebase)", "UI/UX Design"],
    initiator: "Eco Warrior",
    initiatorAvatar: "https://placehold.co/80x80.png",
    dataAiHint: "nature student",
  },
  {
    id: "idea2",
    title: "AI Study Buddy Generator",
    description: "A tool that uses AI to generate personalized study guides and practice questions based on course materials.",
    skillsSought: ["Python (AI/ML)", "Web Dev (Flask/Django)", "NLP"],
    initiator: "Nova Spark",
    initiatorAvatar: "https://placehold.co/80x80.png",
    dataAiHint: "tech innovator",
  },
  {
    id: "idea3",
    title: "Interactive Campus Art Tour",
    description: "A web app for a self-guided tour of public art installations around campus, with AR features.",
    skillsSought: ["Web AR (A-Frame/AR.js)", "3D Modeling", "Content Curation"],
    initiator: "Art Explorer",
    initiatorAvatar: "https://placehold.co/80x80.png",
    dataAiHint: "artist creative",
  },
];

const hardcodedCollaborators: CollaboratorProfile[] = [
  {
    id: "collab1",
    name: "Alex Cipher",
    avatarUrl: "https://placehold.co/80x80.png",
    avatarFallback: "AC",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    interestedIn: "AI-driven projects",
    dataAiHint: "coder profile",
  },
  {
    id: "collab2",
    name: "Lyra Canvas",
    avatarUrl: "https://placehold.co/80x80.png",
    avatarFallback: "LC",
    skills: ["Graphic Design", "Illustration", "Branding"],
    interestedIn: "Visually impactful projects",
    dataAiHint: "designer profile",
  },
];

// Check if the feature is fully implemented
const isFeatureImplemented = false; 

export default function NebulaOfIdeasPage() {
  const { toast } = useToast();

  const handleDemoClick = (message: string) => {
    toast({
      title: "Demo Action",
      description: message,
      duration: 3000,
    });
  };

  if (!isFeatureImplemented) {
    return (
      <div className="container mx-auto px-4 py-12 w-full max-w-4xl text-center">
        <Button asChild variant="outline" className="mb-10 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Rocket className="h-24 w-24 text-primary mx-auto mb-8 animate-pulse" />
        <h1 className="text-5xl font-bold text-primary mb-6">Nebula of Ideas - Hatching Soon!</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Prepare to ignite your innovative projects and discover your dream team!
        </p>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          The Nebula of Ideas will soon be a vibrant hub where you can share your project concepts, showcase your unique skills, find collaborators with the expertise you need, and bring your groundbreaking visions to life. From tech innovations to creative endeavors, this is where campus collaboration will take flight!
        </p>
        <p className="text-md text-accent font-semibold">Get your ideas ready for launch!</p>
      </div>
    );
  }

  // Fully implemented feature content (currently unreachable)
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
          <Lightbulb className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary">Nebula of Ideas</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-10">
          Ignite your innovative projects. Share ideas, find collaborators, and build the future, together.
        </p>
      </div>

      <div className="space-y-10">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Rocket className="mr-3 h-7 w-7 text-accent" />Launch Your Project Idea</CardTitle>
            <CardDescription>Share your concept, goals, and the skills you're seeking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Describe your project idea in detail..." className="min-h-[100px] bg-background/70" />
            <Input placeholder="Skills needed (e.g., React, Python, UX Design)" className="bg-background/70" />
            <Button onClick={() => handleDemoClick("Project idea submitted! (Demo)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Paperclip className="mr-2 h-4 w-4" /> Submit Idea
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Brain className="mr-3 h-7 w-7 text-accent" />Showcase Your Skills</CardTitle>
            <CardDescription>Let others know your areas of expertise to find relevant projects or be discovered.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <h4 className="font-semibold text-foreground">My Current Skills:</h4>
                <div className="flex flex-wrap gap-2">
                {hardcodedUserSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                {hardcodedUserSkills.length === 0 && <p className="text-sm text-muted-foreground">You haven't listed any skills yet.</p>}
                </div>
            </div>
            <Button onClick={() => handleDemoClick("Editing skills... (Demo)")} variant="outline" className="border-accent text-accent hover:bg-accent/10">
              <Edit3 className="mr-2 h-4 w-4" /> Edit My Skills
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Search className="mr-3 h-7 w-7 text-accent" />Explore Project Constellations</CardTitle>
            <CardDescription>Browse existing ideas or search by keywords and skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input placeholder="Search by keyword (e.g., 'AI', 'sustainability')" className="flex-grow bg-background/70" />
              <Input placeholder="Filter by required skill (e.g., 'Python')" className="flex-grow bg-background/70" />
            </div>
             <Button onClick={() => handleDemoClick("Searching projects... (Demo - results below are hardcoded)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Search className="mr-2 h-4 w-4" /> Search Projects
            </Button>
            <Separator className="my-6 bg-border/50" />
            <div className="space-y-4">
              {hardcodedProjectIdeas.map(project => (
                <Card key={project.id} className="p-4 bg-background/50 border-border/50">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                     <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
                        <AvatarImage src={project.initiatorAvatar} alt={project.initiator} data-ai-hint={project.dataAiHint} />
                        <AvatarFallback>{project.initiator.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{project.title}</h4>
                        <p className="text-sm text-foreground/80 mt-1 mb-2">{project.description}</p>
                        <div className="mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Skills Sought: </span> 
                            {project.skillsSought.map(skill => <Badge key={skill} variant="outline" className="mr-1 text-xs">{skill}</Badge>)}
                        </div>
                         <p className="text-xs text-muted-foreground">Initiated by: {project.initiator}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 justify-end">
                    <Button onClick={() => handleDemoClick(`Viewing details for ${project.title} (Demo)`)} size="sm" variant="outline"><Info className="mr-1 h-4 w-4" />View Details</Button>
                    <Button onClick={() => handleDemoClick(`Expressed interest in ${project.title} (Demo)`)} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground"><CheckSquare className="mr-1 h-4 w-4" />Express Interest</Button>
                  </div>
                </Card>
              ))}
              {hardcodedProjectIdeas.length === 0 && <p className="text-muted-foreground">No project ideas found. Be the first to launch one!</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Users className="mr-3 h-7 w-7 text-accent" />Find Your Co-Creators</CardTitle>
            <CardDescription>Connect with students whose skills complement your project needs or interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hardcodedCollaborators.map(collab => (
              <Card key={collab.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-background/50 border-border/50">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={collab.avatarUrl} alt={collab.name} data-ai-hint={collab.dataAiHint} />
                  <AvatarFallback>{collab.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-foreground">{collab.name}</h4>
                   <div className="mt-1 mb-2 flex flex-wrap gap-1">
                    {collab.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                  </div>
                  {collab.interestedIn && <p className="text-sm text-muted-foreground">Interested in: {collab.interestedIn}</p>}
                </div>
                <Button onClick={() => handleDemoClick(`Connecting with ${collab.name} (Demo)`)} size="sm" variant="outline" className="shrink-0 self-start sm:self-center border-accent text-accent hover:bg-accent/10">
                  <UserPlus className="mr-2 h-4 w-4" /> Connect
                </Button>
              </Card>
            ))}
            {hardcodedCollaborators.length === 0 && <p className="text-muted-foreground">No potential collaborators found based on current filters.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><MessageSquare className="mr-3 h-7 w-7 text-accent" />Project Collaboration Hub</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground/90">
              <span>Once your project team is assembled, this space will transform into your mission control! Features for discussion threads, task assignments, file sharing, and progress tracking are on the horizon to help your ideas take flight. </span>
              <Badge variant="outline" className="ml-2 border-accent text-accent">Coming Soon!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><GalleryVerticalEnd className="mr-3 h-7 w-7 text-accent" />Galaxy of Achievements</CardTitle> {/* Changed icon from Trophy */}
          </CardHeader>
          <CardContent>
            <div className="text-foreground/90">
              <span>Future update: A dedicated gallery to showcase the brilliant projects completed by UniVerse student teams. Inspire others and celebrate your collaborative successes! </span>
              <Badge variant="outline" className="ml-2 border-accent text-accent">Coming Soon!</Badge>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

    