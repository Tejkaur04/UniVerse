
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UsersRound, Pencil, SearchIcon, UserPlus, Users, UploadCloud, Download, CalendarPlus, BookOpen, Palette, Group, FileText, Clock } from 'lucide-react';

const hardcodedCourses = ["Astrophysics 101", "Quantum Mechanics", "Calculus II", "Organic Chemistry", "Literary Theory"];
const learningStyles = ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"];

const studyProfile = {
  courses: ["Astrophysics 101", "Quantum Mechanics"],
  learningStyles: ["Visual", "Reading/Writing"],
};

const potentialMatches = [
  { id: 1, name: "Alex Cosmo", courses: ["Astrophysics 101", "Calculus II"], learningStyles: ["Visual", "Kinesthetic"], avatar: "https://placehold.co/80x80.png?text=AC" , dataAiHint: "profile person" },
  { id: 2, name: "Nova Stellar", courses: ["Quantum Mechanics", "Organic Chemistry"], learningStyles: ["Auditory", "Reading/Writing"], avatar: "https://placehold.co/80x80.png?text=NS", dataAiHint: "profile person" },
  { id: 3, name: "Orion Byte", courses: ["Calculus II", "Astrophysics 101"], learningStyles: ["Kinesthetic", "Reading/Writing"], avatar: "https://placehold.co/80x80.png?text=OB", dataAiHint: "profile person" },
];

const studyGroups = [
  { id: 1, name: "Quantum Leapsters", courses: ["Quantum Mechanics"], members: 3, description: "Mastering the quantum realm together." },
  { id: 2, name: "Astro Alliance", courses: ["Astrophysics 101"], members: 5, description: "Exploring the cosmos, one equation at a time." },
];

const sharedResources = [
  { id: 1, name: "Astro Notes Ch. 1-3.pdf", type: "PDF", uploader: "Alex Cosmo", course: "Astrophysics 101" },
  { id: 2, name: "Calculus Practice Set 1.docx", type: "DOCX", uploader: "Admin", course: "Calculus II" },
];

const studySessions = [
  { id: 1, topic: "Astrophysics Midterm Review", dateTime: "October 28, 2023, 2:00 PM", group: "Astro Alliance", location: "Virtual via UniMeet" },
  { id: 2, topic: "Quantum Entanglement Workshop", dateTime: "November 5, 2023, 5:00 PM", group: "Quantum Leapsters", location: "Library Room 3B" },
];

