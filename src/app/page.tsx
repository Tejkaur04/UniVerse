
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, UsersRound, CalendarDays, MessageCircleQuestion, Lightbulb, Orbit, Sparkles, Telescope } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: UsersRound, title: "Study Sphere", description: "Find study partners & groups.", color: "text-chart-1" },
    { icon: CalendarDays, title: "Event Horizon", description: "Explore campus events.", color: "text-chart-3" }, // orange
    { icon: MessageCircleQuestion, title: "Celestial Chats", description: "Get alumni guidance.", color: "text-chart-2" }, // green
    { icon: Lightbulb, title: "Nebula of Ideas", description: "Launch project collaborations.", color: "text-chart-4" }, // purple
  ];

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center text-center px-4 py-12 z-10 overflow-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mb-20 sm:mb-24 md:mb-32 relative">
        <Orbit className="h-20 w-20 sm:h-24 sm:w-24 text-primary mx-auto mb-6 animate-pulse" />
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
          Welcome to UniVerse
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Your all-in-one cosmic portal to navigate university life, connect with peers, discover events, and launch your brightest ideas.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 shadow-lg hover:shadow-accent/40 transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link href="/dashboard">
            <Rocket className="mr-2 h-5 w-5" />
            Explore Your Universe
          </Link>
        </Button>
      </section>

      {/* Features Overview Section */}
      <section className="w-full max-w-6xl mb-20 sm:mb-24 md:mb-32">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-primary flex items-center justify-center">
          <Telescope className="mr-3 h-8 w-8 sm:h-10 sm:w-10 text-accent" />
          What Awaits You?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="bg-card/60 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-primary/25 transition-all duration-300 ease-in-out hover:scale-105 group flex flex-col"
            >
              <CardHeader className="items-center pt-6 pb-3">
                <div className="p-3 bg-card rounded-full mb-3 group-hover:animate-bounce">
                  <feature.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground group-hover:text-accent transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6 px-4 flex-grow">
                <CardDescription className="text-sm text-muted-foreground min-h-[2.5em]">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="w-full max-w-2xl">
         <p className="text-md sm:text-lg text-muted-foreground mb-6">
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
