
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, Link2 as ConnectionsIcon, MessageSquare, XCircle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import type { MockStudentProfile } from '@/app/study-sphere/page'; // Re-using this type for connections

const MyConnectionsPage: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<MockStudentProfile[]>([]);

  const userLocalStorageKey = (baseKey: string): string | null => {
    return user ? `uniVerse-${baseKey}-${user.uid}` : null;
  };

  const loadConnections = () => {
    if (typeof window === 'undefined') return [];
    const key = userLocalStorageKey('connections');
    if (!key) return [];
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved) as MockStudentProfile[]; }
      catch (error) { console.error("Failed to parse connections from localStorage", error); return []; }
    }
    return [];
  };

  const saveConnections = (updatedConnections: MockStudentProfile[]) => {
    if (typeof window === 'undefined' || !user) return;
    const key = userLocalStorageKey('connections');
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(updatedConnections));
  };

  useEffect(() => {
    setConnections(loadConnections());
  }, [user]);

  const handleRemoveConnection = (studentId: string) => {
    const connectionToRemove = connections.find(conn => conn.id === studentId);
    const updatedConnections = connections.filter(conn => conn.id !== studentId);
    setConnections(updatedConnections);
    saveConnections(updatedConnections);
    toast({
      title: "Connection Severed",
      description: `You've disconnected from ${connectionToRemove?.name || 'this entity'}.`,
      action: <XCircle className="h-5 w-5 text-red-500" />
    });
  };

  const handleSendMessage = (studentName: string) => {
    toast({
      title: "Message (Demo)",
      description: `Simulating opening a chat with ${studentName}. Real chat coming soon!`,
    });
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
          <ConnectionsIcon className="h-16 w-16 text-primary mx-auto mb-3 animate-subtle-pulse" />
          <h1 className="text-4xl font-bold font-mono mb-2 bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">My Cosmic Connections</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your network of study buddies, mentors, and project collaborators across the UniVerse.
          </p>
           <p className="text-sm text-muted-foreground mt-1">
            (All connections are saved locally in your browser for this demo.)
          </p>
        </div>
      </div>

      <Card className="shadow-xl bg-card/90 backdrop-blur-md border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-mono text-primary flex items-center">
            <Users className="mr-3 h-7 w-7" /> Your Connected Peers
          </CardTitle>
          <CardDescription>
            {connections.length > 0
              ? `You have ${connections.length} connection${connections.length === 1 ? '' : 's'}.`
              : "You haven't established any connections yet. Explore UniVerse to find peers!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connections.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {connections.map(conn => (
                <Card key={conn.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-background/50 border border-border/50 shadow-md hover:border-border/70 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <Avatar className="h-12 w-12 border-2 border-accent">
                      <Image src={conn.profilePictureUrl || `https://placehold.co/80x80.png?text=${conn.name.charAt(0)}`} alt={conn.name} width={48} height={48} className="rounded-full object-cover" data-ai-hint={conn.dataAiHint || 'person avatar'} />
                      <AvatarFallback>{conn.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-md text-primary">{conn.name}</h3>
                      <p className="text-xs text-muted-foreground">{conn.role || conn.department} {conn.role && conn.year && conn.year !== 'N/A' ? `- ${conn.year}` : conn.year !== 'N/A' ? conn.year : ''}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 self-start sm:self-center">
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10" onClick={() => handleSendMessage(conn.name)}>
                      <MessageSquare className="mr-1 h-3 w-3" /> Message (Demo)
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveConnection(conn.id)}>
                      <XCircle className="mr-1 h-3 w-3" /> Disconnect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ConnectionsIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No connections to display.</p>
              <p className="text-sm text-muted-foreground">Explore features like Study Sphere or Nebula of Ideas to connect with peers.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyConnectionsPage;
