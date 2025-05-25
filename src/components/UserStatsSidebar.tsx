
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Users, Brain, FlaskConical, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/app/study-sphere/page'; // Assuming UserProfile is exported and accessible
import type { MockStudentProfile } from '@/app/study-sphere/page'; // Assuming MockStudentProfile is exported

interface StoredUserProfile extends Partial<UserProfile> {}
interface StoredConnections extends Array<MockStudentProfile> {}

const UserStatsSidebar: FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredUserProfile | null>(null);
  const [connectionsCount, setConnectionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      setIsLoading(true);
      try {
        const profileKey = `uniVerse-studySphere-studyProfile-${user.uid}`;
        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile) as StoredUserProfile);
        } else {
          setProfile({ skills: [], projectAreas: [] }); // Default empty if no profile
        }

        const connectionsKey = `uniVerse-studySphere-connections-${user.uid}`;
        const savedConnections = localStorage.getItem(connectionsKey);
        if (savedConnections) {
          setConnectionsCount((JSON.parse(savedConnections) as StoredConnections).length);
        } else {
          setConnectionsCount(0);
        }
      } catch (error) {
        console.error("Error loading data from localStorage for stats sidebar:", error);
        setProfile({ skills: [], projectAreas: [] });
        setConnectionsCount(0);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setProfile(null);
      setConnectionsCount(0);
    }
  }, [user]);

  if (!user) {
    return null; // Don't render sidebar if no user
  }

  if (isLoading) {
    return (
      <aside className="hidden md:flex w-64 h-screen flex-col border-r border-border bg-card/50 p-4 space-y-4 sticky top-0 overflow-y-auto items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading Stats...</p>
      </aside>
    );
  }

  const skills = profile?.skills || [];
  const projectAreas = profile?.projectAreas || [];

  return (
    <aside className="hidden md:flex w-64 h-screen flex-col border-r border-border bg-card/60 backdrop-blur-sm p-4 space-y-6 sticky top-0 overflow-y-auto">
      <Card className="bg-background/50 border-primary/30 shadow-md">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-mono text-primary flex items-center">
            <LinkIcon className="mr-2 h-5 w-5" />
            Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-accent">{connectionsCount}</p>
          <p className="text-xs text-muted-foreground">Peers Connected</p>
        </CardContent>
      </Card>

      <Separator className="bg-border/70" />

      <Card className="bg-background/50 border-primary/30 shadow-md">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-mono text-primary flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            My Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="mr-1 mb-1 bg-primary/25 text-primary-foreground text-xs">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No skills defined yet.</p>
          )}
        </CardContent>
      </Card>
      
      <Separator className="bg-border/70" />

      <Card className="bg-background/50 border-primary/30 shadow-md">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-mono text-primary flex items-center">
            <FlaskConical className="mr-2 h-5 w-5" />
            Project Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {projectAreas.length > 0 ? (
            projectAreas.map((area) => (
              <Badge key={area} variant="outline" className="mr-1 mb-1 border-accent/70 text-accent text-xs">
                {area}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">No project areas defined.</p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};

export default UserStatsSidebar;
