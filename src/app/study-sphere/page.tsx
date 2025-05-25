
"use client";

import type { FC, FormEvent, ChangeEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; 
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, UserCircle, Search, Users, FileText, CalendarCheck, UsersRound, Home,
  Briefcase, Palette, ThumbsUp, Link2, MessageSquare, XCircle, Pencil, PlusCircle,
  UploadCloud, BookOpen, CheckCircle as CheckCircleIcon, CalendarPlus, ListFilter, Info, BookUser, GripVertical
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces
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

export interface MockStudentProfile {
  id: string;
  name: string;
  year: string;
  department: string;
  profilePictureUrl?: string;
  dataAiHint?: string;
  skills: string[];
  interests: string[];
  projectAreas: string[];
  learningStyles: string[];
  courses: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  courses: string[];
  description: string;
  members: number;
  iconName?: string; 
  isJoinedByCurrentUser?: boolean;
}

interface SharedResource {
  id: string;
  name: string;
  course: string;
  type: string;
  uploader: string;
  uploadDate: string;
  iconName?: string; 
}

interface StudySession {
  id: string;
  topic: string;
  dateTime: string;
  groupOrParticipants: string;
  location: string;
  iconName?: string; 
  isJoinedByCurrentUser?: boolean;
}

const DEPARTMENTS = ["Computer Science", "Quantum Engineering", "Astrobiology", "Xenolinguistics", "Galactic History", "Business Administration", "All"];
const YEARS = ["Fresher", "Sophomore", "Junior", "Senior", "Graduate", "All"];
const LEARNING_STYLES_OPTIONS = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];
const COURSES_OPTIONS = ["Astrophysics 101", "Quantum Mechanics", "Alien Civilizations", "Starship Engineering", "Cosmic Economics", "All"];

const iconMap: { [key: string]: LucideIcon } = {
  Users: Users,
  FileText: FileText,
  CalendarCheck: CalendarCheck,
  DefaultIcon: Info, 
  UserCircle: UserCircle,
  Search: Search,
  BookOpen: BookOpen,
  UploadCloud: UploadCloud,
  PlusCircle: PlusCircle,
  Pencil: Pencil,
  ListFilter: ListFilter,
  Briefcase: Briefcase,
  Palette: Palette,
  GripVertical: GripVertical,
};

// Initial Hardcoded Data (will be loaded from localStorage if available)
const initialProfileData: UserProfile = {
  id: 'currentUser',
  name: 'Alex Comet',
  collegeId: 'STU-007',
  year: 'Junior',
  department: 'Astrophysics',
  profilePictureUrl: 'https://placehold.co/128x128.png?text=AC',
  dataAiHint: 'student space',
  skills: ['Problem Solving', 'Data Analysis', 'Telescope Operation'],
  interests: ['Black Holes', 'Sci-Fi Novels', 'Coding'],
  projectAreas: ['Dark Matter Research', 'Exoplanet Habitability'],
  learningStyles: ['Visual', 'Reading/Writing'],
};

const initialPotentialMatchesData: MockStudentProfile[] = [
  { id: 'student1', name: 'Nova Stargazer', year: 'Sophomore', department: 'Xenolinguistics', skills: ['React', 'Node.js', 'UI/UX'], interests: ['AI', 'Web Development', 'Alien Languages'], projectAreas: ['EdTech App'], profilePictureUrl: 'https://placehold.co/80x80.png?text=NS', dataAiHint: 'student multilingual', learningStyles: ['Auditory', 'Kinesthetic'], courses: ['Alien Civilizations', 'Galactic History'] },
  { id: 'student2', name: 'Orion Nebula', year: 'Junior', department: 'Starship Engineering', skills: ['CAD', 'Prototyping', '3D Printing'], interests: ['Robotics', 'Sustainable Design', 'FTL Drives'], projectAreas: ['Automated Rover', 'Warp Core Design'], profilePictureUrl: 'https://placehold.co/80x80.png?text=ON', dataAiHint: 'engineer student space', learningStyles: ['Kinesthetic', 'Visual'], courses: ['Starship Engineering', 'Quantum Mechanics'] },
  { id: 'student3', name: 'Lyra Pulsar', year: 'Fresher', department: 'Astrobiology', skills: ['Creative Writing', 'Illustration', 'Microscopy'], interests: ['Storytelling', 'Graphic Novels', 'Extremophiles'], projectAreas: ['Campus Zine', 'Life on Mars Simulation'], profilePictureUrl: 'https://placehold.co/80x80.png?text=LP', dataAiHint: 'artist student biology', learningStyles: ['Visual', 'Reading/Writing'], courses: ['Astrophysics 101', 'Alien Civilizations'] },
];

