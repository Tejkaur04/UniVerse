import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  children: React.ReactNode;
}

const FeatureCard = ({ title, description, icon: Icon, href, children }: FeatureCardProps) => (
  <Link href={href} className="block group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
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
      details: "Forge alliances, share knowledge, and conquer courses together. Stellar study groups await discovery!"
    },
    {
      title: "Event Horizon",
      description: "Discover exciting campus events, workshops, and seminars on your horizon.",
      icon: CalendarDays,
      href: "/event-horizon",
      details: "Stay informed about academic gatherings, social mixers, and skill-building opportunities unfolding across the university."
    },
    {
      title: "Celestial Chats",
      description: "Gain wisdom from experienced navigators – university seniors and alumni.",
      icon: MessageCircleQuestion,
      href: "/celestial-chats",
      details: "Ask your burning questions, seek guidance on your academic path, and learn from those who've journeyed before you."
    },
    {
      title: "Nebula of Ideas",
      description: "Launch your innovative projects and find co-creators in this cosmic hub.",
      icon: Lightbulb,
      href: "/nebula-of-ideas",
      details: "A vibrant space for brilliant minds to spark collaborations, nurture innovations, and bring groundbreaking ideas to life."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 tracking-tight">
          Welcome to UniVerse
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your cosmic command center for navigating the university journey. Explore the stars of opportunity below!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            href={feature.href}
          >
            <p className="text-sm text-foreground/80">{feature.details}</p>
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}
