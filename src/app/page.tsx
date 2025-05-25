
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProfileTab from '@/components/dashboard/MyProfileTab';
import BrowseStudentsTab from '@/components/dashboard/BrowseStudentsTab';
import MyConnectionsTab from '@/components/dashboard/MyConnectionsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Search, Link2, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [numConnections, setNumConnections] = useState(0);
  const [numSkills, setNumSkills] = useState(0);
  const [numProjectTags, setNumProjectTags] = useState(0);

  const connectionsLocalStorageKey = user ? `peerconnect-connections-${user.uid}` : null;
  const profileLocalStorageKey = user ? `peerconnect-profile-${user.uid}` : null;

  useEffect(() => {
    if (connectionsLocalStorageKey) {
      const savedConnections = localStorage.getItem(connectionsLocalStorageKey);
      if (savedConnections) {
        setNumConnections(JSON.parse(savedConnections).length);
      }
    }
    if (profileLocalStorageKey) {
      const savedProfile = localStorage.getItem(profileLocalStorageKey);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setNumSkills(profile.skills?.length || 0);
        setNumProjectTags(profile.projectAreas?.length || 0);
      }
    }
     // This effect should re-run if the user logs in/out, or if local storage might change
     // Adding a listener or a more robust state management would be better for real-time updates.
  }, [connectionsLocalStorageKey, profileLocalStorageKey, user]);


  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <h1 className="text-3xl font-bold mb-2 text-center md:text-left">PeerConnect Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-center md:text-left">
        Welcome back! Manage your profile, discover peers, and view your connections.
      </p>

      {/* Stats Section - Simulated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Connections</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numConnections}</div>
            <p className="text-xs text-muted-foreground">Peers you've connected with</p>
          </CardContent>
        </Card>
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Skills</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numSkills}</div>
            <p className="text-xs text-muted-foreground">Skills listed on your profile</p>
          </CardContent>
        </Card>
        <Card className="shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Project Tags</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numProjectTags}</div>
            <p className="text-xs text-muted-foreground">Project areas you're interested in</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 mb-6">
          <TabsTrigger value="profile" className="text-sm sm:text-base">
            <UserCircle className="mr-2 h-5 w-5" /> My Profile
          </TabsTrigger>
          <TabsTrigger value="browse" className="text-sm sm:text-base">
            <Search className="mr-2 h-5 w-5" /> Browse Students
          </TabsTrigger>
          <TabsTrigger value="connections" className="text-sm sm:text-base">
            <Link2 className="mr-2 h-5 w-5" /> My Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-fade-in-up">
          <MyProfileTab />
        </TabsContent>
        <TabsContent value="browse" className="animate-fade-in-up">
          <BrowseStudentsTab />
        </TabsContent>
        <TabsContent value="connections" className="animate-fade-in-up">
          <MyConnectionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