export default function StudySpherePage() {
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
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-center mb-4 text-center">
          <UsersRound className="h-16 w-16 text-primary mr-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-primary">Study Sphere</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-10">
          Connect with fellow learners, form study constellations, and navigate your academic journey together. Start by defining your profile, finding partners, or joining a group!
        </p>
      </div>

      <div className="space-y-10">
        {/* Your Study Profile */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><BookOpen className="mr-3 h-7 w-7 text-accent" />Your Study Profile</CardTitle>
            <CardDescription>Define your academic focus and how you learn best to find the perfect study mates.</CardDescription>
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
            <Button onClick={() => handleDemoClick("Navigating to profile edit page... (Demo)")} variant="outline" className="mt-2 border-accent text-accent hover:bg-accent/10">
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Search for Study Partners */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><SearchIcon className="mr-3 h-7 w-7 text-accent" />Find Your Constellation</CardTitle>
            <CardDescription>Filter by courses and learning preferences to discover compatible study partners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course-filter" className="text-base text-foreground/90">Filter by Course:</Label>
              <Select onValueChange={(value) => handleDemoClick(`Filtered by course: ${value} (Demo)`)}>
                <SelectTrigger id="course-filter" className="w-full bg-background/70">
                  <SelectValue placeholder="Select a course to find peers" />
                </SelectTrigger>
                <SelectContent>
                  {hardcodedCourses.map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style-filter" className="text-base text-foreground/90">Filter by Learning Style:</Label>
              <Select onValueChange={(value) => handleDemoClick(`Filtered by style: ${value} (Demo)`)}>
                <SelectTrigger id="style-filter" className="w-full bg-background/70">
                  <SelectValue placeholder="Select a preferred learning style" />
                </SelectTrigger>
                <SelectContent>
                  {learningStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleDemoClick("Searching for partners... (Demo - results would appear below)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <SearchIcon className="mr-2 h-4 w-4" /> Search Partners
            </Button>
          </CardContent>
        </Card>
        
        {/* Study Groups */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Group className="mr-3 h-7 w-7 text-accent" />Collaborative Orbits (Study Groups)</CardTitle>
            <CardDescription>Launch your own study group or join an existing constellation of learners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => handleDemoClick("Navigating to 'Create New Group' form... (Demo)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <Users className="mr-2 h-4 w-4" /> Create New Group
            </Button>
            <Separator className="my-6 bg-border/50" />
            <h3 className="font-semibold text-lg mb-2 text-foreground">Join Existing Groups:</h3>
            {studyGroups.map(group => (
              <Card key={group.id} className="p-4 bg-background/50 border-border/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-grow mb-3 sm:mb-0">
                    <h4 className="font-semibold text-lg text-foreground">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">Focus: {group.courses.join(', ')}</p>
                    <p className="text-sm text-foreground/80 mt-1">{group.description}</p>
                    <Badge variant="secondary" className="mt-2">{group.members} members</Badge>
                  </div>
                  <Button onClick={() => handleDemoClick(`Requesting to join ${group.name}... (Demo)`)} size="sm" variant="outline" className="mt-1 border-accent text-accent hover:bg-accent/10 self-start sm:self-center">
                    Join Group
                  </Button>
                </div>
              </Card>
            ))}
             {studyGroups.length === 0 && <p className="text-muted-foreground">No study groups found. Why not create one?</p>}
          </CardContent>
        </Card>

        {/* Potential Study Buddies - This section naturally follows search/group actions */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Users className="mr-3 h-7 w-7 text-accent" />Potential Study Buddies</CardTitle>
            <CardDescription>Discover students who align with your academic journey (results from search/recommendations).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {potentialMatches.map(match => (
              <Card key={match.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-background/50 border-border/50">
                <img src={match.avatar} alt={match.name} data-ai-hint={match.dataAiHint} className="h-16 w-16 rounded-full object-cover" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-foreground">{match.name}</h4>
                  <p className="text-sm text-muted-foreground">Shared Courses: {match.courses.join(', ')}</p>
                  <p className="text-sm text-muted-foreground">Learning Styles: {match.learningStyles.join(', ')}</p>
                </div>
                <Button onClick={() => handleDemoClick(`Connection request sent to ${match.name}! (Demo)`)} size="sm" variant="outline" className="shrink-0 self-start sm:self-center border-accent text-accent hover:bg-accent/10">
                  <UserPlus className="mr-2 h-4 w-4" /> Connect
                </Button>
              </Card>
            ))}
            {potentialMatches.length === 0 && <p className="text-muted-foreground">No specific matches found yet. Try searching or refining your profile!</p>}
          </CardContent>
        </Card>

        {/* Share Study Resources */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><FileText className="mr-3 h-7 w-7 text-accent" />Knowledge Nebula (Shared Resources)</CardTitle>
            <CardDescription>Exchange notes, summaries, and helpful materials with your connections and groups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => handleDemoClick("Navigating to 'Upload Resource' page... (Demo)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Resource
            </Button>
            <Separator className="my-6 bg-border/50" />
            <h3 className="font-semibold text-lg mb-2 text-foreground">Available Resources:</h3>
            {sharedResources.map(resource => (
              <Card key={resource.id} className="p-4 flex items-center space-x-4 bg-background/50 border-border/50">
                <FileText className="h-8 w-8 text-accent" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-lg text-foreground">{resource.name}</h4>
                  <p className="text-sm text-muted-foreground">Type: {resource.type} | Course: {resource.course}</p>
                  <p className="text-sm text-muted-foreground">Uploaded by: {resource.uploader}</p>
                </div>
                <Button onClick={() => handleDemoClick(`Downloading ${resource.name}... (Demo)`)} variant="ghost" size="icon">
                  <Download className="h-5 w-5 text-accent" />
                </Button>
              </Card>
            ))}
            {sharedResources.length === 0 && <p className="text-muted-foreground">No resources shared yet. Be the first to contribute!</p>}
          </CardContent>
        </Card>

        {/* Coordinate Study Sessions */}
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-primary"><Clock className="mr-3 h-7 w-7 text-accent" />Synchronized Orbits (Study Sessions)</CardTitle>
            <CardDescription>Plan and schedule study times with your partners or groups.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => handleDemoClick("Navigating to 'Schedule New Session' page... (Demo)")} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <CalendarPlus className="mr-2 h-4 w-4" /> Schedule New Session
            </Button>
            <Separator className="my-6 bg-border/50" />
            <h3 className="font-semibold text-lg mb-2 text-foreground">Upcoming Sessions:</h3>
            {studySessions.map(session => (
              <Card key={session.id} className="p-4 bg-background/50 border-border/50">
                <h4 className="font-semibold text-lg text-foreground">{session.topic}</h4>
                <p className="text-sm text-muted-foreground">When: {session.dateTime}</p>
                <p className="text-sm text-muted-foreground">With: {session.group} | Where: {session.location}</p>
                 <Button onClick={() => handleDemoClick(`Viewing details for session: ${session.topic} (Demo)`)} size="sm" variant="link" className="p-0 h-auto text-accent mt-1">View Details / Join</Button>
              </Card>
            ))}
            {studySessions.length === 0 && <p className="text-muted-foreground">No study sessions scheduled yet.</p>}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

    
