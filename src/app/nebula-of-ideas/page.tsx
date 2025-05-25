
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket, Lightbulb, Search, UserPlus, Users, MessageSquare, Star, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  skillsSought: string[];
  initiator: string;
  icon: LucideIcon;
  dataAiHint?: string;
}

interface CollaboratorProfile {
  id: string;
  name: string;
  skills: string[];
  interestedIn?: string; // e.g., project title
  avatar: string;
  dataAiHint?: string;
}

const hardcodedProjects: ProjectIdea[] = [
  {
    id: "proj1",
    title: "AI-Powered Campus Tour Guide",
    description: "Developing an interactive AI that can guide new students around campus, answering questions and highlighting points of interest.",
    skillsSought: ["Python", "NLP", "Frontend Dev"],
    initiator: "Lyra S.",
    icon: Lightbulb,
    dataAiHint: "robot guide"
  },
  {
    id: "proj2",
    title: "Sustainable Campus Initiative App",
    description: "An app to track and promote sustainable practices on campus, like waste reduction and energy conservation, with gamification.",
    skillsSought: ["React Native", "Node.js", "UI/UX Design"],
    initiator: "Orion B.",
    icon: Lightbulb,
    dataAiHint: "eco app"
  },
];

const hardcodedCollaborators: CollaboratorProfile[] = [
    { id: "collab1", name: "Alex Cosmo", skills: ["Python", "Data Analysis"], interestedIn: "AI-Powered Campus Tour Guide", avatar: "https://placehold.co/80x80.png", dataAiHint: "student profile" },
    { id: "collab2", name: "Nova Stellar", skills: ["UI/UX Design", "Figma"], interestedIn: "Sustainable Campus Initiative App", avatar: "https://placehold.co/80x80.png", dataAiHint: "designer profile" },
];

const userSkills = ["Frontend Dev", "React", "TypeScript"];


export default function NebulaOfIdeasPage() {
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
          <Rocket className="h-16 w-16 text-primary mr-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-primary">Nebula of Ideas</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-10">
          Ignite innovation! Share your project concepts, find collaborators, and bring your visions to life.
        </p>
      </div>

      <div className="space-y-10">
        {/* Share Your Project Idea */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Lightbulb className="mr-3 h-7 w-7 text-accent" />Launch Your Project Spark</CardTitle>
            <CardDescription>Describe your concept, goals, and the skills you're seeking in collaborators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Project Title (e.g., Interstellar Navigation App)" className="bg-background/70" />
            <Textarea placeholder="Describe your project idea, its goals, and what makes it unique..." className="min-h-[100px] bg-background/70" />
            <Input placeholder="Skills Needed (comma-separated, e.g., Python, UI/UX, Marketing)" className="bg-background/70" />
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleDemoAction("Submitting your project idea! (Demo)")}>
              <Rocket className="mr-2 h-4 w-4" /> Submit Idea
            </Button>
          </CardContent>
        </Card>

        {/* Tag Your Skills */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Star className="mr-3 h-7 w-7 text-accent" />Showcase Your Talents</CardTitle>
            <CardDescription>Let others know your areas of expertise. (This is a demo display).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {userSkills.map(skill => <Badge key={skill} variant="secondary" className="text-md">{skill}</Badge>)}
            </div>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10" onClick={() => handleDemoAction("Opening skill editor... (Demo)")}>
              Edit My Skills
            </Button>
          </CardContent>
        </Card>

        {/* Explore Existing Ideas */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Search className="mr-3 h-7 w-7 text-accent" />Explore Project Constellations</CardTitle>
            <CardDescription>Browse projects shared by other UniVerse explorers or search by keywords/skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
                <Input placeholder="Search by keyword..." className="flex-grow bg-background/70" />
                <Input placeholder="Search by skills needed..." className="flex-grow bg-background/70" />
            </div>
            <Button className="w-full" onClick={() => handleDemoAction("Searching projects... (Demo)")}>
              <Search className="mr-2 h-4 w-4" /> Search Projects
            </Button>
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Featured Projects:</h3>
              {hardcodedProjects.map(project => (
                <Card key={project.id} className="p-4 bg-background/50 border-border/50">
                  <div className="flex items-start space-x-3">
                     <project.icon className="h-8 w-8 text-accent mt-1 shrink-0" />
                     <div className="flex-grow">
                        <h4 className="font-semibold text-xl text-foreground">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">Initiated by: {project.initiator}</p>
                        <p className="text-sm text-foreground/80 mt-1">{project.description}</p>
                        <div className="mt-2">
                            <span className="text-xs font-semibold text-muted-foreground">Skills Sought: </span>
                            {project.skillsSought.map(skill => <Badge key={skill} variant="outline" className="text-xs mr-1 border-accent/70 text-accent/90">{skill}</Badge>)}
                        </div>
                     </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleDemoAction(`Viewing details for ${project.title} (Demo)`)}>View Details</Button>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleDemoAction(`Expressing interest in ${project.title} (Demo)`)}>
                      <UserPlus className="mr-1 h-4 w-4" /> Express Interest
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Find Co-Creators */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Users className="mr-3 h-7 w-7 text-accent" />Find Your Co-Creators</CardTitle>
            <CardDescription>Discover students whose skills complement your project needs (Demo profiles).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {hardcodedCollaborators.map(collab => (
                <Card key={collab.id} className="p-4 flex items-center space-x-4 bg-background/50 border-border/50">
                    <img src={collab.avatar} alt={collab.name} data-ai-hint={collab.dataAiHint} className="h-16 w-16 rounded-full object-cover" />
                    <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{collab.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {collab.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                        </div>
                        {collab.interestedIn && <p className="text-xs text-muted-foreground mt-1">Interested in: {collab.interestedIn}</p>}
                    </div>
                    <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent/10" onClick={() => handleDemoAction(`Connecting with ${collab.name} (Demo)`)}>
                        <UserPlus className="mr-1 h-4 w-4" /> Connect
                    </Button>
                </Card>
             ))}
          </CardContent>
        </Card>

        {/* Project Collaboration Hub */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><MessageSquare className="mr-3 h-7 w-7 text-accent" />Project Command Center (Coming Soon!)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This will be your dedicated space for team communication, task management, and progress tracking once you've assembled your star-fleet! Features like shared task lists, discussion threads, and file sharing are on the horizon.
              <Badge variant="outline" className="ml-2 border-accent text-accent">Coming Soon!</Badge>
            </p>
          </CardContent>
        </Card>

        {/* Galaxy of Achievements */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><CheckSquare className="mr-3 h-7 w-7 text-accent" />Galaxy of Achievements (Coming Soon!)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A future constellation in UniVerse will be dedicated to showcasing successfully completed projects. Inspire others and display your collaborative triumphs here!
              <Badge variant="outline" className="ml-2 border-accent text-accent">Coming Soon!</Badge>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
