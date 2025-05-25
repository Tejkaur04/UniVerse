
"use client";

import type { FC, FormEvent } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; // Mock Auth
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, UserCircle, Search, Users, FileText, CalendarCheck, UsersRound,
  Briefcase, Palette, ThumbsUp, Link2, MessageSquare, XCircle, Pencil, PlusCircle,
  UploadCloud, BookOpen, CheckCircle, CalendarPlus, GripVertical, ListFilter
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // For placeholder images

// PeerConnect Aligned Interfaces
export interface UserProfile {
  id: string;
  name: string;
  collegeId: string;
  year: string;
  department: string;
  profilePictureUrl?: string;
  skills: string[]; // Comma-separated in input, array in state
  interests: string[]; // Comma-separated in input, array in state
  projectAreas: string[]; // Comma-separated in input, array in state
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
  courses: string[]; // Added for course matching
}

interface StudyGroup {
  id: string;
  name: string;
  courses: string[];
  description: string;
  members: number;
  icon?: LucideIcon; // Optional icon for the group
  isJoinedByCurrentUser?: boolean;
}

interface SharedResource {
  id: string;
  name: string;
  course: string;
  type: string; // e.g., PDF, Notes, Link
  uploader: string; // User's name or ID
  uploadDate: string;
  icon?: LucideIcon;
}

interface StudySession {
  id: string;
  topic: string;
  dateTime: string;
  groupOrParticipants: string;
  location: string;
  icon?: LucideIcon;
  isJoinedByCurrentUser?: boolean;
}

const DEPARTMENTS = ["Computer Science", "Quantum Engineering", "Astrobiology", "Xenolinguistics", "Galactic History", "Business Administration", "All"];
const YEARS = ["Fresher", "Sophomore", "Junior", "Senior", "Graduate", "All"];
const LEARNING_STYLES_OPTIONS = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];
const COURSES_OPTIONS = ["Astrophysics 101", "Quantum Mechanics", "Alien Civilizations", "Starship Engineering", "Cosmic Economics", "All"];


// Initial Hardcoded Data (will be loaded from localStorage if available)
const initialProfile: UserProfile = {
  id: 'currentUser',
  name: 'Alex Comet',
  collegeId: 'STU-007',
  year: 'Junior',
  department: 'Astrophysics',
  profilePictureUrl: 'https://placehold.co/128x128.png?text=AC',
  skills: ['Problem Solving', 'Data Analysis', 'Telescope Operation'],
  interests: ['Black Holes', 'Sci-Fi Novels', 'Coding'],
  projectAreas: ['Dark Matter Research', 'Exoplanet Habitability'],
  learningStyles: ['Visual', 'Reading/Writing'],
};

