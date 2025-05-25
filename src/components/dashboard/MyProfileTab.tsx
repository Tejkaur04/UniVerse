
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit3, Save, UserCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface UserProfile {
  id: string;
  name: string;
  collegeId: string;
  year: string;
  department: string;
  profilePictureUrl?: string;
  skills: string[];
  interests: string[];
  projectAreas: string[];
}

const DEPARTMENTS = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Arts & Humanities", "Business Administration", "Biology"];
const YEARS = ["Fresher", "Sophomore", "Junior", "Senior", "Graduate"];

const MyProfileTab: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState<Partial<UserProfile>>({
    name: '',
    collegeId: '',
    year: '',
    department: '',
    profilePictureUrl: '',
    skills: [],
    interests: [],
    projectAreas: [],
  });

  const profileLocalStorageKey = user ? `peerconnect-profile-${user.uid}` : null;

  useEffect(() => {
    if (profileLocalStorageKey) {
      const savedProfile = localStorage.getItem(profileLocalStorageKey);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile) as UserProfile;
        setProfile(parsedProfile);
        setEditForm(parsedProfile);
      } else if (user) {
        // Initialize a new profile if none exists
        const newProfile: UserProfile = {
          id: user.uid,
          name: user.email?.split('@')[0] || 'New User',
          collegeId: '',
          year: YEARS[0],
          department: DEPARTMENTS[0],
          skills: [],
          interests: [],
          projectAreas: [],
          profilePictureUrl: `https://placehold.co/128x128.png?text=${(user.email?.charAt(0) || 'U').toUpperCase()}`
        };
        setProfile(newProfile);
        setEditForm(newProfile);
        setIsEditing(true); // Open edit mode for new profiles
         toast({
          title: "Welcome to PeerConnect!",
          description: "Please complete your profile to get started.",
        });
      }
    }
  }, [profileLocalStorageKey, user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field: keyof UserProfile, value: string) => {
    const valuesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setEditForm(prev => ({ ...prev, [field]: valuesArray }));
  };

  const handleSaveProfile = () => {
    if (!editForm.name?.trim() || !editForm.collegeId?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Name and College ID are required.',
      });
      return;
    }
    const updatedProfile = { ...profile, ...editForm } as UserProfile;
    setProfile(updatedProfile);
    if (profileLocalStorageKey) {
      localStorage.setItem(profileLocalStorageKey, JSON.stringify(updatedProfile));
    }
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully saved locally.',
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
    });
  };

  const handleEditToggle = () => {
    if (isEditing) { // If currently editing, try to save
      handleSaveProfile();
    } else { // If not editing, just enter edit mode
      setEditForm(profile || {}); // Reset form to current profile or empty
      setIsEditing(true);
    }
  };


  if (!profile && !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Loading Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view or create your profile.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile && user) {
     return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <UserCircle className="mx-auto h-16 w-16 text-primary mb-3" />
                <CardTitle className="text-2xl">Loading Your Profile...</CardTitle>
                <CardDescription>Just a moment while we fetch your details.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </CardContent>
        </Card>
     );
  }


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="text-center relative">
        <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary shadow-md">
          <AvatarImage src={isEditing ? editForm.profilePictureUrl : profile?.profilePictureUrl} alt={profile?.name} data-ai-hint="profile person" />
          <AvatarFallback className="text-4xl bg-secondary">
            {profile?.name?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        {isEditing ? (
          <Input
            name="name"
            value={editForm.name || ''}
            onChange={handleInputChange}
            placeholder="Your Name"
            className="text-3xl font-bold text-center border-0 shadow-none focus-visible:ring-0 !bg-transparent p-1"
          />
        ) : (
          <CardTitle className="text-3xl font-bold">{profile?.name}</CardTitle>
        )}
        {isEditing ? (
            <div className="flex items-center justify-center gap-2 mt-1">
                <Input
                    name="department"
                    value={editForm.department || ''}
                    onChange={handleInputChange}
                    placeholder="Department"
                    className="text-sm text-muted-foreground text-center border-0 shadow-none focus-visible:ring-0 !bg-transparent p-1 w-1/3"
                />
                 <span className="text-muted-foreground">-</span>
                <Input
                    name="year"
                    value={editForm.year || ''}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="text-sm text-muted-foreground text-center border-0 shadow-none focus-visible:ring-0 !bg-transparent p-1 w-1/4"
                />
            </div>
        ) : (
          <CardDescription className="text-lg text-muted-foreground">
            {profile?.department} - {profile?.year}
          </CardDescription>
        )}
        <Button
          onClick={handleEditToggle}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
        >
          {isEditing ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
          <span className="sr-only">{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
        </Button>
      </CardHeader>

      <CardContent className="mt-6 space-y-6">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="collegeId">College ID</Label>
              <Input id="collegeId" name="collegeId" value={editForm.collegeId || ''} onChange={handleInputChange} placeholder="Your College ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">Profile Picture URL (Optional)</Label>
              <Input id="profilePictureUrl" name="profilePictureUrl" value={editForm.profilePictureUrl || ''} onChange={handleInputChange} placeholder="https://example.com/your-image.png" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="department-select">Department</Label>
                <select
                    id="department-select"
                    name="department"
                    value={editForm.department || ''}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled>Select Department</option>
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year-select">Year</Label>
                 <select
                    id="year-select"
                    name="year"
                    value={editForm.year || ''}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled>Select Year</option>
                    {YEARS.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Textarea id="skills" name="skills" value={(editForm.skills || []).join(', ')} onChange={(e) => handleArrayInputChange('skills', e.target.value)} placeholder="e.g., React, Python, Public Speaking" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Textarea id="interests" name="interests" value={(editForm.interests || []).join(', ')} onChange={(e) => handleArrayInputChange('interests', e.target.value)} placeholder="e.g., AI, Blockchain, Hiking" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectAreas">Project Areas (comma-separated)</Label>
              <Textarea id="projectAreas" name="projectAreas" value={(editForm.projectAreas || []).join(', ')} onChange={(e) => handleArrayInputChange('projectAreas', e.target.value)} placeholder="e.g., Web Development, Mobile Apps, Research" />
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">College ID</h3>
              <p className="text-foreground">{profile?.collegeId || 'Not set'}</p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? profile.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.interests && profile.interests.length > 0 ? profile.interests.map(interest => <Badge key={interest}>{interest}</Badge>) : <p className="text-sm text-muted-foreground">No interests listed.</p>}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Project Areas</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.projectAreas && profile.projectAreas.length > 0 ? profile.projectAreas.map(area => <Badge key={area} variant="outline">{area}</Badge>) : <p className="text-sm text-muted-foreground">No project areas listed.</p>}
              </div>
            </div>
          </>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSaveProfile} className="w-full bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Added missing import for Loader2
import { Loader2 } from 'lucide-react';

export default MyProfileTab;
