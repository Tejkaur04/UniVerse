
"use client";

import { Bot, MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AlienGuideProps {
  // Message prop is no longer needed here as it's managed by pathname
}

export default function AlienGuide({}: AlienGuideProps) {
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("Greetings, Earthling! Welcome to UniVerse. Click my icon to toggle this message!");
  const pathname = usePathname();

  useEffect(() => {
    // Set default message based on path
    switch (pathname) {
      case '/':
        setCurrentMessage("Welcome to UniVerse! Explore the cosmos of possibilities. Click my icon to toggle this guidance.");
        break;
      case '/study-sphere':
        setCurrentMessage("You've entered the Study Sphere! Define your learning constellation, find partners, and manage groups. This is your local hub!");
        break;
      case '/event-horizon':
        setCurrentMessage("Welcome to the Event Horizon! Discover campus events, create your own, and RSVP. Your choices are saved locally.");
        break;
      case '/celestial-chats':
        setCurrentMessage("Celestial Chats is where you gain wisdom. Ask our AI or join AMAs! Your connections here are saved locally.");
        break;
      case '/nebula-of-ideas':
        setCurrentMessage("The Nebula of Ideas awaits! Share projects and find collaborators. Ideas you submit are saved in your browser.");
        break;
      case '/my-connections':
        setCurrentMessage("Here are all your cosmic connections from across UniVerse! Manage your network here. Saved locally.");
        break;
      default:
        setCurrentMessage("Exploring UniVerse? Click my icon if you need to toggle this message!");
    }
    setIsMessageVisible(true); // Show message when path changes
  }, [pathname]);
  

  const toggleMessage = () => {
    setIsMessageVisible(!isMessageVisible);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      <AnimatePresence>
        {isMessageVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Card className="max-w-xs bg-card/80 backdrop-blur-md shadow-2xl border-primary/50">
              <CardContent className="p-4 text-sm">
                <div className="flex items-start space-x-2">
                  <MessageSquareText className="h-6 w-6 text-primary mt-0.5 shrink-0" />
                  <p>{currentMessage}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        role="button"
        tabIndex={0}
        onClick={toggleMessage}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMessage(); }}
        className="p-0 m-0 cursor-pointer rounded-full text-primary hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-bounce"
        aria-label={isMessageVisible ? "Hide guide message" : "Show guide message"}
        title={isMessageVisible ? "Hide guide message" : "Show guide message"}
      >
        <Bot className="h-16 w-16" />
      </div>
    </div>
  );
}
