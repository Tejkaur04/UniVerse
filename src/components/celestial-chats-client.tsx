// This file uses server-side code.
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, MessageCircleQuestion, SendHorizonal, Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { answerStudentQuestions, type AnswerStudentQuestionsOutput } from '@/ai/flows/answer-student-questions';
import { Separator } from './ui/separator';

const formSchema = z.object({
  question: z.string().min(10, { message: "Question must be at least 10 characters long." }).max(500, { message: "Question must be at most 500 characters long." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CelestialChatsClient() {
  const [answer, setAnswer] = useState<AnswerStudentQuestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const result = await answerStudentQuestions({ question: data.question });
      setAnswer(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred while fetching your answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl bg-card/80 backdrop-blur-sm border-border/60">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-2">
          <Sparkles className="h-10 w-10 text-accent mr-2" />
          <Compass className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className="text-3xl font-bold text-primary">Stellar Guidance</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Pose your questions to the cosmos and receive wisdom from university seniors and alumni to navigate your academic journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Your Cosmic Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What are some good ways to prepare for final exams in astrophysics?"
                      className="min-h-[100px] resize-none text-base bg-background/70"
                      {...field}
                      aria-label="Your Question"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-base py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gathering Starlight...
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2 h-5 w-5" />
                  Seek Counsel
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {error && (
        <>
        <Separator className="my-4 bg-border/50"/>
        <CardFooter className="flex flex-col items-start">
            <Alert variant="destructive" className="w-full bg-destructive/80 text-destructive-foreground">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Oops! Stardust in the System</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardFooter>
        </>
      )}

      {answer && (
        <>
        <Separator className="my-4 bg-border/50"/>
        <CardFooter className="flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-2 text-primary">Wisdom from the Cosmos:</h3>
            <Card className="w-full bg-background/60 p-4 rounded-md border-border/70">
                <p className="text-foreground whitespace-pre-wrap text-base">{answer.answer}</p>
            </Card>
        </CardFooter>
        </>
      )}
    </Card>
  );
}