const initialStudyGroupsData: StudyGroup[] = [
  { id: 'group1', name: 'Quantum Entanglement Workshop', courses: ['Quantum Mechanics'], description: 'Weekly deep dives into QM.', members: 5, iconName: 'Users', isJoinedByCurrentUser: false },
  { id: 'group2', name: 'Astro 101 Peer Tutors', courses: ['Astrophysics 101'], description: 'Helping freshers navigate the cosmos.', members: 8, iconName: 'Users', isJoinedByCurrentUser: true },
];

const initialSharedResourcesData: SharedResource[] = [
  { id: 'res1', name: 'Exoplanet Habitability Factors.pdf', course: 'Astrobiology', type: 'PDF', uploader: 'Dr. Elara Vance', uploadDate: '2024-03-15', iconName: 'FileText' },
  { id: 'res2', name: 'FTL Drive Schematics (Classified)', course: 'Starship Engineering', type: 'Diagram', uploader: 'Orion N.', uploadDate: '2024-04-02', iconName: 'FileText' },
];

const initialStudySessionsData: StudySession[] = [
  { id: 'sess1', topic: 'Midterm Prep: Black Holes', dateTime: '2024-05-10 @ 18:00 GST', groupOrParticipants: 'Quantum Entanglement Workshop', location: 'Virtual Holo-Deck 3', iconName: 'CalendarCheck', isJoinedByCurrentUser: false },
  { id: 'sess2', topic: 'Astro 101 Q&A', dateTime: '2024-05-12 @ 14:00 GST', groupOrParticipants: 'Astro 101 Peer Tutors', location: 'Library Observation Deck', iconName: 'CalendarCheck', isJoinedByCurrentUser: true },
];


