
"use client";

import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Search, Filter, Users, Briefcase, Palette, ThumbsUp } from 'lucide-react';
import type { UserProfile } from './MyProfileTab'; // Assuming UserProfile is exported
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface MockStudentProfile {
  id: string;
  name: string;
  year: string;
  department: string;
  profilePictureUrl?: string;
  dataAiHint?: string;
  skills: string[];
  interests: string[];
  projectAreas: string[];
}

const MOCK_STUDENTS_DATA: MockStudentProfile[] = [
  { id: 'student1', name: 'Alice Wonderland', year: 'Sophomore', department: 'Computer Science', skills: ['React', 'Node.js', 'UI/UX'], interests: ['AI', 'Web Development'], projectAreas: ['EdTech App'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'student portrait' },
  { id: 'student2', name: 'Bob The Builder', year: 'Junior', department: 'Mechanical Engineering', skills: ['CAD', 'Prototyping', '3D Printing'], interests: ['Robotics', 'Sustainable Design'], projectAreas: ['Automated Rover'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'engineer student' },
  { id: 'student3', name: 'Charlie Brown', year: 'Fresher', department: 'Arts & Humanities', skills: ['Creative Writing', 'Illustration'], interests: ['Storytelling', 'Graphic Novels'], projectAreas: ['Campus Zine'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'artist student' },
  { id: 'student4', name: 'Diana Prince', year: 'Senior', department: 'Business Administration', skills: ['Marketing', 'Leadership', 'Finance'], interests: ['Startups', 'Social Impact'], projectAreas: ['Non-profit Platform'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'business student' },
  { id: 'student5', name: 'Edward Scissorhands', year: 'Sophomore', department: 'Computer Science', skills: ['Python', 'Cybersecurity'], interests: ['Ethical Hacking', 'Cryptography'], projectAreas: ['Security Tool'], profilePictureUrl: 'https://placehold.co/80x80.png', dataAiHint: 'tech student' },
];

const ALL_DEPARTMENTS = ["All", ...new Set(MOCK_STUDENTS_DATA.map(s => s.department))];
const ALL_YEARS = ["All", ...new Set(MOCK_STUDENTS_DATA.map(s => s.year))];
const ALL_INTERESTS = ["All", ...new Set(MOCK_STUDENTS_DATA.flatMap(s => s.interests))];


const BrowseStudentsTab: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All');

  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const connectionsLocalStorageKey = user ? `peerconnect-connections-${user.uid}` : null;
  const sentRequestsLocalStorageKey = user ? `peerconnect-sent-requests-${user.uid}` : null;


  useEffect(() => {
    if (sentRequestsLocalStorageKey) {
      const savedRequests = localStorage.getItem(sentRequestsLocalStorageKey);
      if (savedRequests) {
        setSentRequests(JSON.parse(savedRequests));
      }
    }
  }, [sentRequestsLocalStorageKey]);

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS_DATA.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const departmentMatch = departmentFilter === 'All' || student.department === departmentFilter;
      const yearMatch = yearFilter === 'All' || student.year === yearFilter;
      const interestMatch = interestFilter === 'All' || student.interests.includes(interestFilter) || student.skills.includes(interestFilter) || student.projectAreas.includes(interestFilter);
      
      // Exclude self if user profile matches mock data (simple name check for demo)
      if(user && user.email?.split('@')[0].toLowerCase() === student.name.split(' ')[0].toLowerCase()){
        return false;
      }
      return nameMatch && departmentMatch && yearMatch && interestMatch;
    });
  }, [searchTerm, departmentFilter, yearFilter, interestFilter, user]);

  const handleConnect = (student: MockStudentProfile) => {
    if (!user || !connectionsLocalStorageKey || !sentRequestsLocalStorageKey) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to connect.' });
      return;
    }

    // Simulate auto-acceptance and add to connections
    const currentConnections: MockStudentProfile[] = JSON.parse(localStorage.getItem(connectionsLocalStorageKey) || '[]');
    if (!currentConnections.find(c => c.id === student.id)) {
      const newConnections = [...currentConnections, student];
      localStorage.setItem(connectionsLocalStorageKey, JSON.stringify(newConnections));
    }
    
    // Add to sent requests
    const updatedSentRequests = [...sentRequests, student.id];
    setSentRequests(updatedSentRequests);
    localStorage.setItem(sentRequestsLocalStorageKey, JSON.stringify(updatedSentRequests));

    toast({
      title: 'Connection Request Sent!',
      description: `You've sent a connection request to ${student.name}. (Simulated auto-acceptance for demo)`,
      action: <ThumbsUp className="h-5 w-5 text-green-500" />
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="mr-2 h-6 w-6 text-primary" /> Discover Peers
          </CardTitle>
          <CardDescription>Find students with shared interests, skills, or from your department.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="search"
            placeholder="Search by name, skill, or interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger><div className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Department</div></SelectTrigger>
              <SelectContent>
                {ALL_DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger><div className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" />Year</div></SelectTrigger>
              <SelectContent>
                {ALL_YEARS.map(yr => <SelectItem key={yr} value={yr}>{yr}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={interestFilter} onValueChange={setInterestFilter}>
              <SelectTrigger><div className="flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Interest/Skill</div></SelectTrigger>
              <SelectContent>
                {ALL_INTERESTS.map(interest => <SelectItem key={interest} value={interest}>{interest}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <Card key={student.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={student.profilePictureUrl} alt={student.name} data-ai-hint={student.dataAiHint} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.department} - {student.year}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">Interests:</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.interests.slice(0,3).map(interest => <Badge key={interest} variant="default" className="text-xs">{interest}</Badge>)}
                    {student.interests.length > 3 && <Badge variant="outline" className="text-xs">+{student.interests.length - 3} more</Badge>}
                  </div>
                </div>
                 <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0,3).map(skill => <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>)}
                     {student.skills.length > 3 && <Badge variant="outline" className="text-xs">+{student.skills.length - 3} more</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleConnect(student)}
                  disabled={sentRequests.includes(student.id)}
                  variant={sentRequests.includes(student.id) ? "secondary" : "default"}
                  className="w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {sentRequests.includes(student.id) ? 'Request Sent' : 'Connect'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-10 shadow-sm">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Peers Found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrowseStudentsTab;
