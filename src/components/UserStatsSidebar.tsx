
"use client";

import type { FC } from 'react';
import { useEffect, useState, type FormEvent, type ChangeEvent, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Brain, FlaskConical, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Settings, HelpCircle, Waypoints, Pencil, CheckCircle as CheckCircleIcon, Link2 as ConnectionsIcon
} from 'lucide-react';
import type { MockStudentProfile } from '@/app/study-sphere/page'; // For connection object structure


// Define UserProfile interface
export interface UserProfile {
  id: string;
  name: string;
  collegeId: string;
  year: string;
  department: string;
  profilePictureUrl?: string;
  dataAiHint?: string;
  skills: string[];
  interests: string[];
  projectAreas: string[];
  learningStyles: string[];
}

const DEPARTMENTS = ["Computer Science", "Quantum Engineering", "Astrobiology", "Xenolinguistics", "Galactic History", "Business Administration", "Astrophysics", "Starship Engineering", "Undeclared"];
const YEARS = ["Fresher", "Sophomore", "Junior", "Senior", "Graduate", "Alumni"];
const LEARNING_STYLES_OPTIONS = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];

const initialProfileData: UserProfile = {
  id: 'currentUser',
  name: 'New Explorer',
  collegeId: 'N/A',
  year: YEARS[0],
  department: DEPARTMENTS[DEPARTMENTS.length - 1],
  profilePictureUrl: 'https://placehold.co/128x128.png?text=U',
  dataAiHint: 'student avatar',
  skills: [],
  interests: [],
  projectAreas: [],
  learningStyles: [],
};

const navFeatures = [
  { href: "/study-sphere", label: "Study Sphere", icon: UsersRound },
  { href: "/event-horizon", label: "Event Horizon", icon: CalendarDays },
  { href: "/celestial-chats", label: "Celestial Chats", icon: MessageCircleQuestion },
  { href: "/nebula-of-ideas", label: "Nebula of Ideas", icon: Lightbulb },
  { href: "/my-connections", label: "My Connections", icon: ConnectionsIcon },
];