const StudySpherePage: FC = () => {
  const { user } = useAuth(); 
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  const userLocalStorageKey = (dataKey: string) => user ? `uniVerse-studySphere-${dataKey}-${user.uid}` : `uniVerse-studySphere-${dataKey}-guest`;

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
    if (typeof window === 'undefined' || !user) return;
    localStorage.setItem(userLocalStorageKey(keySuffix), JSON.stringify(data));
  };

  const [studyProfile, setStudyProfile] = useState<UserProfile>(() => loadData('studyProfile', initialProfileData));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(studyProfile);

  const [potentialMatches, setPotentialMatches] = useState<MockStudentProfile[]>(initialPotentialMatchesData);
  const [filteredMatches, setFilteredMatches] = useState<MockStudentProfile[]>(initialPotentialMatchesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('All');
  const [sentRequests, setSentRequests] = useState<string[]>(() => loadData('sentRequests', []));
  const [connections, setConnections] = useState<MockStudentProfile[]>(() => loadData('connections', []));

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => loadData('studyGroups', initialStudyGroupsData));
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCourses, setNewGroupCourses] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const [sharedResources, setSharedResources] = useState<SharedResource[]>(() => loadData('sharedResources', initialSharedResourcesData));
  const [isUploadResourceDialogOpen, setIsUploadResourceDialogOpen] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceCourse, setNewResourceCourse] = useState('');
  const [newResourceType, setNewResourceType] = useState('');

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => loadData('studySessions', initialStudySessionsData));
  const [isScheduleSessionDialogOpen, setIsScheduleSessionDialogOpen] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionDateTime, setNewSessionDateTime] = useState('');
  const [newSessionGroup, setNewSessionGroup] = useState('');
  const [newSessionLocation, setNewSessionLocation] = useState('');
  
  useEffect(() => {
    if (user) {
        setStudyProfile(loadData('studyProfile', { ...initialProfileData, id: user.uid, name: user.email?.split('@')[0] || 'New User' }));
        setSentRequests(loadData('sentRequests', []));
        setConnections(loadData('connections', []));
        setStudyGroups(loadData('studyGroups', initialStudyGroupsData));
        setSharedResources(loadData('sharedResources', initialSharedResourcesData));
        setStudySessions(loadData('studySessions', initialStudySessionsData));
    }
  }, [user]);
  
  useEffect(() => { saveData('studyProfile', studyProfile); }, [studyProfile, user]);
  useEffect(() => { saveData('studyGroups', studyGroups); }, [studyGroups, user]);
  useEffect(() => { saveData('sharedResources', sharedResources); }, [sharedResources, user]);
  useEffect(() => { saveData('studySessions', studySessions); }, [studySessions, user]);
  useEffect(() => { saveData('sentRequests', sentRequests); }, [sentRequests, user]);
  useEffect(() => { saveData('connections', connections); }, [connections, user]);


  const handleEditProfile = () => {
    setEditForm({ ...studyProfile }); 
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.name?.trim() || !editForm.collegeId?.trim()) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Name and College ID are required.'});
      return;
    }
    setStudyProfile(editForm);
    setIsEditDialogOpen(false);
    toast({ title: 'Profile Synchronized!', description: 'Your cosmic coordinates have been updated locally.', action: <CheckCircleIcon className="h-5 w-5 text-green-500" />});
  };

  const handleProfileInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsArrayInputChange = (field: keyof UserProfile, value: string) => {
    const valuesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setEditForm(prev => ({ ...prev, [field]: valuesArray as any })); 
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

  useEffect(() => {
    let matches = potentialMatches; 
    if (searchTerm) {
      matches = matches.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        student.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCourseFilter !== 'All') {
      matches = matches.filter(student => student.courses.includes(selectedCourseFilter));
    }
    if (selectedStyleFilter !== 'All') {
      matches = matches.filter(student => student.learningStyles.includes(selectedStyleFilter));
    }
    if (selectedDepartmentFilter !== 'All') {
      matches = matches.filter(student => student.department === selectedDepartmentFilter);
    }
    setFilteredMatches(matches);
  }, [searchTerm, selectedCourseFilter, selectedStyleFilter, selectedDepartmentFilter, potentialMatches]);

  const handleConnect = (student: MockStudentProfile) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Mock user session not found.' });
      return;
    }
    if (!connections.find(c => c.id === student.id)) {
      setConnections(prev => [...prev, student]);
    }
    setSentRequests(prev => [...new Set([...prev, student.id])]);
    toast({ title: 'Connection Request Transmitted!', description: `Signal sent to ${student.name}. (Simulated auto-acceptance for demo). Your connections list is updated locally.`, action: <ThumbsUp className="h-5 w-5 text-green-500" />});
  };

  const handleCreateGroup = (e: FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupCourses.trim()) {
      toast({ variant: 'destructive', title: 'Incomplete Data', description: 'Group Name and Courses are required.' });
      return;
    }
    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      courses: newGroupCourses.split(',').map(s => s.trim()).filter(s => s),
      description: newGroupDescription,
      members: 1,
      iconName: 'Users',
      isJoinedByCurrentUser: true,
    };
    setStudyGroups(prev => [newGroup, ...prev]);
    setIsCreateGroupDialogOpen(false);
    setNewGroupName(''); setNewGroupCourses(''); setNewGroupDescription('');
    toast({ title: 'New Study Orbit Formed!', description: `${newGroup.name} is now active. Progress saved locally in your browser.`, action: <CheckCircleIcon className="h-5 w-5 text-green-500"/> });
  };

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(prevGroups => prevGroups.map(group => {
      if (group.id === groupId && !group.isJoinedByCurrentUser) {
        toast({ title: "Joined Study Orbit!", description: `You've joined ${group.name}. Progress saved locally.`, action: <CheckCircleIcon className="h-5 w-5 text-green-500"/> });
        return { ...group, members: group.members + 1, isJoinedByCurrentUser: true };
      }
      return group;
    }));
  };

  const handleUploadResource = (e: FormEvent) => {
    e.preventDefault();
    if (!newResourceName.trim() || !newResourceCourse.trim() || !newResourceType.trim()) {
      toast({ variant: 'destructive', title: 'Incomplete Data', description: 'All fields are required for resource upload.' });
      return;
    }
    const newResource: SharedResource = {
      id: `res-${Date.now()}`,
      name: newResourceName,
      course: newResourceCourse,
      type: newResourceType,
      uploader: studyProfile.name || 'Current User',
      uploadDate: new Date().toISOString().split('T')[0],
      iconName: 'FileText',
    };
    setSharedResources(prev => [newResource, ...prev]);
    setIsUploadResourceDialogOpen(false);
    setNewResourceName(''); setNewResourceCourse(''); setNewResourceType('');
    toast({ title: 'Resource Transmitted to Nebula!', description: `${newResource.name} is now available. Progress saved locally.`, action: <CheckCircleIcon className="h-5 w-5 text-green-500"/> });
  };

  const handleScheduleSession = (e: FormEvent) => {
    e.preventDefault();
    if (!newSessionTopic.trim() || !newSessionDateTime.trim()) {
      toast({ variant: 'destructive', title: 'Incomplete Data', description: 'Topic and Date/Time are required.' });
      return;
    }
    const newSession: StudySession = {
      id: `sess-${Date.now()}`,
      topic: newSessionTopic,
      dateTime: newSessionDateTime,
      groupOrParticipants: newSessionGroup || 'Open to All',
      location: newSessionLocation || 'Virtual Classroom Alpha',
      iconName: 'CalendarCheck',
      isJoinedByCurrentUser: true,
    };
    setStudySessions(prev => [newSession, ...prev]);
    setIsScheduleSessionDialogOpen(false);
    setNewSessionTopic(''); setNewSessionDateTime(''); setNewSessionGroup(''); setNewSessionLocation('');
    toast({ title: 'Study Orbit Synchronized!', description: `Session "${newSession.topic}" scheduled. Progress saved locally.`, action: <CheckCircleIcon className="h-5 w-5 text-green-500"/> });
  };

  const handleJoinSession = (sessionId: string) => {
    setStudySessions(prevSessions => prevSessions.map(session => {
      if (session.id === sessionId) {
        const nowJoined = !session.isJoinedByCurrentUser;
        toast({
          title: nowJoined ? "Joined Synchronized Orbit!" : "Left Synchronized Orbit",
          description: nowJoined ? `You've joined "${session.topic}".` : `You've left "${session.topic}". Progress saved locally.`,
          action: <CheckCircleIcon className="h-5 w-5 text-green-500"/>
        });
        return { ...session, isJoinedByCurrentUser: nowJoined };
      }
      return session;
    }));
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };
  
  return (
    <div className="w-full">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Back to UniVerse Home
          </Link>
        </Button>
        <div className="text-center">
            <UsersRound className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
            <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">Study Sphere</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Welcome, cosmic voyager! Forge academic alliances, share celestial wisdom, and coordinate your study orbits.
            </p>
             <p className="text-sm text-muted-foreground mt-2"> (Your profile and other progress here is saved in your browser for this demo session!)</p>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          Navigate through your profile, find study buddies, manage groups, share resources, and schedule sessions all in one place.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 mb-8 border-b border-border pb-1">
          <TabsTrigger value="profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
            <UserCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> My Profile
          </TabsTrigger>
          <TabsTrigger value="browse" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
            <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Find Buddies
          </TabsTrigger>
          <TabsTrigger value="groups" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
            <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Study Groups
          </TabsTrigger>
          <TabsTrigger value="resources" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
            <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Resources
          </TabsTrigger>
          <TabsTrigger value="sessions" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent group">
            <CalendarCheck className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Sessions
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[400px]" // Ensure content area has some min height
          >
            {/* My Profile Tab */}
            {activeTab === "profile" && (
              <TabsContent value="profile" forceMount>
                <Card className="w-full shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader className="text-center relative">
                    <BookUser className="mx-auto h-20 w-20 text-primary mb-3 animate-subtle-pulse" />
                    <CardTitle className="text-3xl font-bold font-mono text-primary">{studyProfile.name}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {studyProfile.department} - {studyProfile.year}
                    </CardDescription>
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={handleEditProfile} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-accent">
                                <Pencil className="h-5 w-5" /> <span className="sr-only">Edit Profile</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-primary/50 sm:max-w-[525px]">
                            <DialogHeader>
                              <DialogTitle className="font-mono text-primary flex items-center"><Pencil className="mr-2 h-5 w-5"/>Edit Your Study Coordinates</DialogTitle>
                              <DialogDescription>Update your profile. Changes are saved locally in your browser.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveProfile} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
                              <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={editForm.name || ''} onChange={handleProfileInputChange} /></div>
                              <div><Label htmlFor="collegeId">College ID</Label><Input id="collegeId" name="collegeId" value={editForm.collegeId || ''} onChange={handleProfileInputChange} /></div>
                              <div><Label htmlFor="year">Year</Label><Input id="year" name="year" value={editForm.year || ''} onChange={handleProfileInputChange} /></div>
                              <div><Label htmlFor="department">Department</Label><Input id="department" name="department" value={editForm.department || ''} onChange={handleProfileInputChange} /></div>
                              <div><Label htmlFor="profilePictureUrl">Profile Picture URL</Label><Input id="profilePictureUrl" name="profilePictureUrl" value={editForm.profilePictureUrl || ''} onChange={handleProfileInputChange} /></div>
                              <div><Label htmlFor="skills">Skills (comma-separated)</Label><Textarea id="skills" name="skills" value={(Array.isArray(editForm.skills) ? editForm.skills : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('skills', e.target.value)} /></div>
                              <div><Label htmlFor="interests">Interests (comma-separated)</Label><Textarea id="interests" name="interests" value={(Array.isArray(editForm.interests) ? editForm.interests : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('interests', e.target.value)} /></div>
                              <div><Label htmlFor="projectAreas">Project Areas (comma-separated)</Label><Textarea id="projectAreas" name="projectAreas" value={(Array.isArray(editForm.projectAreas) ? editForm.projectAreas : []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('projectAreas', e.target.value)} /></div>
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
                              <DialogFooter className="pt-4">
                                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                  </CardHeader>
                  <CardContent className="mt-6 space-y-6">
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">College ID:</h3><p className="text-foreground/90">{studyProfile.collegeId || 'Not Set'}</p></div> <Separator className="my-3 bg-border/50" />
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Profile Picture:</h3>
                      {studyProfile.profilePictureUrl ? (
                        <Image src={studyProfile.profilePictureUrl} alt={studyProfile.name} width={128} height={128} className="rounded-md object-cover border border-primary/30" data-ai-hint={studyProfile.dataAiHint || 'student avatar'}/>
                      ) : (
                        <p className="text-sm text-muted-foreground">No picture set.</p>
                      )}
                    </div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Skills:</h3><div className="flex flex-wrap gap-2">{studyProfile.skills?.length > 0 ? studyProfile.skills.map(skill => <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">{skill}</Badge>) : <p className="text-sm text-muted-foreground">No skills charted.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Interests:</h3><div className="flex flex-wrap gap-2">{studyProfile.interests?.length > 0 ? studyProfile.interests.map(interest => <Badge key={interest} className="bg-accent/80 text-accent-foreground hover:bg-accent">{interest}</Badge>) : <p className="text-sm text-muted-foreground">No interests logged.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Project Areas:</h3><div className="flex flex-wrap gap-2">{studyProfile.projectAreas?.length > 0 ? studyProfile.projectAreas.map(area => <Badge key={area} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">{area}</Badge>) : <p className="text-sm text-muted-foreground">No project areas declared.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">Preferred Learning Styles:</h3><div className="flex flex-wrap gap-2">{studyProfile.learningStyles?.length > 0 ? studyProfile.learningStyles.map(style => <Badge key={style} className="bg-muted text-muted-foreground">{style}</Badge>) : <p className="text-sm text-muted-foreground">No learning styles set.</p>}</div></div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {activeTab === "browse" && (
              <TabsContent value="browse" forceMount>
                 <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3"><Search className="h-8 w-8 text-primary animate-subtle-pulse" /><CardTitle className="text-2xl font-mono text-primary">Find Your Constellation</CardTitle></div>
                    <CardDescription className="text-muted-foreground">Filter and search for potential study partners. Your connections are saved locally!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Input type="search" placeholder="Search by name, skill, interest..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-input placeholder:text-muted-foreground" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}><SelectTrigger className="bg-input"><div className="flex items-center"><ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />Course</div></SelectTrigger><SelectContent className="bg-popover border-primary/50">{COURSES_OPTIONS.map(course => <SelectItem key={course} value={course} className="hover:!bg-primary/20 focus:!bg-primary/20">{course}</SelectItem>)}</SelectContent></Select>
                      <Select value={selectedStyleFilter} onValueChange={setSelectedStyleFilter}><SelectTrigger className="bg-input"><div className="flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Learning Style</div></SelectTrigger><SelectContent className="bg-popover border-primary/50">{["All", ...LEARNING_STYLES_OPTIONS].map(style => <SelectItem key={style} value={style} className="hover:!bg-primary/20 focus:!bg-primary/20">{style}</SelectItem>)}</SelectContent></Select>
                      <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}><SelectTrigger className="bg-input"><div className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Department</div></SelectTrigger><SelectContent className="bg-popover border-primary/50">{DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept} className="hover:!bg-primary/20 focus:!bg-primary/20">{dept}</SelectItem>)}</SelectContent></Select>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-8">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map(student => (
                        <Card key={student.id} className="flex flex-col bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                            <Avatar className="h-16 w-16 border-2 border-accent"><Image src={student.profilePictureUrl || `https://placehold.co/80x80.png?text=${student.name.charAt(0)}`} alt={student.name} width={64} height={64} className="rounded-full object-cover" data-ai-hint={student.dataAiHint || 'student portrait'}/><AvatarFallback>{student.name.charAt(0)}</AvatarFallback></Avatar>
                            <div><CardTitle className="text-lg text-primary">{student.name}</CardTitle><CardDescription className="text-xs text-muted-foreground">{student.department} - {student.year}</CardDescription></div>
                          </CardHeader>
                          <CardContent className="space-y-2 flex-grow text-sm">
                            <div><h4 className="text-xs font-semibold text-muted-foreground mb-1">Interests:</h4><div className="flex flex-wrap gap-1">{student.interests.slice(0,3).map(i => <Badge key={i} className="text-xs bg-accent/80 text-accent-foreground">{i}</Badge>)} {student.interests.length > 3 && <Badge variant="outline" className="text-xs">+{student.interests.length-3}</Badge>}</div></div>
                            <div><h4 className="text-xs font-semibold text-muted-foreground mb-1">Skills:</h4><div className="flex flex-wrap gap-1">{student.skills.slice(0,3).map(s => <Badge key={s} variant="secondary" className="text-xs bg-primary/20 text-primary-foreground">{s}</Badge>)} {student.skills.length > 3 && <Badge variant="outline" className="text-xs">+{student.skills.length-3}</Badge>}</div></div>
                            <div><h4 className="text-xs font-semibold text-muted-foreground mb-1">Project Areas:</h4><div className="flex flex-wrap gap-1">{student.projectAreas.slice(0,2).map(p => <Badge key={p} variant="outline" className="text-xs border-primary/50 text-primary">{p}</Badge>)} {student.projectAreas.length > 2 && <Badge variant="outline" className="text-xs">+{student.projectAreas.length-2}</Badge>}</div></div>
                          </CardContent>
                          <CardFooter>
                            <Button onClick={() => handleConnect(student)} disabled={sentRequests.includes(student.id)} variant={sentRequests.includes(student.id) ? "secondary" : "default"} className={`w-full ${sentRequests.includes(student.id) ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-accent hover:text-accent-foreground'}`}>
                              <Link2 className="mr-2 h-4 w-4" /> {sentRequests.includes(student.id) ? 'Signal Sent' : 'Transmit Connect Signal'}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : ( <Card className="text-center py-10 bg-background/50 border border-border/50 shadow-md"><CardContent><Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-primary">No Comets in This Sector</h3><p className="text-muted-foreground">Try adjusting your scan parameters (filters).</p></CardContent></Card>)}
                </div>
              </TabsContent>
            )}

            {activeTab === "groups" && (
              <TabsContent value="groups" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                   <CardHeader>
                     <div className="flex items-center space-x-3"><Users className="h-8 w-8 text-primary animate-subtle-pulse" /><CardTitle className="text-2xl font-mono text-primary">Collaborative Orbits</CardTitle></div>
                    <CardDescription className="text-muted-foreground">Form or join study constellations. Groups are saved locally.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                                <PlusCircle className="mr-2 h-5 w-5" /> Create New Study Orbit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-primary/50">
                            <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><PlusCircle className="mr-2 h-5 w-5"/>Form a New Study Orbit</DialogTitle><DialogDescription>Define your new collaborative constellation.</DialogDescription></DialogHeader>
                            <form onSubmit={handleCreateGroup} className="space-y-3 py-2">
                            <div><Label htmlFor="newGroupName">Orbit Name</Label><Input id="newGroupName" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} /></div>
                            <div><Label htmlFor="newGroupCourses">Relevant Courses (comma-separated)</Label><Input id="newGroupCourses" value={newGroupCourses} onChange={e => setNewGroupCourses(e.target.value)} /></div>
                            <div><Label htmlFor="newGroupDescription">Description</Label><Textarea id="newGroupDescription" value={newGroupDescription} onChange={e => setNewGroupDescription(e.target.value)} /></div>
                            <DialogFooter className="pt-3"><DialogClose asChild><Button type="button" variant="outline">Cancel Mission</Button></DialogClose><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Launch Orbit</Button></DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Join Existing Orbits:</h3>
                    {studyGroups.length > 0 ? (
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                        {studyGroups.map(group => {
                            const GroupIcon = iconMap[group.iconName || 'DefaultIcon'] || iconMap.DefaultIcon;
                            return (
                            <Card key={group.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                                <GroupIcon className="h-8 w-8 text-accent shrink-0" />
                                <div>
                                <h4 className="font-semibold text-md text-primary">{group.name}</h4>
                                <p className="text-xs text-muted-foreground">{group.description}</p>
                                <p className="text-xs text-muted-foreground">Courses: {group.courses.join(', ')} | Members: {group.members}</p>
                                </div>
                            </div>
                            <Button onClick={() => handleJoinGroup(group.id)} disabled={group.isJoinedByCurrentUser} variant={group.isJoinedByCurrentUser ? "secondary" : "outline"} size="sm" className={group.isJoinedByCurrentUser ? "bg-muted cursor-not-allowed text-muted-foreground" : "border-accent text-accent hover:bg-accent/10"}>
                                {group.isJoinedByCurrentUser ? <><CheckCircleIcon className="mr-2 h-4 w-4"/>Joined Orbit</> : <><Link2 className="mr-2 h-4 w-4"/>Join Orbit</>}
                            </Button>
                            </Card>
                        );
                        })}
                        </div>
                    ) : ( <p className="text-muted-foreground">No study orbits formed yet. Be the first to chart one!</p> )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {activeTab === "resources" && (
              <TabsContent value="resources" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3"><FileText className="h-8 w-8 text-primary animate-subtle-pulse" /><CardTitle className="text-2xl font-mono text-primary">Knowledge Nebula</CardTitle></div>
                    <CardDescription className="text-muted-foreground">Share and discover study materials. Resources are saved locally.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isUploadResourceDialogOpen} onOpenChange={setIsUploadResourceDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                                <UploadCloud className="mr-2 h-5 w-5" /> Transmit New Resource
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-primary/50">
                            <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><UploadCloud className="mr-2 h-5 w-5"/>Transmit Resource to Nebula</DialogTitle><DialogDescription>Share your valuable study materials.</DialogDescription></DialogHeader>
                            <form onSubmit={handleUploadResource} className="space-y-3 py-2">
                            <div><Label htmlFor="newResourceName">Resource Name</Label><Input id="newResourceName" value={newResourceName} onChange={e => setNewResourceName(e.target.value)} /></div>
                            <div><Label htmlFor="newResourceCourse">Relevant Course</Label><Input id="newResourceCourse" value={newResourceCourse} onChange={e => setNewResourceCourse(e.target.value)} /></div>
                            <div><Label htmlFor="newResourceType">Type (e.g., PDF, Notes, Link)</Label><Input id="newResourceType" value={newResourceType} onChange={e => setNewResourceType(e.target.value)} /></div>
                            <DialogFooter className="pt-3"><DialogClose asChild><Button type="button" variant="outline">Cancel Transmission</Button></DialogClose><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Transmit Resource</Button></DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Available Databanks:</h3>
                    {sharedResources.length > 0 ? (
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {sharedResources.map(res => {
                            const ResourceIcon = iconMap[res.iconName || 'DefaultIcon'] || iconMap.DefaultIcon;
                            return (
                            <Card key={res.id} className="p-3 flex items-center justify-between bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                             <div className="flex items-center space-x-3">
                                <ResourceIcon className="h-6 w-6 text-accent shrink-0" />
                                <div>
                                    <h4 className="font-medium text-primary text-sm">{res.name}</h4>
                                    <p className="text-xs text-muted-foreground">Course: {res.course} | Type: {res.type} | Uploaded: {res.uploadDate} by {res.uploader}</p>
                                </div>
                             </div>
                              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10" onClick={() => toast({title: "Download Initiated (Demo)", description: `Downloading ${res.name}...`})}>Download</Button>
                            </Card>
                        );
                        })}
                        </div>
                    ) : ( <p className="text-muted-foreground">The nebula is clear. Share the first piece of wisdom!</p> )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {activeTab === "sessions" && (
              <TabsContent value="sessions" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3"><CalendarCheck className="h-8 w-8 text-primary animate-subtle-pulse" /><CardTitle className="text-2xl font-mono text-primary">Synchronized Orbits</CardTitle></div>
                    <CardDescription className="text-muted-foreground">Plan and join study sessions. Sessions are saved locally.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isScheduleSessionDialogOpen} onOpenChange={setIsScheduleSessionDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                                <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Orbit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-primary/50">
                            <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><PlusCircle className="mr-2 h-5 w-5"/>Synchronize a New Study Orbit</DialogTitle><DialogDescription>Coordinate your next study session.</DialogDescription></DialogHeader>
                            <form onSubmit={handleScheduleSession} className="space-y-3 py-2">
                            <div><Label htmlFor="newSessionTopic">Topic / Subject</Label><Input id="newSessionTopic" value={newSessionTopic} onChange={e => setNewSessionTopic(e.target.value)} /></div>
                            <div><Label htmlFor="newSessionDateTime">Date & Time</Label><Input id="newSessionDateTime" value={newSessionDateTime} onChange={e => setNewSessionDateTime(e.target.value)} /></div>
                            <div><Label htmlFor="newSessionGroup">Group / Participants</Label><Input id="newSessionGroup" value={newSessionGroup} onChange={e => setNewSessionGroup(e.target.value)} /></div>
                            <div><Label htmlFor="newSessionLocation">Location / Platform</Label><Input id="newSessionLocation" value={newSessionLocation} onChange={e => setNewSessionLocation(e.target.value)} /></div>
                            <DialogFooter className="pt-3"><DialogClose asChild><Button type="button" variant="outline">Cancel Synchronization</Button></DialogClose><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Schedule Orbit</Button></DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming Synchronizations:</h3>
                     {studySessions.length > 0 ? (
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                        {studySessions.map(sess => {
                            const SessionIcon = iconMap[sess.iconName || 'DefaultIcon'] || iconMap.DefaultIcon;
                            return (
                            <Card key={sess.id} className="p-3 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                        <SessionIcon className="h-6 w-6 text-accent shrink-0" />
                                        <div>
                                            <h4 className="font-medium text-primary text-sm">{sess.topic}</h4>
                                            <p className="text-xs text-muted-foreground">When: {sess.dateTime} | Where: {sess.location}</p>
                                            <p className="text-xs text-muted-foreground">Participants: {sess.groupOrParticipants}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleJoinSession(sess.id)} variant={sess.isJoinedByCurrentUser ? "default" : "outline"} size="sm" className={sess.isJoinedByCurrentUser ? "bg-accent text-accent-foreground hover:bg-accent/80" : "border-accent text-accent hover:bg-accent/10"}>
                                      {sess.isJoinedByCurrentUser ? <><CheckCircleIcon className="mr-2 h-4 w-4"/>Joined Orbit</> : <><CalendarPlus className="mr-2 h-4 w-4"/>Join Orbit</>}
                                    </Button>
                                </div>
                            </Card>
                        );
                        })}
                        </div>
                    ) : ( <p className="text-muted-foreground">No study orbits scheduled. Initiate one!</p> )}
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

export default StudySpherePage;
