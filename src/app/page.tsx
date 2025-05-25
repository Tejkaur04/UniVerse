
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Telescope, Orbit } from 'lucide-react';
import AnimatedHeroText from '@/components/AnimatedHeroText';
import type { FC } from 'react';
import { motion } from 'framer-motion';

// For "UniVerse Command Center" - dashboard-style cards
interface CommandFeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: FC<React.ComponentProps<typeof ArrowRight>>; 
  cta: string;
  animationDelay?: string;
}

const commandCenterFeatures: CommandFeatureCardProps[] = [
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

const CommandCenterCard: FC<CommandFeatureCardProps> = ({ title, description, href, icon: Icon, cta, animationDelay }) => {
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


// For "What Awaits You" - full-width feature descriptions
interface FullFeatureInfo {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: FC<React.ComponentProps<typeof ArrowRight>>;
  iconColor: string;
  href: string;
}

const detailedFeatures: FullFeatureInfo[] = [
  {
    title: "Study Sphere: Find Your Constellation",
    shortDescription: "Navigate the academic cosmos to find study partners aligned with your courses and learning styles.",
    detailedDescription: "Create your detailed study profile, specify your courses, and set your preferred learning methods. Search and filter through peers to find compatible study buddies. Connect, form study groups, share resources, and coordinate sessions seamlessly.",
    icon: UsersRound,
    iconColor: "text-accent", 
    href: "/study-sphere",
  },
  {
    title: "Event Horizon: Discover New Worlds",
    shortDescription: "Explore a universe of campus happenings, from academic workshops to social gatherings.",
    detailedDescription: "Stay ahead with an interactive calendar of campus events, workshops, and seminars. Filter by interests like coding or arts, search for specific events, view details, RSVP, and even discover peer-organized study sessions.",
    icon: CalendarDays,
    iconColor: "text-primary",
    href: "/event-horizon",
  },
  {
    title: "Celestial Chats: Wisdom from the Stars",
    shortDescription: "Gain insights from experienced navigators – seniors, alumni, and our Stellar Assist AI.",
    detailedDescription: "Engage with our AI for quick guidance, view schedules for upcoming AMA sessions with seniors and alumni, submit questions, participate in live Q&As, and browse archives of past wisdom. Connect with mentors and explore diverse perspectives.",
    icon: MessageCircleQuestion,
    iconColor: "text-green-400", 
    href: "/celestial-chats",
  },
  {
    title: "Nebula of Ideas: Birth Your Innovations",
    shortDescription: "Launch your project ideas into the cosmos and find co-creators to bring them to life.",
    detailedDescription: "Share your innovative project concepts, outline your goals, and specify the skills you need. Tag your own expertise, browse projects shared by others, search by keywords or skills, express interest, and connect with potential teammates to collaborate.",
    icon: Lightbulb,
    iconColor: "text-sky-400", 
    href: "/nebula-of-ideas",
  },
];


export default function LandingAndDashboardPage() {
  return (
    <div className="w-full"> {/* Max-width is now handled by parent in layout.tsx */}
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center min-h-[calc(80vh-4rem)] flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="mb-6"
        >
          <Orbit className="h-24 w-24 text-primary animate-pulse" />
        </motion.div>
        <AnimatedHeroText
          text="Welcome to UniVerse"
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tight mb-6 
                     bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-text-shimmer"
        />
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 font-medium"
        >
          Your central hub for academic collaboration, event discovery, insightful guidance, and innovative project development. Navigate your university journey like never before!
        </motion.p>
        {/* CTA Button in Hero can link to an anchor or just be a visual cue */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2, type: "spring", stiffness: 100 }}
        >
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/80 px-8 py-6 text-lg group" asChild>
            <Link href="#command-center"> {/* Links to the Command Center section below */}
              Explore Your Universe <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* UniVerse Command Center (Dashboard Cards) Section */}
      <section id="command-center" className="py-16 md:py-24">
         <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <Orbit className="h-16 w-16 text-primary mx-auto animate-subtle-pulse" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold font-mono mb-3 text-center 
                     bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-text-shimmer"
        >
          UniVerse Command Center
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-lg text-foreground/70 max-w-xl mx-auto text-center mb-12"
        >
          Quickly navigate to the core modules of UniVerse. Each sphere is designed to enhance a different aspect of your student life.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-4xl mx-auto bg-card/40 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl border border-primary/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {commandCenterFeatures.map((feature) => (
              <CommandCenterCard key={feature.title} {...feature} />
            ))}
          </div>
        </motion.div>
      </section>


      {/* What Awaits You (Detailed Feature Explanations) Section */}
      <section className="py-16 md:py-24">
         <div className="text-center mb-16 md:mb-20">
          <Telescope className="h-16 w-16 text-primary mx-auto mb-4 hover:animate-none hover:scale-110 transition-transform animate-subtle-pulse" />
          <h2 
            className="text-3xl sm:text-4xl font-bold font-mono 
                       bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text animate-text-shimmer"
             style={{ animationDelay: '0.2s' }}
          >
            What Awaits You?
          </h2>
          <p className="mt-4 text-lg text-foreground/70 max-w-2xl mx-auto">
            Dive deeper into the core constellations of UniVerse and discover how they can illuminate your path.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {detailedFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.section
                key={feature.title}
                className={`w-3/4 mx-auto p-8 md:p-12 rounded-xl shadow-2xl flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 bg-card/60 backdrop-blur-md border border-primary/40`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex-shrink-0 text-center md:text-left">
                  <IconComponent className={`h-20 w-20 md:h-28 md:w-28 mb-4 md:mb-0 ${feature.iconColor} animate-subtle-pulse`} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className={`text-2xl md:text-3xl font-bold font-mono mb-3 ${feature.iconColor}`}>{feature.title}</h3>
                  <p className="text-md md:text-lg text-foreground/80 mb-4">{feature.shortDescription}</p>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">{feature.detailedDescription}</p>
                   <Button asChild variant="outline" className={`border-2 ${feature.iconColor.replace('text-', 'border-')} ${feature.iconColor} hover:bg-transparent hover:text-primary-foreground hover:!bg-${feature.iconColor.split('-')[1]}/80 group`}>
                    <Link href={feature.href}>
                      Explore {feature.title.split(':')[0]} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.section>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-32 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold font-mono mb-6 bg-gradient-to-r from-accent via-primary to-accent text-transparent bg-clip-text"
        >
          Ready to Navigate Your UniVerse?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-lg text-foreground/70 max-w-xl mx-auto mb-10"
        >
          Join a community of explorers, innovators, and scholars. Your journey of discovery starts now.
        </motion.p>
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground px-10 py-6 text-xl group" asChild>
            <Link href="/study-sphere"> 
              Begin Your Voyage <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
