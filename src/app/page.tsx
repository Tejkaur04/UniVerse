
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Orbit, Sparkles, Telescope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureInfo {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
  color: string;
  iconColor: string; // Added for full-width section icon
}


export default function LandingPage() {
  const features: FeatureInfo[] = [
    { 
      icon: UsersRound, 
      title: "Study Sphere", 
      description: "Connect with your perfect study partners and groups.", 
      details: "Navigate the academic cosmos by finding study buddies taking the same courses. Match study styles, share insights, and conquer challenging subjects together. Form your knowledge constellations and illuminate your path to success!",
      color: "text-chart-1",
      iconColor: "text-sky-400"
    },
    { 
      icon: CalendarDays, 
      title: "Event Horizon", 
      description: "Discover campus events, workshops, and seminars.", 
      details: "Stay ahead of the curve by exploring a universe of campus happenings. From academic workshops and career fairs to social gatherings and guest lectures, Event Horizon is your telescope to opportunities that enrich your university experience.",
      color: "text-chart-3",
      iconColor: "text-amber-400"
    },
    { 
      icon: MessageCircleQuestion, 
      title: "Celestial Chats", 
      description: "Gain wisdom from experienced seniors and alumni.", 
      details: "Tap into the collective wisdom of those who've navigated the university terrain before you. Ask your burning questions about courses, careers, or campus life, and receive guidance from a constellation of experienced seniors and alumni.",
      color: "text-chart-2",
      iconColor: "text-violet-400"
    },
    { 
      icon: Lightbulb, 
      title: "Nebula of Ideas", 
      description: "Launch project collaborations and find teammates.", 
      details: "Ignite innovation in this cosmic incubator for ideas. Share your groundbreaking project concepts, search for specific skills, and assemble a stellar team to bring your visions to life. The next big bang in campus innovation starts here!",
      color: "text-chart-4",
      iconColor: "text-emerald-400"
    },
  ];

  return (
    <div className="w-full flex-grow flex flex-col items-center text-center px-4 py-12 z-10 overflow-x-hidden"> {/* Added overflow-x-hidden */}
      {/* Hero Section */}
      <section className="w-full max-w-4xl mb-20 sm:mb-24 md:mb-32 relative">
        <Orbit className="h-20 w-20 sm:h-24 sm:w-24 text-primary mx-auto mb-6 animate-pulse" />
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent animate-fade-in-up"
          style={{ animationFillMode: 'forwards' }}
        >
          Welcome to UniVerse
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-foreground/90 font-medium mb-10 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Your all-in-one cosmic portal to navigate university life, connect with peers, discover events, and launch your brightest ideas.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 shadow-lg hover:shadow-accent/40 transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          <Link href="/dashboard">
            <Rocket className="mr-2 h-5 w-5" />
            Explore Your Universe
          </Link>
        </Button>
      </section>

      {/* Features Overview Section */}
      <section className="w-full max-w-7xl mb-20 sm:mb-24 md:mb-32">
        <h2 
          className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16 md:mb-20 text-primary flex items-center justify-center animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <Telescope className="mr-3 h-8 w-8 sm:h-10 sm:w-10 text-accent transition-transform duration-300 group-hover:rotate-[-5deg]" />
          What Awaits You?
        </h2>
        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => (
            <section 
              key={feature.title}
              className="w-full py-12 sm:py-16 md:py-20 bg-card/40 backdrop-blur-md border-y border-border/50 animate-fade-in-up rounded-xl shadow-2xl overflow-hidden" // Added overflow-hidden
              style={{ animationDelay: `${0.8 + index * 0.2}s`, animationFillMode: 'forwards' }}
            >
              <div className="container mx-auto px-6 sm:px-8">
                <div 
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-center gap-8 md:gap-12`}
                >
                  <div className="md:w-1/3 flex justify-center mb-6 md:mb-0 transform transition-transform duration-500 hover:scale-110">
                    <feature.icon className={`h-28 w-28 sm:h-36 sm:w-36 ${feature.iconColor} drop-shadow-[0_0_15px_var(--tw-shadow-color)]`} style={{'--tw-shadow-color': `hsl(var(--${feature.color.replace('text-','')}))`} as React.CSSProperties} />
                  </div>
                  <div className="md:w-2/3 text-center md:text-left">
                    <h3 className={`text-3xl sm:text-4xl font-bold ${feature.color} mb-4`}>{feature.title}</h3>
                    <p className="text-lg sm:text-xl text-foreground/85 mb-3 leading-relaxed">{feature.description}</p>
                    <p className="text-md sm:text-lg text-foreground/70 leading-relaxed">{feature.details}</p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section 
        className="w-full max-w-2xl animate-fade-in-up"
        style={{ animationDelay: `${0.8 + features.length * 0.2 + 0.2}s`, animationFillMode: 'forwards' }}
      >
         <p className="text-md sm:text-lg text-foreground/80 mb-6">
          Ready to embark on your stellar university adventure?
        </p>
        <Button asChild size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link href="/dashboard">
            Enter UniVerse Dashboard
            <Sparkles className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
