
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Orbit, Home } from 'lucide-react';
import type { FC } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: FC<React.ComponentProps<typeof ArrowRight>>; // Lucide icons are FCs
  animationDelay?: string;
}

const commandCenterFeatures: FeatureCardProps[] = [
  {
    title: "Study Sphere",
    description: "Connect with study buddies, form groups, and share resources.",
    href: "/study-sphere",
    icon: UsersRound,
    cta: "Enter Sphere",
    animationDelay: "0.1s",
  },
  {
    title: "Event Horizon",
    description: "Discover campus events, workshops, and seminars.",
    href: "/event-horizon",
    icon: CalendarDays,
    cta: "Explore Events",
    animationDelay: "0.2s",
  },
  {
    title: "Celestial Chats",
    description: "Gain wisdom from AI, seniors, and alumni mentors.",
    href: "/celestial-chats",
    icon: MessageCircleQuestion,
    cta: "Join Chats",
    animationDelay: "0.3s",
  },
  {
    title: "Nebula of Ideas",
    description: "Launch projects and find collaborators for your innovations.",
    href: "/nebula-of-ideas",
    icon: Lightbulb,
    cta: "Ignite Ideas",
    animationDelay: "0.4s",
  },
];

const FeatureCard: FC<FeatureCardProps & { cta: string }> = ({ title, description, href, icon: Icon, cta, animationDelay }) => {
  return (
    <Card 
      className="bg-card/80 backdrop-blur-md shadow-lg border-primary/30 hover:shadow-accent/50 hover:scale-[1.02] hover:border-accent/80 hover:shadow-2xl transition-all duration-300 flex flex-col animate-fade-in-up"
      style={{ animationDelay }}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-8 w-8 text-accent animate-subtle-pulse" />
          <CardTitle className="text-2xl font-mono text-primary">{title}</CardTitle>
        </div>
        <CardDescription className="text-foreground/80 h-16">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button asChild className="w-full bg-primary hover:bg-accent hover:text-accent-foreground transition-colors group">
          <Link href={href}>
            {cta} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <div className="mb-8 text-center">
         <Button asChild variant="outline" className="mb-10 bg-card hover:bg-accent hover:text-accent-foreground border-primary/30 hover:border-accent">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to UniVerse Home
            </Link>
          </Button>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4"
        >
          <Orbit className="h-16 w-16 text-primary mx-auto animate-subtle-pulse" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold font-mono mb-3 
                     bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-text-shimmer"
        >
          UniVerse Command Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-lg text-foreground/70 max-w-xl mx-auto"
        >
          Quickly navigate to the core modules of UniVerse. Each sphere is designed to enhance a different aspect of your student life.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-4xl mx-auto bg-card/40 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl border border-primary/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {commandCenterFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

    