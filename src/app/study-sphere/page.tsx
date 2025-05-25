
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UsersRound, Pencil, UserPlus, Users, UploadCloud, Download, CalendarPlus, BookOpen, Group, FileText, Clock, UserCircle, Search, Handshake, CheckCircle, Info, Bot, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AlienGuide from '@/components/AlienGuide';

const ALL_AVAILABLE_COURSES = ["Astrophysics 101", "Quantum Mechanics", "Calculus II", "Organic Chemistry", "Literary Theory", "Computer Science 101", "History of Art"];
const ALL_LEARNING_STYLES = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];

interface StudyProfileData {
  courses: string[];
  learningStyles: string[];
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
  { id: 1, name: "Alex Cosmo", courses: ["Astrophysics 101", "Calculus II"], learningStyles: ["Visual", "Kinesthetic"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile student" },
  { id: 2, name: "Nova Stellar", courses: ["Quantum Mechanics", "Organic Chemistry"], learningStyles: ["Auditory", "Reading/Writing"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile learner" },
  { id: 3, name: "Orion Byte", courses: ["Calculus II", "Astrophysics 101"], learningStyles: ["Kinesthetic", "Reading/Writing"], avatar: "https://placehold.co/80x80.png", dataAiHint: "profile tech" },
];

const initialStudyGroupsData: StudyGroup[] = [
  { id: 1, name: "Quantum Leapsters", courses: ["Quantum Mechanics"], members: 3, description: "Mastering the quantum realm together.", isJoinedByCurrentUser: false },
  { id: 2, name: "Astro Alliance", courses: ["Astrophysics 101"], members: 5, description: "Exploring the cosmos, one equation at a time.", isJoinedByCurrentUser: false },
];

const initialSharedResourcesData: SharedResource[] = [
  { id: 1, name: "Astro Notes Ch. 1-3.pdf", type: "PDF", uploader: "Alex Cosmo", course: "Astrophysics 101" },
  { id: 2, name: "Calculus Practice Set 1.docx", type: "DOCX", uploader: "Demo User", course: "Calculus II" },
];

const initialStudySessionsData: StudySession[] = [
  { id: 1, topic: "Astrophysics Midterm Review", dateTime: "October 28, 2024, 2:00 PM", group: "Astro Alliance", location: "Virtual via UniMeet", isJoinedByCurrentUser: false },
  { id: 2, topic: "Quantum Entanglement Workshop", dateTime: "November 5, 2024, 5:00 PM", group: "Quantum Leapsters", location: "Library Room 3B", isJoinedByCurrentUser: false },
];


const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

const getLocalStorageKey = (baseKey: string) => {
  // Simple mock user ID for localStorage keying.
  // In a real app with auth, this would come from the authenticated user.
  const mockUserId = "demoUser123"; 
  return `uniVerse-${baseKey}-${mockUserId}`;
};


export default function StudySpherePage() {
  const { toast } = useToast();

  const [studyProfile, setStudyProfile] = useState<StudyProfileData>(initialStudyProfileData);
  const [potentialMatches] = useState<PotentialMatch[]>(initialPotentialMatchesData); // Kept as static for now
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialStudyGroupsData);
  const [sharedResources, setSharedResources] = useState<SharedResource[]>(initialSharedResourcesData);
  const [studySessions, setStudySessions] = useState<StudySession[]>(initialStudySessionsData);

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

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = <T,>(key: string, initialData: T): T => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(getLocalStorageKey(key));
        try {
          return saved ? JSON.parse(saved) : initialData;
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
          return initialData;
        }
      }
      return initialData;
    };

    setStudyProfile(loadData('studyProfile', initialStudyProfileData));
    // potentialMatches remains static for this example
    setFilteredMatches(loadData('potentialMatches', initialPotentialMatchesData));
    setStudyGroups(loadData('studyGroups', initialStudyGroupsData));
    setSharedResources(loadData('sharedResources', initialSharedResourcesData));
    setStudySessions(loadData('studySessions', initialStudySessionsData));
  }, []);

  // Save data to localStorage when it changes
  const saveData = <T,>(key: string, data: T) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getLocalStorageKey(key), JSON.stringify(data));
    }
  };

  useEffect(() => { saveData('studyProfile', studyProfile); }, [studyProfile]);
  useEffect(() => { saveData('studyGroups', studyGroups); }, [studyGroups]);
  useEffect(() => { saveData('sharedResources', sharedResources); }, [sharedResources]);
  useEffect(() => { saveData('studySessions', studySessions); }, [studySessions]);


  useEffect(() => {
    if (isEditDialogOpen) {
        setEditCoursesInput(studyProfile.courses.join(', '));
        setEditLearningStyles([...studyProfile.learningStyles]);
    }
  }, [studyProfile, isEditDialogOpen]);

  useEffect(() => {
    let matches = [...potentialMatches]; 
    if (selectedCourseFilter && selectedCourseFilter !== 'all') {
      matches = matches.filter(match => match.courses.includes(selectedCourseFilter));
    }
    if (selectedStyleFilter && selectedStyleFilter !== 'all') {
      matches = matches.filter(match => match.learningStyles.includes(selectedStyleFilter));
    }
    setFilteredMatches(matches);
  }, [selectedCourseFilter, selectedStyleFilter, potentialMatches]);

  const handleEditProfile = () => setIsEditDialogOpen(true);

  const handleSaveProfile = () => {
    const updatedCourses = editCoursesInput.split(',').map(course => course.trim()).filter(course => course !== "" && ALL_AVAILABLE_COURSES.includes(course));
    if (updatedCourses.length === 0 && editCoursesInput.trim() !== "") {
         toast({
            title: "Invalid Courses",
            description: "Please enter valid courses from the available list, separated by commas.",
            variant: "destructive",
        });
        return;
    }
    setStudyProfile({ courses: updatedCourses, learningStyles: editLearningStyles });
    setIsEditDialogOpen(false);
    toast({
        title: "Profile Updated (Locally)",
        description: "Your study profile has been saved in your browser! This progress will be remembered next time you visit.",
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
        description: "Please fill out all required fields for the new group.",
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
            description: `You have successfully joined "${groupName}". This is saved in your browser.`,
        });
    } else {
        const group = studyGroups.find(g => g.id === groupId);
        if (group && group.isJoinedByCurrentUser) {
            toast({
                title: "Already Joined",
                description: `You are already a member of "${group.name}".`,
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
      uploader: "Demo User",
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
    let sessionJoinedInitially = false;
    let sessionTopic = "";

    setStudySessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          sessionJoinedInitially = !!session.isJoinedByCurrentUser;
          sessionTopic = session.topic;
          return { ...session, isJoinedByCurrentUser: !session.isJoinedByCurrentUser };
        }
        return session;
      })
    );

    if (sessionTopic) {
      const nowJoined = !sessionJoinedInitially;
        toast({
            title: nowJoined ? "Joined Session! (Locally)" : "Left Session (Locally)",
            description: (nowJoined
                ? `You have successfully joined "${sessionTopic}".`
                : `You have left "${sessionTopic}".`) + " Status saved in your browser.",
        });
    }
  };


  const handleDemoClick = (message: string) => {
    toast({
      title: "Demo Action",
      description: message + " (Real connections & shared data coming soon! Your data is local for now.)",
      duration: 3000,
    });
  };

  const motionKey = activeTab;


  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-6 bg-card hover:bg-accent hover:text-accent-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to UniVerse Home
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-2 text-center">
          <UsersRound className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary font-mono">Study Sphere</h1>
        </div>
         <p className="text-xl text-center text-muted-foreground mb-4">
          Your cosmic hub for collaborative learning! Find partners, join groups, and share knowledge.
        </p>
         <p className="text-md text-center text-foreground/80 mb-10">
            Welcome, scholar! Shape your study profile, discover learning constellations, and launch your academic journey. Your progress here is saved locally in your browser!
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 mb-8 border-b border-border pb-1">
          <TabsTrigger value="profile" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent">
            <UserCircle className="mr-2 h-4 w-4" />My Profile
          </TabsTrigger>
          <TabsTrigger value="find-buddies" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent">
            <Search className="mr-2 h-4 w-4" />Find Buddies
          </TabsTrigger>
          <TabsTrigger value="groups" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent">
            <Users className="mr-2 h-4 w-4" />Study Groups
          </TabsTrigger>
          <TabsTrigger value="resources" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent">
            <FileText className="mr-2 h-4 w-4" />Resources
          </TabsTrigger>
          <TabsTrigger value="sessions" className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:font-semibold hover:text-accent">
            <Clock className="mr-2 h-4 w-4" />Sessions
          </TabsTrigger>
        </TabsList>

        <motion.div key={motionKey} variants={tabContentVariants} initial="hidden" animate="visible">
            <TabsContent value="profile">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <BookOpen className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Your Study Profile
                </CardTitle>
                <CardDescription>Define your academic focus and learning preferences. (Changes saved in your browser)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                            <div className="space-y-1">
                            <Label htmlFor="courses" className="text-foreground/90">
                                Courses (comma-separated)
                            </Label>
                            <Textarea
                                id="courses"
                                value={editCoursesInput}
                                onChange={(e) => setEditCoursesInput(e.target.value)}
                                placeholder="Enter courses, separated by commas. e.g., Astrophysics 101, Quantum Mechanics"
                                className="bg-background/70 min-h-[60px]"
                            />
                            <p className="text-xs text-muted-foreground">Available: {ALL_AVAILABLE_COURSES.join(', ')}</p>
                            </div>
                            <div className="space-y-1">
                            <Label className="text-foreground/90">
                                Learning Styles
                            </Label>
                            <div className="grid grid-cols-2 gap-2 pt-1">
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
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="find-buddies">
            <div className="space-y-10">
                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-primary">
                    <Search className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Find Your Constellation
                    </CardTitle>
                    <CardDescription>Filter by courses and learning preferences to discover compatible study partners. (Buddy list is for demo purposes). Results update as you filter.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="course-filter" className="text-base text-foreground/90">Filter by Course:</Label>
                    <Select onValueChange={(value) => setSelectedCourseFilter(value === 'all' ? '' : value)} value={selectedCourseFilter || "all"}>
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
                    <Select onValueChange={(value) => setSelectedStyleFilter(value === 'all' ? '' : value)} value={selectedStyleFilter || "all"}>
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

                <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center text-primary">
                        <Handshake className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Potential Study Buddies
                    </CardTitle>
                    <CardDescription>Discover students who align with your academic journey.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {filteredMatches.length > 0 ? filteredMatches.map(match => (
                    <Card key={match.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                        <Image src={match.avatar} alt={match.name} data-ai-hint={match.dataAiHint} className="h-16 w-16 rounded-full object-cover" width={64} height={64} />
                        <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{match.name}</h4>
                        <p className="text-sm text-muted-foreground">Courses: {match.courses.join(', ')}</p>
                        <p className="text-sm text-muted-foreground">Learning Styles: {match.learningStyles.join(', ')}</p>
                        </div>
                        <Button onClick={() => handleDemoClick(`Connection request sent to ${match.name}! (Demo: Real connections coming soon!)`)} size="sm" variant="outline" className="shrink-0 self-start sm:self-center border-accent text-accent hover:bg-accent/10">
                        <UserPlus className="mr-2 h-4 w-4" /> Connect (Demo)
                        </Button>
                    </Card>
                    )) : <p className="text-muted-foreground text-center">No matching buddies found for the selected filters. Try broadening your search!</p>}
                </CardContent>
                </Card>
            </div>
            </TabsContent>

            <TabsContent value="groups">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <Group className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Collaborative Orbits (Study Groups)
                </CardTitle>
                <CardDescription>Launch your own study group or join an existing constellation. (Group data saved in your browser).</CardDescription>
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
                                <DialogTitle className="text-primary">Create New Study Group (Saved Locally)</DialogTitle>
                                <DialogDescription>
                                Fill in the details to launch your new study group constellation!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
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
                    <Card key={group.id} className="p-4 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
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
                            className={`mt-1 self-start sm:self-center ${group.isJoinedByCurrentUser ? 'bg-primary text-primary-foreground cursor-not-allowed' : 'border-accent text-accent hover:bg-accent/10'}`}
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
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <FileText className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Knowledge Nebula (Shared Resources)
                </CardTitle>
                <CardDescription>Exchange notes and materials. (Resource data saved in your browser).</CardDescription>
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
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
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
                    <Card key={resource.id} className="p-4 flex items-center space-x-4 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                    <FileText className="h-8 w-8 text-accent shrink-0" />
                    <div className="flex-grow">
                        <h4 className="font-semibold text-lg text-foreground">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">Type: {resource.type} | Course: {resource.course}</p>
                        <p className="text-sm text-muted-foreground">Uploaded by: {resource.uploader}</p>
                    </div>
                    <Button onClick={() => handleDemoClick(`Downloading ${resource.name}... (Demo)`)} variant="ghost" size="icon" className="text-accent hover:text-accent/80">
                        <Download className="h-5 w-5" />
                    </Button>
                    </Card>
                ))}
                {sharedResources.length === 0 && <p className="text-muted-foreground text-center py-4">No resources shared yet. Be the first to contribute!</p>}
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="sessions">
            <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center text-primary">
                    <Clock className="mr-3 h-7 w-7 text-accent animate-subtle-pulse" />Synchronized Orbits (Study Sessions)
                </CardTitle>
                <CardDescription>Plan and schedule study times. (Session data saved in your browser).</CardDescription>
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
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
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
                    <Card key={session.id} className="p-4 bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                    <h4 className="font-semibold text-lg text-foreground">{session.topic}</h4>
                    <p className="text-sm text-muted-foreground">When: {session.dateTime}</p>
                    <p className="text-sm text-muted-foreground">With: {session.group} | Where: {session.location}</p>
                    <Button
                        onClick={() => handleToggleJoinSession(session.id)}
                        size="sm"
                        variant={session.isJoinedByCurrentUser ? "default" : "outline"}
                        className={`mt-2 ${session.isJoinedByCurrentUser ? 'bg-primary text-primary-foreground' : 'border-accent text-accent hover:bg-accent/10'}`}
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
    </div>
  );
}

    