
"use client";

import Link from 'next/link';
import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UsersRound, Pencil, UserPlus, Users, UploadCloud, Download, CalendarPlus, BookOpen, Group, FileText, Clock, UserCircle, Search, Handshake, CheckCircle, Info, Bot, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AlienGuide from '@/components/AlienGuide';
import { useAuth } from '@/contexts/AuthContext'; // For mock user access

// Hardcoded initial data - these will be used if localStorage is empty or for new users
const ALL_AVAILABLE_COURSES = ["Astrophysics 101", "Quantum Mechanics", "Calculus II", "Organic Chemistry", "Literary Theory", "Computer Science 101", "History of Art"];
const ALL_LEARNING_STYLES = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];

interface StudyProfileData {
  courses: string[];
  learningStyles: string[];
  email?: string; 
  uid?: string;
}

interface PotentialMatch {
  id: number; 
  name: string;
  courses: string[];
  learningStyles: string[];
  avatar: string;
  dataAiHint?: string;
}

interface StudyGroup {
  id: number; 
  name: string;
  courses: string[];
  members: number;
  description: string;
  isJoinedByCurrentUser?: boolean;
}

interface SharedResource {
  id: number; 
  name: string;
  type: string;
  uploader: string;
  course: string;
}

interface StudySession {
  id: number; 
  topic: string;
  dateTime: string;
  group: string;
  location: string;
  isJoinedByCurrentUser?: boolean;
}

const initialStudyProfileData: StudyProfileData = {
  courses: ["Astrophysics 101", "Quantum Mechanics"],
  learningStyles: ["Visual", "Reading/Writing"],
};

