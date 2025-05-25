
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket } from 'lucide-react'; // Changed icon to Rocket

export default function NebulaOfIdeasPage() {
  return (
    <div className="container mx-auto px-4 py-12 w-full max-w-4xl text-center">
      <Button asChild variant="outline" className="mb-10 bg-card hover:bg-accent hover:text-accent-foreground">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Rocket className="h-24 w-24 text-primary mx-auto mb-8 animate-bounce" />
      <h1 className="text-5xl font-bold text-primary mb-6">Nebula of Ideas - Igniting Innovation!</h1>
      <p className="text-xl text-muted-foreground mb-4">
        Prepare to launch your groundbreaking projects and discover your dream team of co-creators!
      </p>
      <div className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto space-y-3 text-left">
        <p>
          The Nebula of Ideas is currently forming and will soon be a vibrant cosmic hub where innovation takes flight. Here’s what you’ll be able to do:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-foreground/70">
          <li><strong>Share your project sparks:</strong> Describe your brilliant concepts, outline your project goals, and specify the skills you're seeking in collaborators.</li>
          <li><strong>Showcase your unique talents:</strong> Tag your skills (e.g., "Quantum Programming," "Alien Linguistics," "Spaceship Design," "UX/UI for Holodecks") so others can find you for their ventures.</li>
          <li><strong>Explore a galaxy of existing ideas:</strong> Browse through projects launched by other UniVerse explorers.</li>
          <li><strong>Navigate by keywords or skill constellations:</strong> Easily find projects that align with your passions or the expertise you offer.</li>
          <li><strong>Access project blueprints:</strong> Get detailed information about a project's description, objectives, and the types of collaborators needed.</li>
          <li><strong>Signal your interest to join missions:</strong> Express your desire to contribute to a project and connect with its initiator.</li>
          <li><strong>Assemble your star-fleet:</strong> View profiles of students who have initiated or shown interest in projects, and connect with those whose skills complement your own.</li>
          <li><strong>Collaborate in your project's command center (Future Feature):</strong> Utilize built-in tools for team communication, task management, and progress tracking.</li>
          <li><strong>Display your cosmic achievements (Future Feature):</strong> UniVerse may feature a gallery to showcase successfully completed projects, inspiring others!</li>
        </ul>
        <p className="pt-3 text-center">
          We're meticulously charting the stars for this collaborative space. Get your innovative thoughts ready for ignition!
        </p>
      </div>
      <p className="text-md text-accent font-semibold">Get your ideas ready for launch!</p>
    </div>
  );
}
