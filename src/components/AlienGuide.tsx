
"use client";

import { Bot, MessageSquareText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AlienGuideProps {
  message?: string; // Make message optional
}

export default function AlienGuide({ message: initialMessage }: AlienGuideProps) {
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(initialMessage || "Greetings, Earthling! Welcome to UniVerse. Click me to hide this message!");
  const pathname = usePathname();

  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage);
    } else {
      // Set default message based on path if no specific message is passed
      switch (pathname) {
        case '/':
          setCurrentMessage("Welcome to UniVerse! Explore the cosmos of possibilities. Click my icon to toggle this message.");
          break;
        case '/study-sphere':
          setCurrentMessage("You've entered the Study Sphere! Define your learning constellation and find study partners. Click my icon to hide this.");
          break;
        case '/event-horizon':
          setCurrentMessage("Welcome to the Event Horizon! Discover exciting campus events and workshops. Need help? Click my icon!");
          break;
        case '/celestial-chats':
          setCurrentMessage("Celestial Chats is where you gain wisdom. Ask our AI or join AMAs! Toggle my message with a click.");
          break;
        case '/nebula-of-ideas':
          setCurrentMessage("The Nebula of Ideas awaits! Share your brilliant projects and find collaborators. Click me to hide this tip.");
          break;
        default:
          setCurrentMessage("Exploring UniVerse? Click my icon if you need to toggle this message!");
      }
    }
  }, [pathname, initialMessage]);
  
  useEffect(() => {
    // If an initial message is provided, show it immediately.
    // Otherwise, the message is based on pathname.
    if (initialMessage) {
        setIsMessageVisible(true);
    }
  }, [initialMessage]);


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