const initialPotentialMatchesData: PotentialMatch[] = [
  { id: 1, name: "Alex Cosmo", courses: ["Astrophysics 101", "Calculus II"], learningStyles: ["Visual", "Kinesthetic"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile person student" },
  { id: 2, name: "Nova Stellar", courses: ["Quantum Mechanics", "Organic Chemistry"], learningStyles: ["Auditory", "Reading/Writing"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile person learner" },
  { id: 3, name: "Orion Byte", courses: ["Calculus II", "Astrophysics 101"], learningStyles: ["Kinesthetic", "Reading/Writing"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile person tech" },
];

const initialStudyGroupsData: StudyGroup[] = [
  { id: 1, name: "Quantum Leapsters", courses: ["Quantum Mechanics"], members: 3, description: "Mastering the quantum realm together.", isJoinedByCurrentUser: false },
  { id: 2, name: "Astro Alliance", courses: ["Astrophysics 101"], members: 5, description: "Exploring the cosmos, one equation at a time.", isJoinedByCurrentUser: false },
];

const initialSharedResourcesData: SharedResource[] = [
  { id: 1, name: "Astro Notes Ch. 1-3.pdf", type: "PDF", uploader: "Alex Cosmo", course: "Astrophysics 101" },
  { id: 2, name: "Calculus Practice Set 1.docx", type: "DOCX", uploader: "Admin", course: "Calculus II" },
];

const initialStudySessionsData: StudySession[] = [
  { id: 1, topic: "Astrophysics Midterm Review", dateTime: "October 28, 2024, 2:00 PM", group: "Astro Alliance", location: "Virtual via UniMeet", isJoinedByCurrentUser: false },
  { id: 2, topic: "Quantum Entanglement Workshop", dateTime: "November 5, 2024, 5:00 PM", group: "Quantum Leapsters", location: "Library Room 3B", isJoinedByCurrentUser: false },
];


const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } },
};

const initialGuideMessage = "Welcome to the Study Sphere, Earthling! Your progress here is saved locally in your browser for this session! Connect with others and boost your learning orbit.";


export default function StudySpherePage() {
  const { toast } = useToast();
  const { user } = useAuth(); // For mock user details

  const [studyProfile, setStudyProfile] = useState<StudyProfileData>(initialStudyProfileData);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // localStorage keys will now incorporate a mock user ID if available
  const getLocalStorageKey = (baseKey: string) => {
    return user?.uid ? `${baseKey}-${user.uid}` : baseKey;
  };


  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getLocalStorageKey('uniVerseStudyGroups'));
      return saved ? JSON.parse(saved) : initialStudyGroupsData;
    }
    return initialStudyGroupsData;
  });
  
  const [sharedResources, setSharedResources] = useState<SharedResource[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getLocalStorageKey('uniVerseSharedResources'));
      return saved ? JSON.parse(saved) : initialSharedResourcesData;
    }
    return initialSharedResourcesData;
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getLocalStorageKey('uniVerseStudySessions'));
      return saved ? JSON.parse(saved) : initialStudySessionsData;
    }
    return initialStudySessionsData;
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCoursesInput, setEditCoursesInput] = useState('');
  const [editLearningStyles, setEditLearningStyles] = useState<string[]>([]);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('');
  const [filteredMatches, setFilteredMatches] = useState<PotentialMatch[]>(initialPotentialMatchesData); 

  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCourses, setNewGroupCourses] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const [isUploadResourceDialogOpen, setIsUploadResourceDialogOpen] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceCourse, setNewResourceCourse] = useState('');
  const [newResourceType, setNewResourceType] = useState('');

  const [isScheduleSessionDialogOpen, setIsScheduleSessionDialogOpen] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionDateTime, setNewSessionDateTime] = useState('');
  const [newSessionGroup, setNewSessionGroup] = useState('');
  const [newSessionLocation, setNewSessionLocation] = useState('');
  
  const [activeTab, setActiveTab] = useState("profile");
  const [guideMessage, setGuideMessage] = useState(initialGuideMessage);

  // Load profile from localStorage on mount or user change
  useEffect(() => {
    setLoadingProfile(true);
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem(getLocalStorageKey('uniVerseStudyProfile'));
      if (savedProfile) {
        setStudyProfile(JSON.parse(savedProfile));
      } else {
        // If no saved profile for this mock user, use initial and save it
        const profileToSave = { ...initialStudyProfileData, email: user?.email, uid: user?.uid };
        setStudyProfile(profileToSave);
        localStorage.setItem(getLocalStorageKey('uniVerseStudyProfile'), JSON.stringify(profileToSave));
      }
    }
    setLoadingProfile(false);
  }, [user]); // Rerun if mock user changes (e.g., after mock login)

  // Save profile to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && studyProfile && !loadingProfile) { // Ensure not saving during initial load
      localStorage.setItem(getLocalStorageKey('uniVerseStudyProfile'), JSON.stringify(studyProfile));
    }
  }, [studyProfile, user, loadingProfile]);


  // Save other data to localStorage effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey(LS_STUDY_GROUPS), JSON.stringify(studyGroups));
    }
  }, [studyGroups, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey(LS_SHARED_RESOURCES), JSON.stringify(sharedResources));
    }
  }, [sharedResources, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey(LS_STUDY_SESSIONS), JSON.stringify(studySessions));
    }
  }, [studySessions, user]);


  useEffect(() => {
    if (isEditDialogOpen && studyProfile) {
        setEditCoursesInput(studyProfile.courses.join(', '));
        setEditLearningStyles([...studyProfile.learningStyles]);
    }
  }, [studyProfile, isEditDialogOpen]);

  useEffect(() => {
    let matches = [...initialPotentialMatchesData]; 
    if (selectedCourseFilter && selectedCourseFilter !== 'all') {
      matches = matches.filter(match => match.courses.includes(selectedCourseFilter));
    }
    if (selectedStyleFilter && selectedStyleFilter !== 'all') {
      matches = matches.filter(match => match.learningStyles.includes(selectedStyleFilter));
    }
    setFilteredMatches(matches);
  }, [selectedCourseFilter, selectedStyleFilter]); 

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    let message = "";
    switch (value) {
      case "profile":
        message = "This is your Study Profile! Keep your courses and learning styles up-to-date. Changes are saved locally in your browser for this session.";
        break;
      case "find-buddies":
        message = "Looking for study partners? Use the filters here to find students taking similar courses or who share your learning style! (Buddy list is for demo purposes)";
        break;
      case "groups":
        message = "Collaborate in Study Groups! You can join an existing one or start your own. (Group data is saved locally in your browser)";
        break;
      case "resources":
        message = "Share and discover helpful study materials here! (Resource data is saved locally in your browser)";
        break;
      case "sessions":
        message = "Time to hit the books together! Schedule study sessions with your groups. (Session data is saved locally in your browser)";
        break;
      default:
        message = initialGuideMessage;
    }
    setGuideMessage(message);
  };

  const handleEditProfile = () => {
    if (studyProfile) {
        setIsEditDialogOpen(true);
    } else {
        toast({ title: "Profile Not Loaded", description: "Please wait for your profile to load or try 'logging in' again.", variant: "destructive"});
    }
  };

  const handleSaveProfile = () => {
    if (!studyProfile) { // No need to check user for mock
      toast({ title: "Error", description: "Profile not loaded.", variant: "destructive" });
      return;
    }
    const updatedCourses = editCoursesInput.split(',').map(course => course.trim()).filter(course => course !== "");
    
    // Preserve existing email/uid if they exist on studyProfile
    const currentEmail = studyProfile.email || user?.email;
    const currentUid = studyProfile.uid || user?.uid;

    const newProfileData: StudyProfileData = {
        ...studyProfile,
        courses: updatedCourses,
        learningStyles: editLearningStyles,
        email: currentEmail,
        uid: currentUid,
    };
    setStudyProfile(newProfileData); // This will trigger the useEffect to save to localStorage
    setIsEditDialogOpen(false);
    toast({
        title: "Profile Updated (Locally)",
        description: "Your study profile has been saved in your browser.",
    });
  };


  const handleLearningStyleChange = (style: string, checked: boolean | string) => {
    setEditLearningStyles(prevStyles =>
      checked === true ? [...prevStyles, style] : prevStyles.filter(s => s !== style)
    );
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupCourses.trim() || !newGroupDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields for the new group.",
        variant: "destructive",
      });
      return;
    }
    const newGroup: StudyGroup = {
      id: Date.now(), 
      name: newGroupName.trim(),
      courses: newGroupCourses.split(',').map(c => c.trim()).filter(c => c),
      members: 1, 
      description: newGroupDescription.trim(),
      isJoinedByCurrentUser: true, 
    };
    setStudyGroups(prevGroups => [newGroup, ...prevGroups]);
    setIsCreateGroupDialogOpen(false);
    setNewGroupName('');
    setNewGroupCourses('');
    setNewGroupDescription('');
    toast({
      title: "Study Group Created! (Locally)",
      description: `The group "${newGroup.name}" has been successfully created and saved in your browser.`,
    });
  };

  const handleJoinGroup = (groupId: number) => {
    let groupJoinedSuccessfully = false;
    let groupName = "";
    setStudyGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId && !group.isJoinedByCurrentUser) {
          groupJoinedSuccessfully = true;
          groupName = group.name;
          return { ...group, members: group.members + 1, isJoinedByCurrentUser: true };
        }
        return group;
      })
    );
    
    if (groupJoinedSuccessfully && groupName) {
        toast({
            title: "Joined Group! (Locally)",
            description: `You have successfully joined "${groupName}". Status saved in your browser.`,
        });
    } else {
        const group = studyGroups.find(g => g.id === groupId);
        if (group && group.isJoinedByCurrentUser) {
            toast({
                title: "Already Joined",
                description: `You are already a member of "${group.name}".`,
                variant: "default",
            });
        }
    }
  };

  const handleUploadResource = () => {
    if (!newResourceName.trim() || !newResourceCourse.trim() || !newResourceType.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields for the new resource.",
        variant: "destructive",
      });
      return;
    }
    const newResource: SharedResource = {
      id: Date.now(),
      name: newResourceName.trim(),
      course: newResourceCourse.trim(),
      type: newResourceType.trim(),
      uploader: user?.email || "Demo User", 
    };
    setSharedResources(prevResources => [newResource, ...prevResources]);
    setIsUploadResourceDialogOpen(false);
    setNewResourceName('');
    setNewResourceCourse('');
    setNewResourceType('');
    toast({
      title: "Resource Uploaded! (Locally)",
      description: `"${newResource.name}" has been added and saved in your browser.`,
    });
  };

  const handleScheduleSession = () => {
    if (!newSessionTopic.trim() || !newSessionDateTime.trim() || !newSessionGroup.trim() || !newSessionLocation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields for the new study session.",
        variant: "destructive",
      });
      return;
    }
    const newSession: StudySession = {
      id: Date.now(),
      topic: newSessionTopic.trim(),
      dateTime: newSessionDateTime.trim(),
      group: newSessionGroup.trim(),
      location: newSessionLocation.trim(),
      isJoinedByCurrentUser: true, 
    };
    setStudySessions(prevSessions => [newSession, ...prevSessions]);
    setIsScheduleSessionDialogOpen(false);
    setNewSessionTopic('');
    setNewSessionDateTime('');
    setNewSessionGroup('');
    setNewSessionLocation('');
    toast({
      title: "Study Session Scheduled! (Locally)",
      description: `"${newSession.topic}" has been added and saved in your browser.`,
    });
  };

  const handleToggleJoinSession = (sessionId: number) => {
    let sessionJoined = false;
    let sessionTopic = "";

    setStudySessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          sessionJoined = !session.isJoinedByCurrentUser; 
          sessionTopic = session.topic;
          return { ...session, isJoinedByCurrentUser: !session.isJoinedByCurrentUser };
        }
        return session;
      })
    );
    
    if (sessionTopic) {
        toast({
            title: sessionJoined ? "Joined Session! (Locally)" : "Left Session (Locally)",
            description: (sessionJoined 
                ? `You have successfully joined "${sessionTopic}".` 
                : `You have left "${sessionTopic}".`) + " Status saved in your browser.",
        });
    }
  };

  const handleDemoClick = (message: string) => {
    toast({
      title: "Demo Action",
      description: message + " (Real connections coming soon!)",
      duration: 3000,
    });
  };
  
  if (loadingProfile) { // Still useful for initial localStorage read
    return (
      <div className="container mx-auto px-4 py-12 w-full max-w-4xl flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading your Study Sphere...</p>
      </div>
    );
  }

  // Key for Framer Motion to re-trigger animation on tab change
  const motionKey = activeTab;


  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl relative">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-2 text-center">
          <UsersRound className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary">Study Sphere</h1>
        </div>
         <p className="text-xl text-center text-muted-foreground mb-4">
          Your cosmic hub for collaborative learning! Find partners, join groups, and share knowledge.
        </p>
         <p className="text-md text-center text-foreground/80 mb-10">
          Welcome, scholar! Shape your study profile (saved in your browser), explore connections, and launch your academic journey to new heights.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={handleTabChange} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8">
          <TabsTrigger value="profile" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <UserCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform animate-subtle-pulse" />My Profile
          </TabsTrigger>
          <TabsTrigger value="find-buddies" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Find Buddies
          </TabsTrigger>
          <TabsTrigger value="groups" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Study Groups
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <FileText className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Resources
          </TabsTrigger>
          <TabsTrigger value="sessions" className="text-sm py-2.5 group flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.03] hover:bg-muted/80 hover:text-foreground">
            <Clock className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />Sessions
          </TabsTrigger>
        </TabsList>

        <motion.div key={motionKey} variants={tabContentVariants} initial="hidden" animate="visible">
            <TabsContent value="profile">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <BookOpen className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Your Study Profile
                </CardTitle>
                <CardDescription>Define your academic focus and learning preferences. Changes are saved locally in your browser for this session.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {studyProfile ? (
                    <>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-foreground">My Courses:</h3>
                            <div className="flex flex-wrap gap-2">
                            {studyProfile.courses.map(course => <Badge key={course} variant="secondary" className="text-base">{course}</Badge>)}
                            {studyProfile.courses.length === 0 && <p className="text-sm text-muted-foreground">Add courses you're taking!</p>}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-foreground">My Learning Styles:</h3>
                            <div className="flex flex-wrap gap-2">
                            {studyProfile.learningStyles.map(style => <Badge key={style} variant="outline" className="text-base border-accent text-accent">{style}</Badge>)}
                            {studyProfile.learningStyles.length === 0 && <p className="text-sm text-muted-foreground">Specify your preferred learning styles!</p>}
                            </div>
                        </div>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                            <Button onClick={handleEditProfile} variant="outline" className="mt-2 border-accent text-accent hover:bg-accent/10">
                                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-card border-accent/50">
                            <DialogHeader>
                                <DialogTitle className="text-primary">Edit Your Study Profile (Saved Locally)</DialogTitle>
                                <DialogDescription>
                                Update your courses and learning preferences. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="courses" className="text-right text-foreground/90 col-span-1">
                                    Courses
                                </Label>
                                <Textarea
                                    id="courses"
                                    value={editCoursesInput}
                                    onChange={(e) => setEditCoursesInput(e.target.value)}
                                    placeholder="Enter courses, separated by commas"
                                    className="col-span-3 bg-background/70"
                                />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right text-foreground/90 col-span-1 pt-1">
                                    Learning Styles
                                </Label>
                                <div className="col-span-3 space-y-2">
                                    {ALL_LEARNING_STYLES.map((style) => (
                                    <div key={style} className="flex items-center space-x-2">
                                        <Checkbox
                                        id={`style-${style}`}
                                        checked={editLearningStyles.includes(style)}
                                        onCheckedChange={(checked) => handleLearningStyleChange(style, checked)}
                                        />
                                        <Label htmlFor={`style-${style}`} className="font-normal text-foreground/80">{style}</Label>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleSaveProfile} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
                            </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <p className="text-muted-foreground">Your profile is loading or you might not be 'logged in' (mock mode).</p>
                )}
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="find-buddies">
            <div className="space-y-10">
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-primary">
                    <Search className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Find Your Constellation
                    </CardTitle>
                    <CardDescription>Filter by courses and learning preferences to discover compatible study partners. (Buddy list is for demo purposes).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="course-filter" className="text-base text-foreground/90">Filter by Course:</Label>
                    <Select onValueChange={(value) => setSelectedCourseFilter(value === 'all' ? '' : value)} defaultValue={selectedCourseFilter || "all"}>
                        <SelectTrigger id="course-filter" className="w-full bg-background/70">
                        <SelectValue placeholder="Select a course to find peers" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {ALL_AVAILABLE_COURSES.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="style-filter" className="text-base text-foreground/90">Filter by Learning Style:</Label>
                    <Select onValueChange={(value) => setSelectedStyleFilter(value === 'all' ? '' : value)} defaultValue={selectedStyleFilter || "all"}>
                        <SelectTrigger id="style-filter" className="w-full bg-background/70">
                        <SelectValue placeholder="Select a preferred learning style" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        {ALL_LEARNING_STYLES.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    </div>
                </CardContent>
                </Card>

                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-primary">
                        <Handshake className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Potential Study Buddies
                    </CardTitle>
                    <CardDescription>Discover students who align with your academic journey (results update as you filter).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {filteredMatches.length > 0 ? filteredMatches.map(match => (
                    <Card key={match.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-background/70 backdrop-blur-xs border-border/60 shadow-md">
                        <Image src={match.avatar} alt={match.name} data-ai-hint={match.dataAiHint} className="h-16 w-16 rounded-full object-cover" width={64} height={64} />
                        <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{match.name}</h4>
                        <p className="text-sm text-muted-foreground">Courses: {match.courses.join(', ')}</p>
                        <p className="text-sm text-muted-foreground">Learning Styles: {match.learningStyles.join(', ')}</p>
                        </div>
                        <Button onClick={() => handleDemoClick(`Connection request sent to ${match.name}!`)} size="sm" variant="outline" className="shrink-0 self-start sm:self-center border-accent text-accent hover:bg-accent/10">
                        <UserPlus className="mr-2 h-4 w-4" /> Connect
                        </Button>
                    </Card>
                    )) : <p className="text-muted-foreground text-center">No matching buddies found for the selected filters. Try broadening your search!</p>}
                </CardContent>
                </Card>
            </div>
            </TabsContent>
            
            <TabsContent value="groups">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <Group className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Collaborative Orbits (Study Groups)
                </CardTitle>
                <CardDescription>Launch your own study group or join an existing constellation. (Group data is saved locally in browser).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsCreateGroupDialogOpen(true)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Users className="mr-2 h-4 w-4" /> Create New Group
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] bg-card border-accent/50">
                            <DialogHeader>
                                <DialogTitle className="text-primary">Create a New Study Group (Saved Locally)</DialogTitle>
                                <DialogDescription>
                                Fill in the details to launch your new study group constellation!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-1">
                                    <Label htmlFor="group-name" className="text-foreground/90">Group Name</Label>
                                    <Input 
                                        id="group-name" 
                                        value={newGroupName} 
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGroupName(e.target.value)} 
                                        placeholder="e.g., Quantum Physicists United" 
                                        className="bg-background/70"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="group-courses" className="text-foreground/90">Relevant Courses (comma-separated)</Label>
                                    <Input 
                                        id="group-courses" 
                                        value={newGroupCourses} 
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGroupCourses(e.target.value)} 
                                        placeholder="e.g., Quantum Mechanics, Astrophysics 101"
                                        className="bg-background/70"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="group-description" className="text-foreground/90">Description</Label>
                                    <Textarea 
                                        id="group-description" 
                                        value={newGroupDescription} 
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewGroupDescription(e.target.value)} 
                                        placeholder="What's your group about? What are your goals?"
                                        className="min-h-[80px] bg-background/70"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleCreateGroup} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                    Create Group
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                <Separator className="my-6 bg-border/50" />
                <h3 className="font-semibold text-lg mb-2 text-foreground">Join Existing Groups:</h3>
                {studyGroups.map(group => (
                    <Card key={group.id} className="p-4 bg-background/70 backdrop-blur-xs border-border/60 shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex-grow mb-3 sm:mb-0">
                        <h4 className="font-semibold text-lg text-foreground">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">Focus: {group.courses.join(', ')}</p>
                        <p className="text-sm text-foreground/80 mt-1">{group.description}</p>
                        <Badge variant="secondary" className="mt-2">{group.members} members</Badge>
                        </div>
                        <Button 
                            onClick={() => handleJoinGroup(group.id)} 
                            size="sm" 
                            variant={group.isJoinedByCurrentUser ? "default" : "outline"}
                            disabled={!!group.isJoinedByCurrentUser} 
                            className={`mt-1 border-accent ${group.isJoinedByCurrentUser ? 'bg-accent text-accent-foreground cursor-not-allowed' : 'text-accent hover:bg-accent/10'} self-start sm:self-center`}
                        >
                        {group.isJoinedByCurrentUser ? <><CheckCircle className="mr-2 h-4 w-4" />Joined</> : <><UserPlus className="mr-2 h-4 w-4" />Join Group</>}
                        </Button>
                    </div>
                    </Card>
                ))}
                {studyGroups.length === 0 && <p className="text-muted-foreground text-center py-4">No study groups found. Why not create one?</p>}
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="resources">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <FileText className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Knowledge Nebula (Shared Resources)
                </CardTitle>
                <CardDescription>Exchange notes and materials. (Resource data is saved locally in browser).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <Dialog open={isUploadResourceDialogOpen} onOpenChange={setIsUploadResourceDialogOpen}>
                    <DialogTrigger asChild>
                    <Button onClick={() => setIsUploadResourceDialogOpen(true)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <UploadCloud className="mr-2 h-4 w-4" /> Upload Resource
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] bg-card border-accent/50">
                    <DialogHeader>
                        <DialogTitle className="text-primary">Upload a New Resource (Saved Locally)</DialogTitle>
                        <DialogDescription>
                        Share your knowledge with the UniVerse community!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1">
                            <Label htmlFor="resource-name" className="text-foreground/90">Resource Name</Label>
                            <Input 
                                id="resource-name" 
                                value={newResourceName} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewResourceName(e.target.value)} 
                                placeholder="e.g., Astro Chapter 5 Summary.pdf" 
                                className="bg-background/70"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="resource-course" className="text-foreground/90">Relevant Course</Label>
                            <Input 
                                id="resource-course" 
                                value={newResourceCourse} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewResourceCourse(e.target.value)} 
                                placeholder="e.g., Astrophysics 101"
                                className="bg-background/70"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="resource-type" className="text-foreground/90">Resource Type (e.g., PDF, Notes, Link)</Label>
                            <Input 
                                id="resource-type" 
                                value={newResourceType} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewResourceType(e.target.value)} 
                                placeholder="e.g., PDF, DOCX, Google Doc Link"
                                className="bg-background/70"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleUploadResource} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            Upload Resource
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                <Separator className="my-6 bg-border/50" />
                <h3 className="font-semibold text-lg mb-2 text-foreground">Available Resources:</h3>
                {sharedResources.map(resource => (
                    <Card key={resource.id} className="p-4 flex items-center space-x-4 bg-background/70 backdrop-blur-xs border-border/60 shadow-md">
                    <FileText className="h-8 w-8 text-accent shrink-0" />
                    <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">Type: {resource.type} | Course: {resource.course}</p>
                        <p className="text-sm text-muted-foreground">Uploaded by: {resource.uploader}</p>
                    </div>
                    <Button onClick={() => handleDemoClick(`Downloading ${resource.name}...`)} variant="ghost" size="icon" className="text-accent hover:text-accent/80">
                        <Download className="h-5 w-5" />
                    </Button>
                    </Card>
                ))}
                {sharedResources.length === 0 && <p className="text-muted-foreground text-center py-4">No resources shared yet. Be the first to contribute!</p>}
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="sessions">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-accent/40">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <Clock className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Synchronized Orbits (Study Sessions)
                </CardTitle>
                <CardDescription>Plan and schedule study times. (Session data is saved locally in browser).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <Dialog open={isScheduleSessionDialogOpen} onOpenChange={setIsScheduleSessionDialogOpen}>
                    <DialogTrigger asChild>
                    <Button onClick={() => setIsScheduleSessionDialogOpen(true)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <CalendarPlus className="mr-2 h-4 w-4" /> Schedule New Session
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px] bg-card border-accent/50">
                    <DialogHeader>
                        <DialogTitle className="text-primary">Schedule a New Study Session (Saved Locally)</DialogTitle>
                        <DialogDescription>
                            Coordinate your learning efforts with the UniVerse crew!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-1">
                            <Label htmlFor="session-topic" className="text-foreground/90">Topic</Label>
                            <Input 
                                id="session-topic" 
                                value={newSessionTopic} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSessionTopic(e.target.value)} 
                                placeholder="e.g., Quantum Mechanics Midterm Prep" 
                                className="bg-background/70"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-datetime" className="text-foreground/90">Date & Time</Label>
                            <Input 
                                id="session-datetime" 
                                value={newSessionDateTime} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSessionDateTime(e.target.value)} 
                                placeholder="e.g., November 10, 2024, 3:00 PM"
                                className="bg-background/70"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-group" className="text-foreground/90">Group / Participants</Label>
                            <Input 
                                id="session-group" 
                                value={newSessionGroup} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSessionGroup(e.target.value)} 
                                placeholder="e.g., Astro Alliance, or 'Open to all'"
                                className="bg-background/70"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="session-location" className="text-foreground/90">Location / Meeting Link</Label>
                            <Input 
                                id="session-location" 
                                value={newSessionLocation} 
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSessionLocation(e.target.value)} 
                                placeholder="e.g., Library Room 2A, or Virtual via UniMeet"
                                className="bg-background/70"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleScheduleSession} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            Schedule Session
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Separator className="my-6 bg-border/50" />
                <h3 className="font-semibold text-lg mb-2 text-foreground">Upcoming Sessions:</h3>
                {studySessions.map(session => (
                    <Card key={session.id} className="p-4 bg-background/70 backdrop-blur-xs border-border/60 shadow-md">
                    <h4 className="font-semibold text-lg text-foreground">{session.topic}</h4>
                    <p className="text-sm text-muted-foreground">When: {session.dateTime}</p>
                    <p className="text-sm text-muted-foreground">With: {session.group} | Where: {session.location}</p>
                    <Button 
                        onClick={() => handleToggleJoinSession(session.id)} 
                        size="sm" 
                        variant={session.isJoinedByCurrentUser ? "default" : "outline"}
                        className={`mt-2 border-accent ${session.isJoinedByCurrentUser ? 'bg-accent text-accent-foreground' : 'text-accent hover:bg-accent/10'}`}
                    >
                        {session.isJoinedByCurrentUser ? <><CheckCircle className="mr-2 h-4 w-4" />Joined</> : <><CalendarPlus className="mr-2 h-4 w-4" />Join Session</>}
                    </Button>
                    </Card>
                ))}
                {studySessions.length === 0 && <p className="text-muted-foreground text-center py-4">No study sessions scheduled yet. Why not create one?</p>}
                </CardContent>
            </Card>
            </TabsContent>
        </motion.div>
      </Tabs>
      <AlienGuide message={guideMessage} />
    </div>
  );
}

// Dummy consts for localStorage keys to avoid undefined errors if not used elsewhere.
const LS_STUDY_GROUPS = 'uniVerseStudyGroups';
const LS_SHARED_RESOURCES = 'uniVerseSharedResources';
const LS_STUDY_SESSIONS = 'uniVerseStudySessions';
