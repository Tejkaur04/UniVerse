
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users, Brain, FlaskConical, Link as LinkIcon, Loader2, Home, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Settings, HelpCircle
} from 'lucide-react';
import type { UserProfile } from '@/app/study-sphere/page';
import type { MockStudentProfile } from '@/app/study-sphere/page';

interface StoredUserProfile extends Partial<UserProfile> {}
interface StoredConnections extends Array<MockStudentProfile> {}

const navFeatures = [
  { href: "/study-sphere", label: "Study Sphere", icon: UsersRound },
  { href: "/event-horizon", label: "Event Horizon", icon: CalendarDays },
  { href: "/celestial-chats", label: "Celestial Chats", icon: MessageCircleQuestion },
  { href: "/nebula-of-ideas", label: "Nebula of Ideas", icon: Lightbulb },
];

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
          setProfile({ skills: [], projectAreas: [] });
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
    return null;
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
    <aside className="hidden md:flex w-64 h-full flex-col border-r border-border bg-card/60 backdrop-blur-sm p-4 sticky top-0 overflow-y-auto">
      <div className="flex-grow space-y-6">
        {/* UniVerse Logo/Home Link */}
         <Link href="/" className="flex items-center space-x-2 mb-6 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-accent transition-colors"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12a10 10 0 0 0-7.07 2.93L12 22V12Z"/><path d="m20 12-8 8"/></svg>
            <span className="font-bold text-xl font-mono text-primary group-hover:text-accent transition-colors">
              UniVerse
            </span>
        </Link>

        {/* Navigation Section */}
        <nav className="space-y-2">
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigate</h3>
          {navFeatures.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-sm text-foreground/80 hover:text-primary hover:bg-primary/10"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <Separator className="bg-border/70" />

        {/* Stats Section */}
        <div>
            <h3 className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Stats</h3>
            <Card className="bg-background/50 border-primary/30 shadow-sm">
                <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md font-mono text-primary flex items-center">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Connections
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                <p className="text-2xl font-bold text-accent">{connectionsCount}</p>
                </CardContent>
            </Card>

            <Card className="mt-3 bg-background/50 border-primary/30 shadow-sm">
                <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md font-mono text-primary flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    My Skills
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {skills.length > 0 ? (
                    skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="mr-1 mb-1 bg-primary/25 text-primary-foreground text-xs">
                        {skill}
                    </Badge>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground">No skills defined.</p>
                )}
                </CardContent>
            </Card>
            
            <Card className="mt-3 bg-background/50 border-primary/30 shadow-sm">
                <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-md font-mono text-primary flex items-center">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Project Areas
                </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 max-h-28 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {projectAreas.length > 0 ? (
                    projectAreas.map((area) => (
                    <Badge key={area} variant="outline" className="mr-1 mb-1 border-accent/70 text-accent text-xs">
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

      {/* Footer actions in Sidebar */}
      <div className="mt-auto space-y-2 pt-6 border-t border-border/70">
         <Button
              variant="ghost"
              className="w-full justify-start text-sm text-foreground/80 hover:text-primary hover:bg-primary/10"
              onClick={() => alert("Settings Clicked (Demo)")} // Replace with actual navigation or dialog
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
          </Button>
          <Button
              variant="ghost"
              className="w-full justify-start text-sm text-foreground/80 hover:text-primary hover:bg-primary/10"
              onClick={() => alert("Help & Support Clicked (Demo)")} // Replace with actual navigation or dialog
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Help & Support
          </Button>
      </div>
    </aside>
  );
};

export default UserStatsSidebar;
