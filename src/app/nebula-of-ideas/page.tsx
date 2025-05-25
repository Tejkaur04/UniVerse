
"use client";

import type { FC, FormEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; 
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Lightbulb, Users, Search, MessageSquare, PlusCircle, Brain, Sparkles, CheckCircle, Filter as FilterIcon, Rocket, Home
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Pencil, Info } from 'lucide-react';


// Interfaces
interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  goals: string;
  skillsSought: string[];
  tags: string[];
  initiatorName: string; 
  initiatorId?: string; 
  timestamp: string;
  iconName?: string; 
}

interface UserSkills {
  id: string; 
  skills: string[];
}

// Mock Data / Initial State
const initialProjectIdeas: ProjectIdea[] = [
  { id: 'idea1', title: 'AI Powered Personal Tutor for Quantum Physics', description: 'An AI that explains complex quantum concepts intuitively.', goals: 'Improve student understanding, provide personalized learning paths.', skillsSought: ['Python', 'Machine Learning', 'Physics', 'UI/UX'], tags: ['AI', 'EdTech', 'Quantum'], initiatorName: 'Dr. Astra Vector', timestamp: '2024-05-01', iconName: 'Brain' },
  { id: 'idea2', title: 'Zero-G Culinary Innovations', description: 'Developing delicious and practical food solutions for long-duration space missions.', goals: 'Enhance astronaut morale, optimize nutrition in space.', skillsSought: ['Food Science', 'Engineering', 'Logistics', 'Design'], tags: ['SpaceTech', 'Food', 'Innovation'], initiatorName: 'Chef Cosmo Plate', timestamp: '2024-04-20', iconName: 'Sparkles' },
  { id: 'idea3', title: 'Campus Sustainability Tracker App', description: 'An app to monitor and encourage sustainable practices across campus facilities.', goals: 'Reduce campus carbon footprint, promote eco-awareness.', skillsSought: ['React Native', 'Node.js', 'Data Visualization', 'Project Management'], tags: ['Sustainability', 'Mobile App', 'Social Impact'], initiatorName: 'Eco Guardian Students', timestamp: '2024-05-10', iconName: 'Users' },
];

const initialUserSkills: string[] = ["React", "Node.js", "Spacecraft Design"];

const iconMap: { [key: string]: LucideIcon } = {
  Brain: Brain,
  Sparkles: Sparkles,
  Users: Users,
  DefaultProjectIcon: Lightbulb,
};