const initialPotentialMatches: MockStudentProfile[] = [
  { id: 'student1', name: 'Nova Stargazer', year: 'Sophomore', department: 'Xenolinguistics', skills: ['React', 'Node.js', 'UI/UX'], interests: ['AI', 'Web Development', 'Alien Languages'], projectAreas: ['EdTech App', 'Translation Software'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'student multilingual', learningStyles: ['Auditory', 'Kinesthetic'], courses: ['Alien Civilizations', 'Galactic History'] },
  { id: 'student2', name: 'Orion Nebula', year: 'Junior', department: 'Starship Engineering', skills: ['CAD', 'Prototyping', '3D Printing'], interests: ['Robotics', 'Sustainable Design', 'FTL Drives'], projectAreas: ['Automated Rover', 'Warp Core Design'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'engineer student space', learningStyles: ['Kinesthetic', 'Visual'], courses: ['Starship Engineering', 'Quantum Mechanics'] },
  { id: 'student3', name: 'Lyra Pulsar', year: 'Fresher', department: 'Astrobiology', skills: ['Creative Writing', 'Illustration', 'Microscopy'], interests: ['Storytelling', 'Graphic Novels', 'Extremophiles'], projectAreas: ['Campus Zine', 'Life on Mars Simulation'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'artist student biology', learningStyles: ['Visual', 'Reading/Writing'], courses: ['Astrophysics 101', 'Alien Civilizations'] },
];

const initialStudyGroups: StudyGroup[] = [
  { id: 'group1', name: 'Quantum Entanglement Workshop', courses: ['Quantum Mechanics'], description: 'Weekly deep dives into QM.', members: 5, icon: Users, isJoinedByCurrentUser: false },
  { id: 'group2', name: 'Astro 101 Peer Tutors', courses: ['Astrophysics 101'], description: 'Helping freshers navigate the cosmos.', members: 8, icon: Users, isJoinedByCurrentUser: true },
];

const initialSharedResources: SharedResource[] = [
  { id: 'res1', name: 'Exoplanet Habitability Factors.pdf', course: 'Astrobiology', type: 'PDF', uploader: 'Dr. Elara Vance', uploadDate: '2024-03-15', icon: FileText },
  { id: 'res2', name: 'FTL Drive Schematics (Classified)', course: 'Starship Engineering', type: 'Diagram', uploader: 'Orion N.', uploadDate: '2024-04-02', icon: FileText },
];

const initialStudySessions: StudySession[] = [
  { id: 'sess1', topic: 'Midterm Prep: Black Holes', dateTime: '2024-05-10 @ 18:00 Galactic Standard Time', groupOrParticipants: 'Quantum Entanglement Workshop', location: 'Virtual Holo-Deck 3', icon: CalendarCheck, isJoinedByCurrentUser: false },
  { id: 'sess2', topic: 'Astro 101 Q&A', dateTime: '2024-05-12 @ 14:00 GST', groupOrParticipants: 'Astro 101 Peer Tutors', location: 'Library Observation Deck', icon: CalendarCheck, isJoinedByCurrentUser: true },
];


const StudySpherePage: FC = () => {
  const { user } = useAuth(); // Mock Auth
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Key for localStorage based on mock user ID
  const userLocalStorageKey = (dataKey: string) => user ? `uniVerse-${dataKey}-${user.uid}` : `uniVerse-${dataKey}-guest`;

  // My Profile State
  const [studyProfile, setStudyProfile] = useState<UserProfile>(initialProfile);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  // Find Buddies State
  const [potentialMatches, setPotentialMatches] = useState<MockStudentProfile[]>(initialPotentialMatches); // This remains mock for browsing
  const [filteredMatches, setFilteredMatches] = useState<MockStudentProfile[]>(initialPotentialMatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('All');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('All');
  const [sentRequests, setSentRequests] = useState<string[]>([]); // IDs of students a request was sent to

  // Study Groups State
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialStudyGroups);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCourses, setNewGroupCourses] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  // Shared Resources State
  const [sharedResources, setSharedResources] = useState<SharedResource[]>(initialSharedResources);
  const [isUploadResourceDialogOpen, setIsUploadResourceDialogOpen] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceCourse, setNewResourceCourse] = useState('');
  const [newResourceType, setNewResourceType] = useState('');

  // Study Sessions State
  const [studySessions, setStudySessions] = useState<StudySession[]>(initialStudySessions);
  const [isScheduleSessionDialogOpen, setIsScheduleSessionDialogOpen] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionDateTime, setNewSessionDateTime] = useState('');
  const [newSessionGroup, setNewSessionGroup] = useState('');
  const [newSessionLocation, setNewSessionLocation] = useState('');

  // Stats State
  const [numConnections, setNumConnections] = useState(0);
  const [numMySkills, setNumMySkills] = useState(0);
  const [numMyProjectTags, setNumMyProjectTags] = useState(0);


  // Load all data from localStorage on mount
  useEffect(() => {
    if (!user) return; // Ensure user context is available for keying

    const loadData = <T,>(key: string, fallbackData: T): T => {
      try {
        const saved = localStorage.getItem(userLocalStorageKey(key));
        if (saved) {
          return JSON.parse(saved) as T;
        }
      } catch (error) {
        console.error(`Failed to load ${key} from localStorage`, error);
      }
      return fallbackData;
    };

    const loadedProfile = loadData<UserProfile>('studyProfile', initialProfile);
    setStudyProfile(loadedProfile);
    setEditForm(loadedProfile); // Initialize edit form

    setStudyGroups(loadData<StudyGroup[]>('studyGroups', initialStudyGroups));
    setSharedResources(loadData<SharedResource[]>('sharedResources', initialSharedResources));
    setStudySessions(loadData<StudySession[]>('studySessions', initialStudySessions));
    setSentRequests(loadData<string[]>('sentRequests', []));

    const connections = loadData<MockStudentProfile[]>('connections', []);
    setNumConnections(connections.length);
    setNumMySkills(loadedProfile.skills.length);
    setNumMyProjectTags(loadedProfile.projectAreas.length);

  }, [user]);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(userLocalStorageKey('studyProfile'), JSON.stringify(studyProfile));
      setNumMySkills(studyProfile.skills.length); // Update stats
      setNumMyProjectTags(studyProfile.projectAreas.length); // Update stats
    } catch (error) { console.error("Failed to save studyProfile to localStorage", error); }
  }, [studyProfile, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(userLocalStorageKey('studyGroups'), JSON.stringify(studyGroups));
    } catch (error) { console.error("Failed to save studyGroups to localStorage", error); }
  }, [studyGroups, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(userLocalStorageKey('sharedResources'), JSON.stringify(sharedResources));
    } catch (error) { console.error("Failed to save sharedResources to localStorage", error); }
  }, [sharedResources, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(userLocalStorageKey('studySessions'), JSON.stringify(studySessions));
    } catch (error) { console.error("Failed to save studySessions to localStorage", error); }
  }, [studySessions, user]);

  useEffect(() => {
    if(!user) return;
    try {
        localStorage.setItem(userLocalStorageKey('sentRequests'), JSON.stringify(sentRequests));
    } catch (error) { console.error("Failed to save sentRequests to localStorage", error); }
  }, [sentRequests, user]);


  // My Profile Logic
  const handleEditProfile = () => {
    setEditForm({ ...studyProfile }); // Populate form with current profile
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!editForm.name?.trim() || !editForm.collegeId?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Name and College ID are required.',
      });
      return;
    }
    const updatedProfile = { ...studyProfile, ...editForm } as UserProfile;
    setStudyProfile(updatedProfile);
    setIsEditDialogOpen(false);
    toast({
      title: 'Profile Synchronized!',
      description: 'Your cosmic coordinates have been updated locally.',
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsArrayInputChange = (field: keyof UserProfile, value: string) => {
    const valuesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setEditForm(prev => ({ ...prev, [field]: valuesArray }));
  };

  const handleLearningStylesChange = (style: string, checked: boolean) => {
    setEditForm(prev => {
      const currentStyles = prev.learningStyles || [];
      if (checked) {
        return { ...prev, learningStyles: [...currentStyles, style] };
      } else {
        return { ...prev, learningStyles: currentStyles.filter(s => s !== style) };
      }
    });
  };

  // Find Buddies Logic
  useEffect(() => {
    let matches = initialPotentialMatches; // Start with all mock students
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
  }, [searchTerm, selectedCourseFilter, selectedStyleFilter, selectedDepartmentFilter]);

  const handleConnect = (student: MockStudentProfile) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be "logged in" (demo) to connect.' });
      return;
    }
    const connectionsKey = userLocalStorageKey('connections');
    const currentConnections: MockStudentProfile[] = JSON.parse(localStorage.getItem(connectionsKey) || '[]');
    if (!currentConnections.find(c => c.id === student.id)) {
      const newConnections = [...currentConnections, student];
      localStorage.setItem(connectionsKey, JSON.stringify(newConnections));
      setNumConnections(newConnections.length); // Update stat
    }
    setSentRequests(prev => [...prev, student.id]);
    toast({
      title: 'Connection Request Transmitted!',
      description: `Signal sent to ${student.name}. (Simulated auto-acceptance for demo). Your progress is saved in your browser.`,
      action: <ThumbsUp className="h-5 w-5 text-green-500" />
    });
  };


  // Study Groups Logic
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
      members: 1, // Creator is the first member
      icon: Users,
      isJoinedByCurrentUser: true,
    };
    setStudyGroups(prev => [newGroup, ...prev]);
    setIsCreateGroupDialogOpen(false);
    setNewGroupName(''); setNewGroupCourses(''); setNewGroupDescription('');
    toast({ title: 'New Study Orbit Formed!', description: `${newGroup.name} is now active. Your progress saved locally.`, action: <CheckCircle className="h-5 w-5 text-green-500"/> });
  };

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(prevGroups => prevGroups.map(group => {
      if (group.id === groupId && !group.isJoinedByCurrentUser) {
        toast({ title: "Joined Study Orbit!", description: `You've joined ${group.name}. Progress saved locally.`, action: <CheckCircle className="h-5 w-5 text-green-500"/> });
        return { ...group, members: group.members + 1, isJoinedByCurrentUser: true };
      }
      return group;
    }));
  };

  // Shared Resources Logic
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
      icon: FileText,
    };
    setSharedResources(prev => [newResource, ...prev]);
    setIsUploadResourceDialogOpen(false);
    setNewResourceName(''); setNewResourceCourse(''); setNewResourceType('');
    toast({ title: 'Resource Transmitted to Nebula!', description: `${newResource.name} is now available. Progress saved locally.`, action: <CheckCircle className="h-5 w-5 text-green-500"/> });
  };

  // Study Sessions Logic
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
      icon: CalendarCheck,
      isJoinedByCurrentUser: true, // Creator auto-joins
    };
    setStudySessions(prev => [newSession, ...prev]);
    setIsScheduleSessionDialogOpen(false);
    setNewSessionTopic(''); setNewSessionDateTime(''); setNewSessionGroup(''); setNewSessionLocation('');
    toast({ title: 'Study Orbit Synchronized!', description: `Session "${newSession.topic}" scheduled. Progress saved locally.`, action: <CheckCircle className="h-5 w-5 text-green-500"/> });
  };

  const handleJoinSession = (sessionId: string) => {
    setStudySessions(prevSessions => prevSessions.map(session => {
      if (session.id === sessionId) {
        const nowJoined = !session.isJoinedByCurrentUser;
        toast({
          title: nowJoined ? "Joined Synchronized Orbit!" : "Left Synchronized Orbit",
          description: nowJoined ? `You've joined "${session.topic}".` : `You've left "${session.topic}". Progress saved locally.`,
          action: <CheckCircle className="h-5 w-5 text-green-500"/>
        });
        return { ...session, isJoinedByCurrentUser: nowJoined };
      }
      return session;
    }));
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Memoize stats to prevent unnecessary recalculations
  const stats = useMemo(() => ({
    connections: numConnections,
    skills: studyProfile.skills?.length || 0,
    projectTags: studyProfile.projectAreas?.length || 0,
  }), [numConnections, studyProfile.skills, studyProfile.projectAreas]);


  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-6xl"> {/* Increased max-width */}
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to UniVerse Home
          </Link>
        </Button>
        <div className="text-center">
            <UsersRound className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
            <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">Study Sphere</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Forge academic alliances, share celestial wisdom, and coordinate your study orbits.
                Your progress here is saved in your browser for this session!
            </p>
        </div>
      </div>

      {/* Stats Section */}
      <Card className="mb-10 shadow-xl bg-card/70 backdrop-blur-md border-primary/30 p-2">
        <CardContent className="p-4 !pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-3xl font-bold text-accent">{stats.connections}</h3>
              <p className="text-sm text-muted-foreground">Connections Made</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-accent">{stats.skills}</h3>
              <p className="text-sm text-muted-foreground">My Skills Listed</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-accent">{stats.projectTags}</h3>
              <p className="text-sm text-muted-foreground">My Project Areas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 mb-8 border-b border-border pb-1">
          <TabsTrigger value="profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:scale-[1.03] data-[state=active]:shadow-lg data-[state=active]:bg-accent/5 hover:text-accent group">
            <UserCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> My Profile
          </TabsTrigger>
          <TabsTrigger value="browse" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:scale-[1.03] data-[state=active]:shadow-lg data-[state=active]:bg-accent/5 hover:text-accent group">
            <Search className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Find Buddies
          </TabsTrigger>
          <TabsTrigger value="groups" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:scale-[1.03] data-[state=active]:shadow-lg data-[state=active]:bg-accent/5 hover:text-accent group">
            <Users className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Study Groups
          </TabsTrigger>
          <TabsTrigger value="resources" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:scale-[1.03] data-[state=active]:shadow-lg data-[state=active]:bg-accent/5 hover:text-accent group">
            <FileText className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Resources
          </TabsTrigger>
          <TabsTrigger value="sessions" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold data-[state=active]:scale-[1.03] data-[state=active]:shadow-lg data-[state=active]:bg-accent/5 hover:text-accent group">
            <CalendarCheck className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" /> Sessions
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* My Profile Tab */}
            {activeTab === "profile" && (
              <TabsContent value="profile" forceMount>
                <Card className="w-full max-w-3xl mx-auto shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader className="text-center relative">
                    <UserCircle className="mx-auto h-20 w-20 text-primary mb-3 animate-subtle-pulse" />
                    <CardTitle className="text-3xl font-bold font-mono text-primary">{studyProfile.name}</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                      {studyProfile.department} - {studyProfile.year}
                    </CardDescription>
                    <Button onClick={handleEditProfile} variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-accent">
                        <Pencil className="h-5 w-5" /> <span className="sr-only">Edit Profile</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="mt-6 space-y-6">
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">College ID:</h3><p className="text-foreground/90">{studyProfile.collegeId || 'Not Set'}</p></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Profile Picture URL:</h3><p className="text-foreground/90 truncate">{studyProfile.profilePictureUrl || 'Not Set'}</p></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Skills:</h3><div className="flex flex-wrap gap-2">{studyProfile.skills?.length > 0 ? studyProfile.skills.map(skill => <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary-foreground hover:bg-primary/30">{skill}</Badge>) : <p className="text-sm text-muted-foreground">No skills charted.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Interests:</h3><div className="flex flex-wrap gap-2">{studyProfile.interests?.length > 0 ? studyProfile.interests.map(interest => <Badge key={interest} variant="default" className="bg-accent/80 text-accent-foreground hover:bg-accent">{interest}</Badge>) : <p className="text-sm text-muted-foreground">No interests logged.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">My Project Areas:</h3><div className="flex flex-wrap gap-2">{studyProfile.projectAreas?.length > 0 ? studyProfile.projectAreas.map(area => <Badge key={area} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">{area}</Badge>) : <p className="text-sm text-muted-foreground">No project areas declared.</p>}</div></div> <Separator className="my-3 bg-border/50" />
                    <div><h3 className="text-sm font-semibold text-muted-foreground mb-2">Preferred Learning Styles:</h3><div className="flex flex-wrap gap-2">{studyProfile.learningStyles?.length > 0 ? studyProfile.learningStyles.map(style => <Badge key={style} className="bg-muted text-muted-foreground">{style}</Badge>) : <p className="text-sm text-muted-foreground">No learning styles set.</p>}</div></div>
                  </CardContent>
                </Card>
                {/* Edit Profile Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="bg-card border-primary/50 sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle className="font-mono text-primary flex items-center"><Pencil className="mr-2 h-5 w-5"/>Edit Your Cosmic Coordinates</DialogTitle>
                      <DialogDescription>Update your profile details. This information is saved locally in your browser.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProfile} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-2">
                      <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={editForm.name || ''} onChange={handleProfileInputChange} placeholder="e.g., Alex Comet" /></div>
                      <div><Label htmlFor="collegeId">College ID</Label><Input id="collegeId" name="collegeId" value={editForm.collegeId || ''} onChange={handleProfileInputChange} placeholder="e.g., STU-007" /></div>
                      <div><Label htmlFor="year">Year</Label><Input id="year" name="year" value={editForm.year || ''} onChange={handleProfileInputChange} placeholder="e.g., Junior" /></div>
                      <div><Label htmlFor="department">Department</Label><Input id="department" name="department" value={editForm.department || ''} onChange={handleProfileInputChange} placeholder="e.g., Astrophysics" /></div>
                      <div><Label htmlFor="profilePictureUrl">Profile Picture URL</Label><Input id="profilePictureUrl" name="profilePictureUrl" value={editForm.profilePictureUrl || ''} onChange={handleProfileInputChange} placeholder="https://placehold.co/128x128.png" /></div>
                      <div><Label htmlFor="skills">Skills (comma-separated)</Label><Textarea id="skills" name="skills" value={(editForm.skills || []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('skills' as keyof UserProfile, e.target.value)} placeholder="e.g., Telescope Operation, Data Analysis" /></div>
                      <div><Label htmlFor="interests">Interests (comma-separated)</Label><Textarea id="interests" name="interests" value={(editForm.interests || []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('interests' as keyof UserProfile, e.target.value)} placeholder="e.g., Black Holes, Sci-Fi Novels" /></div>
                      <div><Label htmlFor="projectAreas">Project Areas (comma-separated)</Label><Textarea id="projectAreas" name="projectAreas" value={(editForm.projectAreas || []).join(', ')} onChange={(e) => handleSkillsArrayInputChange('projectAreas' as keyof UserProfile, e.target.value)} placeholder="e.g., Dark Matter Research" /></div>
                      <div>
                        <Label>Preferred Learning Styles</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {LEARNING_STYLES_OPTIONS.map(style => (
                            <div key={style} className="flex items-center space-x-2">
                              <Checkbox
                                id={`style-${style}`}
                                checked={(editForm.learningStyles || []).includes(style)}
                                onCheckedChange={(checked) => handleLearningStylesChange(style, !!checked)}
                              />
                              <Label htmlFor={`style-${style}`} className="font-normal text-sm">{style}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Save Changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            )}

            {/* Find Buddies Tab */}
            {activeTab === "browse" && (
              <TabsContent value="browse" forceMount>
                 <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                       <Search className="h-8 w-8 text-primary animate-subtle-pulse" />
                       <CardTitle className="text-2xl font-mono text-primary">Find Your Constellation</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">Filter and search for potential study partners.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Input type="search" placeholder="Search by name, skill, interest..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-input placeholder:text-muted-foreground" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}>
                        <SelectTrigger className="bg-input"><div className="flex items-center"><ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />Course</div></SelectTrigger>
                        <SelectContent className="bg-popover border-primary/50">
                          {COURSES_OPTIONS.map(course => <SelectItem key={course} value={course} className="hover:!bg-primary/20 focus:!bg-primary/20">{course}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStyleFilter} onValueChange={setSelectedStyleFilter}>
                        <SelectTrigger className="bg-input"><div className="flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Learning Style</div></SelectTrigger>
                        <SelectContent className="bg-popover border-primary/50">
                          {["All", ...LEARNING_STYLES_OPTIONS].map(style => <SelectItem key={style} value={style} className="hover:!bg-primary/20 focus:!bg-primary/20">{style}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={selectedDepartmentFilter} onValueChange={setSelectedDepartmentFilter}>
                        <SelectTrigger className="bg-input"><div className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Department</div></SelectTrigger>
                        <SelectContent className="bg-popover border-primary/50">
                          {DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept} className="hover:!bg-primary/20 focus:!bg-primary/20">{dept}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-8">
                  {filteredMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMatches.map(student => (
                        <Card key={student.id} className="flex flex-col bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                          <CardHeader className="flex flex-row items-start space-x-4 pb-3">
                            <Avatar className="h-16 w-16 border-2 border-accent">
                              <Image src={student.profilePictureUrl || `https://placehold.co/80x80.png?text=${student.name.charAt(0)}`} alt={student.name} width={64} height={64} className="rounded-full object-cover" data-ai-hint={student.dataAiHint || 'student portrait'}/>
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg text-primary">{student.name}</CardTitle>
                              <CardDescription className="text-xs text-muted-foreground">{student.department} - {student.year}</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2 flex-grow text-sm">
                            <div><h4 className="text-xs font-semibold text-muted-foreground mb-1">Interests:</h4><div className="flex flex-wrap gap-1">{student.interests.slice(0,3).map(i => <Badge key={i} variant="default" className="text-xs bg-accent/80 text-accent-foreground">{i}</Badge>)} {student.interests.length > 3 && <Badge variant="outline" className="text-xs">+{student.interests.length-3}</Badge>}</div></div>
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
                  ) : (
                    <Card className="text-center py-10 bg-background/50 border border-border/50 shadow-md"><CardContent><Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-primary">No Comets in This Sector</h3><p className="text-muted-foreground">Try adjusting your scan parameters (filters).</p></CardContent></Card>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Study Groups Tab */}
             {activeTab === "groups" && (
              <TabsContent value="groups" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                   <CardHeader>
                     <div className="flex items-center space-x-3">
                        <Users className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Collaborative Orbits</CardTitle>
                     </div>
                    <CardDescription className="text-muted-foreground">Form or join study constellations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsCreateGroupDialogOpen(true)} className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                      <PlusCircle className="mr-2 h-5 w-5" /> Create New Study Orbit
                    </Button>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Join Existing Orbits:</h3>
                    {studyGroups.length > 0 ? (
                        <div className="space-y-4">
                        {studyGroups.map(group => (
                            <Card key={group.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                                {group.icon && <group.icon className="h-8 w-8 text-accent shrink-0" />}
                                <div>
                                <h4 className="font-semibold text-md text-primary">{group.name}</h4>
                                <p className="text-xs text-muted-foreground">{group.description}</p>
                                <p className="text-xs text-muted-foreground">Courses: {group.courses.join(', ')} | Members: {group.members}</p>
                                </div>
                            </div>
                            <Button onClick={() => handleJoinGroup(group.id)} disabled={group.isJoinedByCurrentUser} variant={group.isJoinedByCurrentUser ? "secondary" : "outline"} size="sm" className={group.isJoinedByCurrentUser ? "bg-muted cursor-not-allowed" : "border-accent text-accent hover:bg-accent/10"}>
                                {group.isJoinedByCurrentUser ? <><CheckCircle className="mr-2 h-4 w-4"/>Joined Orbit</> : <><Link2 className="mr-2 h-4 w-4"/>Join Orbit</>}
                            </Button>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No study orbits formed yet. Be the first to chart one!</p>
                    )}
                  </CardContent>
                </Card>
                {/* Create Group Dialog */}
                <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                  <DialogContent className="bg-card border-primary/50">
                    <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><PlusCircle className="mr-2 h-5 w-5"/>Form a New Study Orbit</DialogTitle><DialogDescription>Define your new collaborative constellation.</DialogDescription></DialogHeader>
                    <form onSubmit={handleCreateGroup} className="space-y-3 py-2">
                      <div><Label htmlFor="newGroupName">Orbit Name</Label><Input id="newGroupName" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g., Quantum Mechanics Masters" /></div>
                      <div><Label htmlFor="newGroupCourses">Relevant Courses (comma-separated)</Label><Input id="newGroupCourses" value={newGroupCourses} onChange={e => setNewGroupCourses(e.target.value)} placeholder="e.g., Quantum Mechanics, Astro 101" /></div>
                      <div><Label htmlFor="newGroupDescription">Description</Label><Textarea id="newGroupDescription" value={newGroupDescription} onChange={e => setNewGroupDescription(e.target.value)} placeholder="e.g., Weekly discussions and problem-solving sessions." /></div>
                      <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsCreateGroupDialogOpen(false)}>Cancel Mission</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Launch Orbit</Button></DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            )}

            {/* Shared Resources Tab */}
            {activeTab === "resources" && (
              <TabsContent value="resources" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Knowledge Nebula</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">Share and discover study materials.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsUploadResourceDialogOpen(true)} className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                      <UploadCloud className="mr-2 h-5 w-5" /> Transmit New Resource
                    </Button>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Available Databanks:</h3>
                    {sharedResources.length > 0 ? (
                        <div className="space-y-3">
                        {sharedResources.map(res => (
                            <Card key={res.id} className="p-3 flex items-center justify-between bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                             <div className="flex items-center space-x-3">
                                {res.icon && <res.icon className="h-6 w-6 text-accent shrink-0" />}
                                <div>
                                    <h4 className="font-medium text-primary text-sm">{res.name}</h4>
                                    <p className="text-xs text-muted-foreground">Course: {res.course} | Type: {res.type} | Uploaded: {res.uploadDate} by {res.uploader}</p>
                                </div>
                             </div>
                              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10" onClick={() => toast({title: "Download Initiated (Demo)", description: `Downloading ${res.name}...`})}>Download</Button>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">The nebula is clear. Share the first piece of wisdom!</p>
                    )}
                  </CardContent>
                </Card>
                {/* Upload Resource Dialog */}
                <Dialog open={isUploadResourceDialogOpen} onOpenChange={setIsUploadResourceDialogOpen}>
                   <DialogContent className="bg-card border-primary/50">
                    <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><UploadCloud className="mr-2 h-5 w-5"/>Transmit Resource to Nebula</DialogTitle><DialogDescription>Share your valuable study materials.</DialogDescription></DialogHeader>
                    <form onSubmit={handleUploadResource} className="space-y-3 py-2">
                      <div><Label htmlFor="newResourceName">Resource Name</Label><Input id="newResourceName" value={newResourceName} onChange={e => setNewResourceName(e.target.value)} placeholder="e.g., Quantum Entanglement Summary.pdf" /></div>
                      <div><Label htmlFor="newResourceCourse">Relevant Course</Label><Input id="newResourceCourse" value={newResourceCourse} onChange={e => setNewResourceCourse(e.target.value)} placeholder="e.g., Quantum Mechanics" /></div>
                      <div><Label htmlFor="newResourceType">Type (e.g., PDF, Notes, Link)</Label><Input id="newResourceType" value={newResourceType} onChange={e => setNewResourceType(e.target.value)} placeholder="e.g., PDF" /></div>
                      <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsUploadResourceDialogOpen(false)}>Cancel Transmission</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Transmit Resource</Button></DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            )}

            {/* Study Sessions Tab */}
            {activeTab === "sessions" && (
              <TabsContent value="sessions" forceMount>
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                        <CalendarCheck className="h-8 w-8 text-primary animate-subtle-pulse" />
                        <CardTitle className="text-2xl font-mono text-primary">Synchronized Orbits</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground">Plan and join study sessions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button onClick={() => setIsScheduleSessionDialogOpen(true)} className="w-full md:w-auto mb-6 bg-primary hover:bg-accent hover:text-accent-foreground">
                      <PlusCircle className="mr-2 h-5 w-5" /> Schedule New Orbit
                    </Button>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming Synchronizations:</h3>
                     {studySessions.length > 0 ? (
                        <div className="space-y-3">
                        {studySessions.map(sess => (
                            <Card key={sess.id} className="p-3 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                        {sess.icon && <sess.icon className="h-6 w-6 text-accent shrink-0" />}
                                        <div>
                                            <h4 className="font-medium text-primary text-sm">{sess.topic}</h4>
                                            <p className="text-xs text-muted-foreground">When: {sess.dateTime} | Where: {sess.location}</p>
                                            <p className="text-xs text-muted-foreground">Participants: {sess.groupOrParticipants}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleJoinSession(sess.id)} variant={sess.isJoinedByCurrentUser ? "default" : "outline"} size="sm" className={sess.isJoinedByCurrentUser ? "bg-accent text-accent-foreground hover:bg-accent/80" : "border-accent text-accent hover:bg-accent/10"}>
                                      {sess.isJoinedByCurrentUser ? <><CheckCircle className="mr-2 h-4 w-4"/>Joined Orbit</> : <><CalendarPlus className="mr-2 h-4 w-4"/>Join Orbit</>}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No study orbits scheduled. Initiate one!</p>
                    )}
                  </CardContent>
                </Card>
                 {/* Schedule Session Dialog */}
                <Dialog open={isScheduleSessionDialogOpen} onOpenChange={setIsScheduleSessionDialogOpen}>
                   <DialogContent className="bg-card border-primary/50">
                    <DialogHeader><DialogTitle className="font-mono text-primary flex items-center"><PlusCircle className="mr-2 h-5 w-5"/>Synchronize a New Study Orbit</DialogTitle><DialogDescription>Coordinate your next study session.</DialogDescription></DialogHeader>
                    <form onSubmit={handleScheduleSession} className="space-y-3 py-2">
                      <div><Label htmlFor="newSessionTopic">Topic / Subject</Label><Input id="newSessionTopic" value={newSessionTopic} onChange={e => setNewSessionTopic(e.target.value)} placeholder="e.g., Quantum Mechanics Midterm Review" /></div>
                      <div><Label htmlFor="newSessionDateTime">Date & Time</Label><Input id="newSessionDateTime" value={newSessionDateTime} onChange={e => setNewSessionDateTime(e.target.value)} placeholder="e.g., 2024-05-20 @ 16:00 GST" /></div>
                      <div><Label htmlFor="newSessionGroup">Group / Participants</Label><Input id="newSessionGroup" value={newSessionGroup} onChange={e => setNewSessionGroup(e.target.value)} placeholder="e.g., Quantum Entanglement Workshop or Open" /></div>
                      <div><Label htmlFor="newSessionLocation">Location / Platform</Label><Input id="newSessionLocation" value={newSessionLocation} onChange={e => setNewSessionLocation(e.target.value)} placeholder="e.g., Virtual Holo-Deck 7 or Library Room B" /></div>
                      <DialogFooter className="pt-3"><Button type="button" variant="outline" onClick={() => setIsScheduleSessionDialogOpen(false)}>Cancel Synchronization</Button><Button type="submit" className="bg-primary hover:bg-accent hover:text-accent-foreground">Schedule Orbit</Button></DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

// Added missing imports for Select components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default StudySpherePage;
