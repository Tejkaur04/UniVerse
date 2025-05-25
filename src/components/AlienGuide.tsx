
"use client";

import { Bot, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface AlienGuideProps {
  message?: string; // Made message prop optional
  className?: string;
}

const DEFAULT_MESSAGE = "Welcome to UniVerse! Explore the features using the icons in the header or scroll down to learn more. I'm here to help you navigate!";

const AlienGuide: React.FC<AlienGuideProps> = ({ message = DEFAULT_MESSAGE, className }) => {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 flex items-end space-x-3 ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
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
      <Bot className="h-16 w-16 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))] animate-bounce" />
    </motion.div>
  );
};

export default AlienGuide;