const NebulaOfIdeasPage: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("browse"); 

  const userLocalStorageKey = (dataKey: string) => user ? `uniVerse-nebula-${dataKey}-${user.uid}` : `uniVerse-nebula-${dataKey}-guest`;

  // State for project ideas
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(() => {
    if (typeof window === 'undefined') return initialProjectIdeas;
    const saved = localStorage.getItem(userLocalStorageKey('projectIdeas'));
    return saved ? JSON.parse(saved) : initialProjectIdeas;
  });

  const [displayedIdeas, setDisplayedIdeas] = useState<ProjectIdea[]>([]);
  const [isSubmitIdeaDialogOpen, setIsSubmitIdeaDialogOpen] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [newIdeaGoals, setNewIdeaGoals] = useState('');
  const [newIdeaSkillsSought, setNewIdeaSkillsSought] = useState('');
  const [newIdeaTags, setNewIdeaTags] = useState('');

  // State for user skills
  const [mySkills, setMySkills] = useState<string[]>(() => {
     if (typeof window === 'undefined' || !user) return initialUserSkills;
     const saved = localStorage.getItem(userLocalStorageKey('userSkills'));
     try {
        return saved ? (JSON.parse(saved) as UserSkills).skills : initialUserSkills;
     } catch {
        return initialUserSkills;
     }
  });
  const [isEditSkillsDialogOpen, setIsEditSkillsDialogOpen] = useState(false);
  const [editSkillsInput, setEditSkillsInput] = useState('');

  // State for browsing/searching projects
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');


  // Save data to localStorage
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    try {
        localStorage.setItem(userLocalStorageKey('projectIdeas'), JSON.stringify(projectIdeas));
    } catch (error) { console.error("Failed to save projectIdeas", error); }
  }, [projectIdeas, user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    try {
        localStorage.setItem(userLocalStorageKey('userSkills'), JSON.stringify({ id: user.uid, skills: mySkills }));
    } catch (error) { console.error("Failed to save userSkills", error); }
  }, [mySkills, user]);


  // Filter and search logic for projects
  useEffect(() => {
    let filtered = projectIdeas;
    if (searchTerm) {
      filtered = filtered.filter(idea =>
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (skillFilter) {
      filtered = filtered.filter(idea =>
        idea.skillsSought.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    setDisplayedIdeas(filtered);
  }, [projectIdeas, searchTerm, skillFilter]);

  // Handlers
  const handleSubmitIdea = (e: FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim() || !newIdeaDescription.trim()) {
      toast({ variant: 'destructive', title: 'Missing Core Info', description: 'Project Title and Description are essential.' });
      return;
    }
    const newIdea: ProjectIdea = {
      id: `idea-${Date.now()}`,
      title: newIdeaTitle,
      description: newIdeaDescription,
      goals: newIdeaGoals,
      skillsSought: newIdeaSkillsSought.split(',').map(s => s.trim()).filter(s => s),
      tags: newIdeaTags.split(',').map(s => s.trim()).filter(s => s),
      initiatorName: user?.email?.split('@')[0] || 'Anonymous Astronaut',
      initiatorId: user?.uid,
      timestamp: new Date().toISOString(),
      iconName: 'Lightbulb' 
    };
    setProjectIdeas(prev => [newIdea, ...prev]);
    setIsSubmitIdeaDialogOpen(false);
    // Reset form
    setNewIdeaTitle(''); setNewIdeaDescription(''); setNewIdeaGoals(''); setNewIdeaSkillsSought(''); setNewIdeaTags('');
    toast({ title: 'Idea Launched into the Nebula!', description: `${newIdea.title} is now visible. Saved locally.`, action: <CheckCircle className="h-5 w-5 text-green-500" /> });
  };

  const handleEditMySkills = () => {
    setEditSkillsInput(mySkills.join(', '));
    setIsEditSkillsDialogOpen(true);
  };

  const handleSaveMySkills = (e: FormEvent) => {
    e.preventDefault();
    const updatedSkills = editSkillsInput.split(',').map(s => s.trim()).filter(s => s);
    setMySkills(updatedSkills);
    setIsEditSkillsDialogOpen(false);
    toast({ title: 'Skill Matrix Updated!', description: 'Your skills have been recalibrated locally.', action: <CheckCircle className="h-5 w-5 text-green-500" /> });
  };

  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-6xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <div className="text-center">
            <Rocket className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
            <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">Nebula of Ideas</h1>
             <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Ignite collaboration in the Nebula of Ideas! This is your launchpad to share groundbreaking project concepts, discover ongoing student missions, and find your co-pilots to bring innovations to life. 
                Showcase your unique skills, browse ideas, and connect with peers who share your vision. Let's build the future, one project at a time! 
                (All ideas and skills are saved locally in your browser for this demo.)
            </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Submit Idea Card */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <PlusCircle className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Launch Your Project Idea</CardTitle>
            </div>
            <CardDescription>Share your concept and attract collaborators from across the UniVerse.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsSubmitIdeaDialogOpen(true)} className="w-full md:w-auto bg-primary hover:bg-accent hover:text-accent-foreground">
              <Lightbulb className="mr-2 h-5 w-5" /> Submit New Idea
            </Button>
          </CardContent>
        </Card>
        {/* Submit Idea Dialog */}
        <Dialog open={isSubmitIdeaDialogOpen} onOpenChange={setIsSubmitIdeaDialogOpen}>
            <DialogContent className="bg-card border-primary/50 sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="font-mono text-primary flex items-center"><Lightbulb className="mr-2 h-5 w-5"/>Submit Your Project Idea</DialogTitle>
                <DialogDescription>Outline your vision for the UniVerse community.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitIdea} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-2">
                <div><Label htmlFor="newIdeaTitle">Project Title</Label><Input id="newIdeaTitle" value={newIdeaTitle} onChange={e => setNewIdeaTitle(e.target.value)} placeholder="e.g., Interstellar Communication Network" /></div>
                <div><Label htmlFor="newIdeaDescription">Brief Description</Label><Textarea id="newIdeaDescription" value={newIdeaDescription} onChange={e => setNewIdeaDescription(e.target.value)} placeholder="What is your project about?" /></div>
                <div><Label htmlFor="newIdeaGoals">Main Goals</Label><Textarea id="newIdeaGoals" value={newIdeaGoals} onChange={e => setNewIdeaGoals(e.target.value)} placeholder="What do you aim to achieve?" /></div>
                <div><Label htmlFor="newIdeaSkillsSought">Skills Sought (comma-separated)</Label><Input id="newIdeaSkillsSought" value={newIdeaSkillsSought} onChange={e => setNewIdeaSkillsSought(e.target.value)} placeholder="e.g., React, Python, Design" /></div>
                <div><Label htmlFor="newIdeaTags">Tags (comma-separated)</Label><Input id="newIdeaTags" value={newIdeaTags} onChange={e => setNewIdeaTags(e.target.value)} placeholder="e.g., AI, SpaceTech, EdTech" /></div>
                <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsSubmitIdeaDialogOpen(false)}>Cancel Launch</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Launch Idea</Button></DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* My Skills Card */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
            <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Your Skill Constellation</CardTitle>
            </div>
            <CardDescription>Showcase your talents to find relevant projects or be discovered by others.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {mySkills.length > 0 ? mySkills.map(skill => <Badge key={skill} variant="secondary" className="text-lg px-3 py-1 bg-primary/25 text-primary-foreground">{skill}</Badge>) : <p className="text-muted-foreground">No skills defined yet. Add your talents!</p>}
            </div>
            <Button onClick={handleEditMySkills} variant="outline" className="border-accent text-accent hover:bg-accent/10">
              <Pencil className="mr-2 h-4 w-4"/> Edit My Skills
            </Button>
          </CardContent>
        </Card>
        {/* Edit My Skills Dialog */}
        <Dialog open={isEditSkillsDialogOpen} onOpenChange={setIsEditSkillsDialogOpen}>
            <DialogContent className="bg-card border-primary/50 sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-mono text-primary flex items-center"><Sparkles className="mr-2 h-5 w-5"/>Calibrate Your Skill Matrix</DialogTitle>
                <DialogDescription>List your skills, separated by commas.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveMySkills} className="space-y-3 py-2">
                <div><Label htmlFor="editSkillsInput">Your Skills</Label><Textarea id="editSkillsInput" value={editSkillsInput} onChange={e => setEditSkillsInput(e.target.value)} placeholder="e.g., React, Astrophysics, Xenolinguistics" /></div>
                <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsEditSkillsDialogOpen(false)}>Cancel Calibration</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Save Skills</Button></DialogFooter>
            </form>
            </DialogContent>
        </Dialog>

        {/* Browse Projects Card */}
        <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
          <CardHeader>
             <div className="flex items-center space-x-3">
                <Search className="h-8 w-8 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Explore Project Nebulae</CardTitle>
            </div>
            <CardDescription>Discover ongoing missions and find projects that align with your skills and interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="search" placeholder="Search projects by keyword or tag..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-input placeholder:text-muted-foreground" />
            <Input type="search" placeholder="Filter by skill sought..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="bg-input placeholder:text-muted-foreground" />

            <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {displayedIdeas.length > 0 ? displayedIdeas.map(idea => {
                const IdeaIcon = iconMap[idea.iconName || 'DefaultProjectIcon'] || Lightbulb;
                return (
                <Card key={idea.id} className="p-4 bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start space-x-3 mb-2">
                    <IdeaIcon className="h-7 w-7 text-accent shrink-0 mt-1" />
                    <div>
                        <h4 className="font-semibold text-lg text-primary">{idea.title}</h4>
                        <p className="text-xs text-muted-foreground">By: {idea.initiatorName} | Launched: {new Date(idea.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 mb-1 line-clamp-2">{idea.description}</p>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2"><strong className="text-foreground/70">Goals:</strong> {idea.goals}</p>
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-1">Skills Sought:</h5>
                    <div className="flex flex-wrap gap-1">
                      {idea.skillsSought.map(skill => <Badge key={skill} variant="outline" className="text-xs border-primary/50 text-primary">{skill}</Badge>)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-xs font-semibold text-muted-foreground mb-1">Tags:</h5>
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">{tag}</Badge>)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10" onClick={() => toast({title: "Viewing Details (Demo)", description: `Loading more info for ${idea.title}...`})}>
                        <Info className="mr-1 h-4 w-4" /> View Details
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-accent hover:text-accent-foreground" onClick={() => toast({title: "Interest Expressed (Demo)", description: `Sending collaboration signal for ${idea.title}...`})}>
                        <Users className="mr-1 h-4 w-4" /> Express Interest
                    </Button>
                  </div>
                </Card>
              )}) : (
                <p className="text-muted-foreground text-center py-5">No project signals detected with current filters. Try a broader scan!</p>
              )}
            </div>
          </CardContent>
        </Card>
        
         <Card className="shadow-xl bg-card/70 backdrop-blur-md border-primary/30 text-center py-10">
          <CardHeader>
            <div className="flex items-center justify-center space-x-3">
                <Users className="h-10 w-10 text-primary animate-subtle-pulse" />
                <CardTitle className="text-2xl font-mono text-primary">Collaboration & Showcase</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">
              Future modules for team discussions, task management, and showcasing your completed UniVerse projects will appear here.
            </p>
            <Badge variant="outline" className="border-accent/70 text-accent bg-accent/10">Coming Soon to Your Quadrant!</Badge>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default NebulaOfIdeasPage;

    