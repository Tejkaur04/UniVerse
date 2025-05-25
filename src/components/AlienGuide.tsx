
"use client";

import { useState } from 'react';
import { Bot, MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AlienGuideProps {
  message?: string;
  className?: string;
}

const DEFAULT_MESSAGE = "Welcome to UniVerse! Explore the features using the icons in the header or scroll down to learn more. I'm here to help you navigate!";

const AlienGuide: React.FC<AlienGuideProps> = ({ message = DEFAULT_MESSAGE, className }) => {
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  const toggleMessageVisibility = () => {
    setIsMessageVisible(prev => !prev);
  };

  return (
    <motion.div
      className={cn("fixed bottom-6 right-6 z-50 flex items-end space-x-3", className)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <AnimatePresence>
        {isMessageVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="origin-bottom-right"
          >
            <Card className="max-w-xs bg-card/90 backdrop-blur-md border-primary/50 shadow-2xl p-0 overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center text-xs font-medium text-primary mb-1.5">
                  <MessageSquareText className="h-4 w-4 mr-1.5 text-accent" />
                  UniVerse Guide
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onClick={toggleMessageVisibility}
        className="p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full flex items-center justify-center"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleMessageVisibility(); }}
        aria-label={isMessageVisible ? "Hide guide message" : "Show guide message"}
        title={isMessageVisible ? "Hide guide message" : "Show guide message"}
      >
        <Bot className="h-16 w-16 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))] animate-bounce" />
      </div>
    </motion.div>
  );
};

export default AlienGuide;
