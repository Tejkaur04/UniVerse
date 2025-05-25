
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added Button import
import { useAuth } from '@/contexts/AuthContext';
import { Users, Link2, MessageSquare, XCircle } from 'lucide-react';
import type { UserProfile } from './MyProfileTab'; // Assuming UserProfile is exported
import { useToast } from '@/hooks/use-toast';


// Re-defining MockStudentProfile here if it's not globally accessible
// Or ideally import it if defined elsewhere and exported
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


const MyConnectionsTab: FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<MockStudentProfile[]>([]);
  const connectionsLocalStorageKey = user ? `peerconnect-connections-${user.uid}` : null;

  useEffect(() => {
    if (connectionsLocalStorageKey) {
      const savedConnections = localStorage.getItem(connectionsLocalStorageKey);
      if (savedConnections) {
        setConnections(JSON.parse(savedConnections));
      }
    }
  }, [connectionsLocalStorageKey]);

  const handleRemoveConnection = (studentId: string) => {
    if (!connectionsLocalStorageKey) return;

    const updatedConnections = connections.filter(conn => conn.id !== studentId);
    setConnections(updatedConnections);
    localStorage.setItem(connectionsLocalStorageKey, JSON.stringify(updatedConnections));
    toast({
      title: "Connection Removed",
      description: `You have removed ${connections.find(c=>c.id === studentId)?.name || 'this user'} from your connections.`,
      action: <XCircle className="h-5 w-5 text-red-500" />
    });
  };

  const handleSendMessage = (studentName: string) => {
     toast({
      title: "Message (Demo)",
      description: `Simulating sending a message to ${studentName}. This feature would integrate a chat system.`,
    });
  }


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Link2 className="mr-2 h-6 w-6 text-primary" /> My Connections
        </CardTitle>
        <CardDescription>
          {connections.length > 0 
            ? `You have ${connections.length} connection${connections.length === 1 ? '' : 's'}.` 
            : "You haven't made any connections yet. Start browsing to connect with peers!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connections.length > 0 ? (
          <div className="space-y-4">
            {connections.map(conn => (
              <Card key={conn.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conn.profilePictureUrl} alt={conn.name} data-ai-hint={conn.dataAiHint} />
                    <AvatarFallback>{conn.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-md">{conn.name}</h3>
                    <p className="text-xs text-muted-foreground">{conn.department} - {conn.year}</p>
                  </div>
                </div>
                <div className="flex space-x-2 self-start sm:self-center">
                   <Button variant="outline" size="sm" onClick={() => handleSendMessage(conn.name)}>
                    <MessageSquare className="mr-1 h-3 w-3" /> Message (Demo)
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveConnection(conn.id)}>
                    <XCircle className="mr-1 h-3 w-3" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No connections to display.</p>
            <p className="text-sm text-muted-foreground">Go to the "Browse Students" tab to find and connect with peers.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyConnectionsTab;
