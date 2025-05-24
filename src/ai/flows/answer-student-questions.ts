// This file uses server-side code.
'use server';

/**
 * @fileOverview Provides answers to student questions about university life, courses, and career paths, leveraging experiences of senior students and alumni.
 *
 * - answerStudentQuestions - A function that processes student questions and provides answers.
 * - AnswerStudentQuestionsInput - The input type for the answerStudentQuestions function.
 * - AnswerStudentQuestionsOutput - The return type for the answerStudentQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerStudentQuestionsInputSchema = z.object({
  question: z.string().describe('The question from the student.'),
});
export type AnswerStudentQuestionsInput = z.infer<typeof AnswerStudentQuestionsInputSchema>;

const AnswerStudentQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the student question.'),
});
export type AnswerStudentQuestionsOutput = z.infer<typeof AnswerStudentQuestionsOutputSchema>;

export async function answerStudentQuestions(input: AnswerStudentQuestionsInput): Promise<AnswerStudentQuestionsOutput> {
  return answerStudentQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerStudentQuestionsPrompt',
  input: {schema: AnswerStudentQuestionsInputSchema},
  output: {schema: AnswerStudentQuestionsOutputSchema},
  prompt: `You are a helpful university advisor, drawing on the experiences of senior students and alumni to answer questions.

  Question: {{{question}}}

  Answer: `,
});

const answerStudentQuestionsFlow = ai.defineFlow(
  {
    name: 'answerStudentQuestionsFlow',
    inputSchema: AnswerStudentQuestionsInputSchema,
    outputSchema: AnswerStudentQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