const UserStatsSidebar: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const userLocalStorageKey = useCallback((dataKey: string): string | null => {
    return user ? `uniVerse-${dataKey}-${user.uid}` : null;
  }, [user]);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(initialProfileData);

  const fetchUserData = useCallback(() => {
    if (user && user.uid) {
      setIsLoading(true);
      const profileKey = userLocalStorageKey('studyProfile');
      const connectionsKey = userLocalStorageKey('connections');

      if (profileKey) {
        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile) as UserProfile;
            setProfile(parsedProfile);
            setEditForm(parsedProfile); 
          } catch (e) {
            console.error("Error parsing profile from localStorage", e);
            const newProfile: UserProfile = {
              ...initialProfileData,
              id: user.uid,
              name: user.email?.split('@')[0] || 'New Explorer',
              profilePictureUrl: `https://placehold.co/128x128.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
              dataAiHint: 'student avatar',
            };
            setProfile(newProfile);
            setEditForm(newProfile);
            localStorage.setItem(profileKey, JSON.stringify(newProfile));
          }
        } else {
          const newProfile: UserProfile = {
            ...initialProfileData,
            id: user.uid,
            name: user.email?.split('@')[0] || 'New Explorer',
            profilePictureUrl: `https://placehold.co/128x128.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
            dataAiHint: 'student avatar',
          };
          setProfile(newProfile);
          setEditForm(newProfile);
          localStorage.setItem(profileKey, JSON.stringify(newProfile));
        }
      }

      if (connectionsKey) {
        const savedConnections = localStorage.getItem(connectionsKey);
        if (savedConnections) {
          try {
            const parsedConnections = JSON.parse(savedConnections) as MockStudentProfile[];
            setConnectionsCount(parsedConnections.length);
          } catch (e) {
            console.error("Error parsing connections from localStorage", e);
            setConnectionsCount(0);
          }
        } else {
          setConnectionsCount(0);
        }
      } else {
        setConnectionsCount(0);
      }

      setIsLoading(false);
    } else if (!user) {
      setIsLoading(false);
      setProfile(null);
      setConnectionsCount(0);
    }
  }, [user, userLocalStorageKey]);

  useEffect(() => {
    fetchUserData(); 

    const handleConnectionsUpdate = () => {
      const connectionsKey = userLocalStorageKey('connections');
      if (connectionsKey) {
        const savedConnections = localStorage.getItem(connectionsKey);
        if (savedConnections) {
          try {
            const parsedConnections = JSON.parse(savedConnections) as MockStudentProfile[];
            setConnectionsCount(parsedConnections.length);
          } catch (e) {
            console.error("Error parsing connections from localStorage on event", e);
            setConnectionsCount(0);
          }
        } else {
          setConnectionsCount(0);
        }
      }
    };

    window.addEventListener('connectionsUpdated', handleConnectionsUpdate);

    return () => {
      window.removeEventListener('connectionsUpdated', handleConnectionsUpdate);
    };
  }, [user, isEditDialogOpen, fetchUserData, userLocalStorageKey]);


  const handleEditProfile = () => {
    if (profile) {
      setEditForm({ ...profile }); 
    } else if (user) { 
      const newProfile: UserProfile = {
        ...initialProfileData,
        id: user.uid,
        name: user.email?.split('@')[0] || 'New Explorer',
        profilePictureUrl: `https://placehold.co/128x128.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
        dataAiHint: 'student avatar',
      };
      setEditForm(newProfile);
    }
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.name?.trim() || !editForm.collegeId?.trim()) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Name and College ID are required.'});
      return;
    }
    const profileToSave: UserProfile = {
        ...initialProfileData, // Ensure all fields are present
        ...editForm,
        skills: Array.isArray(editForm.skills) ? editForm.skills : [],
        interests: Array.isArray(editForm.interests) ? editForm.interests : [],
        projectAreas: Array.isArray(editForm.projectAreas) ? editForm.projectAreas : [],
        learningStyles: Array.isArray(editForm.learningStyles) ? editForm.learningStyles : [],
    };

    setProfile(profileToSave); 
    const profileKey = userLocalStorageKey('studyProfile');
    if (profileKey) {
      localStorage.setItem(profileKey, JSON.stringify(profileToSave));
    }
    setIsEditDialogOpen(false);
    toast({ title: 'Profile Synchronized!', description: 'Your cosmic coordinates have been updated locally.', action: <CheckCircleIcon className="h-5 w-5 text-green-500" />});
  };
  
  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsArrayInputChange = (field: keyof Pick<UserProfile, 'skills' | 'interests' | 'projectAreas'>, value: string) => {
    const valuesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setEditForm(prev => ({ ...prev, [field]: valuesArray })); 
  };

  const handleLearningStylesChange = (style: string, checked: boolean) => {
    setEditForm(prev => {
      const currentStyles = Array.isArray(prev.learningStyles) ? prev.learningStyles : [];
      const newStyles = checked 
        ? [...currentStyles, style] 
        : currentStyles.filter(s => s !== style);
      return { ...prev, learningStyles: newStyles };
    });
  };

  if (!user) { 
    return null; 
  }
  
  if (isLoading && !profile) { 
    return (
      <aside className="hidden md:flex w-[25rem] h-screen flex-col border-r border-border/70 bg-card/70 backdrop-blur-sm p-6 sticky top-0 overflow-y-auto shadow-lg items-center justify-center">
        {/* Sidebar Skeleton or Loader if needed */}
      </aside>
    );
  }

  const skills = profile?.skills || [];
  const projectAreas = profile?.projectAreas || [];

  return (
    <>
    <aside className="hidden md:flex w-[25rem] h-screen flex-col border-r border-border/70 bg-card/70 backdrop-blur-sm p-6 sticky top-0 overflow-y-auto shadow-lg">
      <div className="flex-grow space-y-6">
         {/* Removed UniVerse logo and title from here */}

        <nav className="space-y-1 mt-4"> {/* Added mt-4 for spacing if logo was above */}
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigate</h3>
          {navFeatures.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-sm py-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <Separator className="bg-border/50" />

        <div>
            <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Stats</h3>
            <Card className="bg-background/40 border-primary/20 shadow-inner">
                <CardHeader className="pb-1 pt-2.5">
                <CardTitle className="text-sm font-mono text-primary flex items-center">
                    <ConnectionsIcon className="mr-2 h-4 w-4" />
                    Connections Made
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2.5">
                <p className="text-2xl font-bold text-accent">{connectionsCount}</p>
                </CardContent>
            </Card>

            <Card className="mt-2 bg-background/40 border-primary/20 shadow-inner">
                <CardHeader className="pb-1 pt-2.5">
                <CardTitle className="text-sm font-mono text-primary flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    My Skills
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2.5 max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {skills.length > 0 ? (
                    skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="mr-1 mb-1 bg-primary/20 text-primary-foreground text-xs">
                        {skill}
                    </Badge>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground">No skills defined.</p>
                )}
                </CardContent>
            </Card>
            
            <Card className="mt-2 bg-background/40 border-primary/20 shadow-inner">
                <CardHeader className="pb-1 pt-2.5">
                <CardTitle className="text-sm font-mono text-primary flex items-center">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    My Project Areas
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2.5 max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {projectAreas.length > 0 ? (
                    projectAreas.map((area) => (
                    <Badge key={area} variant="outline" className="mr-1 mb-1 border-accent/50 text-accent text-xs">
                        {area}
                    </Badge>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground">No project areas.</p>
                )}
                </CardContent>
            </Card>
        </div>
      </div>

      <div className="mt-auto space-y-1 pt-4 border-t border-border/50">
         <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md"
              onClick={handleEditProfile} 
            >
              <Pencil className="mr-3 h-5 w-5" />
              Edit My Profile
          </Button>
         <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md"
              onClick={() => toast({title: "Settings (Demo)", description: "This would open application settings."})} 
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
          </Button>
          <Button
              variant="ghost"
              className="w-full justify-start text-sm py-2.5 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-md"
              onClick={() => toast({title: "Help & Support (Demo)", description: "This would open a help center."})} 
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Help & Support
          </Button>
      </div>
    </aside>

    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-primary/50 sm:max-w-[525px]">
        <DialogHeader>
            <DialogTitle className="font-mono text-primary flex items-center"><Pencil className="mr-2 h-5 w-5"/>Edit Your UniVerse Coordinates</DialogTitle>
            <DialogDescription>Update your profile. Changes are saved locally to your browser.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveProfile} className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div><Label htmlFor="edit-name">Name</Label><Input id="edit-name" name="name" value={editForm.name || ''} onChange={handleProfileInputChange} /></div>
            <div><Label htmlFor="edit-collegeId">College ID</Label><Input id="edit-collegeId" name="collegeId" value={editForm.collegeId || ''} onChange={handleProfileInputChange} /></div>
            
            <div>
                <Label htmlFor="edit-year">Year</Label>
                <Select name="year" value={editForm.year || ''} onValueChange={(value) => setEditForm(prev => ({...prev, year: value}))}>
                    <SelectTrigger id="edit-year" className="bg-input"><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent className="bg-popover border-primary/50">
                        {YEARS.map(year => <SelectItem key={year} value={year} className="hover:!bg-primary/20 focus:!bg-primary/20">{year}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="edit-department">Department</Label>
                <Select name="department" value={editForm.department || ''} onValueChange={(value) => setEditForm(prev => ({...prev, department: value}))}>
                     <SelectTrigger id="edit-department" className="bg-input"><SelectValue placeholder="Select department" /></SelectTrigger>
                     <SelectContent className="bg-popover border-primary/50">
                        {DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept} className="hover:!bg-primary/20 focus:!bg-primary/20">{dept}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div><Label htmlFor="edit-profilePictureUrl">Profile Picture URL</Label><Input id="edit-profilePictureUrl" name="profilePictureUrl" value={editForm.profilePictureUrl || ''} onChange={handleProfileInputChange} placeholder="https://placehold.co/128x128.png" /></div>
            <div><Label htmlFor="edit-dataAiHint">Profile Picture AI Hint (Optional)</Label><Input id="edit-dataAiHint" name="dataAiHint" value={editForm.dataAiHint || ''} onChange={handleProfileInputChange} placeholder="e.g., student avatar" /></div>

            <div><Label htmlFor="edit-skills">Skills (comma-separated)</Label><Textarea id="edit-skills" value={(Array.isArray(editForm.skills) ? editForm.skills : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('skills', e.target.value)} placeholder="e.g., Quantum Physics, FTL Piloting" /></div>
            <div><Label htmlFor="edit-interests">Interests (comma-separated)</Label><Textarea id="edit-interests" value={(Array.isArray(editForm.interests) ? editForm.interests : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('interests', e.target.value)} placeholder="e.g., Black Holes, Xenobotany" /></div>
            <div><Label htmlFor="edit-projectAreas">Project Areas (comma-separated)</Label><Textarea id="edit-projectAreas" value={(Array.isArray(editForm.projectAreas) ? editForm.projectAreas : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('projectAreas', e.target.value)} placeholder="e.g., Dark Matter Research, Alien Diplomacy"/></div>
            <div>
            <Label>Preferred Learning Styles</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
                {LEARNING_STYLES_OPTIONS.map(style => (
                <div key={style} className="flex items-center space-x-2">
                    <Checkbox id={`style-${style}`} checked={(Array.isArray(editForm.learningStyles) ? editForm.learningStyles : []).includes(style)} onCheckedChange={(checked) => handleLearningStylesChange(style, !!checked)} />
                    <Label htmlFor={`style-${style}`} className="font-normal text-sm">{style}</Label>
                </div>
                ))}
            </div>
            </div>
            <DialogFooter className="pt-3"><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Save Changes</Button></DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
    </>
  );
};

export default UserStatsSidebar;
    
