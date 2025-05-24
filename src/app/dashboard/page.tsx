
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  children?: React.ReactNode; 
  animationDelay?: string;
}

const FeatureCard = ({ title, description, icon: Icon, href, children, animationDelay }: FeatureCardProps) => (
  <Link 
    href={href} 
    className={cn(
      "block group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background animate-fade-in-up"
    )}
    style={{ animationDelay, animationFillMode: 'forwards' }}
  >
    <Card className="bg-card/70 backdrop-blur-sm border-border/60 shadow-xl hover:shadow-primary/30 hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden">
      <CardHeader className="items-center text-center pt-8">
        <Icon className="h-16 w-16 text-accent mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]" />
        <CardTitle className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center pb-8 px-6">
        <CardDescription className="text-muted-foreground mb-4 text-base min-h-[3em]">{description}</CardDescription>
        {children}
      </CardContent>
    </Card>
  </Link>
);

export default function DashboardPage() {
  const features = [
    {
      title: "Study Sphere",
      description: "Find your ideal study constellations and connect with fellow learners.",
      icon: UsersRound,
      href: "/study-sphere",
    },
    {
      title: "Event Horizon",
      description: "Discover exciting campus events, workshops, and seminars on your horizon.",
      icon: CalendarDays,
      href: "/event-horizon",
    },
    {
      title: "Celestial Chats",
      description: "Gain wisdom from experienced navigators – university seniors and alumni.",
      icon: MessageCircleQuestion,
      href: "/celestial-chats",
    },
    {
      title: "Nebula of Ideas",
      description: "Launch your innovative projects and find co-creators in this cosmic hub.",
      icon: Lightbulb,
      href: "/nebula-of-ideas",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <div className="text-center mb-16">
        <h1 
          className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight animate-fade-in-up"
          style={{ animationFillMode: 'forwards' }}
        >
          Welcome to UniVerse Dashboard
        </h1>
        <p 
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Your cosmic command center for navigating the university journey. Explore the stars of opportunity below!
        </p>
      </div>

      <div className="max-w-4xl mx-auto"> {/* Constraining wrapper for the grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              animationDelay={`${0.4 + index * 0.15}s`}
            >
              {/* No detailed paragraph here for a cleaner dashboard card */}
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}
