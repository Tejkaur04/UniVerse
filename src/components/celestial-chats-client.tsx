"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles, AlertTriangle, MessageCircleQuestion, SendHorizonal } from 'lucide-react';

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
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-2">
          <Sparkles className="h-10 w-10 text-accent mr-2" />
          <MessageCircleQuestion className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className="text-3xl font-bold">Celestial Chats</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Ask anything about university life, courses, or career paths!
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
                  <FormLabel className="text-base">Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What are some good ways to prepare for final exams?"
                      className="min-h-[100px] resize-none text-base"
                      {...field}
                      aria-label="Your Question"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-base py-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Asking the Stars...
                </>
              ) : (
                <>
                  <SendHorizonal className="mr-2 h-5 w-5" />
                  Ask Question
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {error && (
        <>
        <Separator className="my-4"/>
        <CardFooter className="flex flex-col items-start">
            <Alert variant="destructive" className="w-full">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Oops! Stardust in the System</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        </CardFooter>
        </>
      )}

      {answer && (
        <>
        <Separator className="my-4"/>
        <CardFooter className="flex flex-col items-start">
            <h3 className="text-xl font-semibold mb-2 text-primary">Wisdom from the Cosmos:</h3>
            <Card className="w-full bg-background/50 p-4 rounded-md border">
                <p className="text-foreground whitespace-pre-wrap text-base">{answer.answer}</p>
            </Card>
        </CardFooter>
        </>
      )}
    </Card>
  );
}
