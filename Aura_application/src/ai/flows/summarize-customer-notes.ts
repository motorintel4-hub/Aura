'use server';
/**
 * @fileOverview An AI agent that summarizes customer notes.
 *
 * - summarizeCustomerNotes - A function that handles the customer notes summarization process.
 * - SummarizeCustomerNotesInput - The input type for the summarizeCustomerNotes function.
 * - SummarizeCustomerNotesOutput - The return type for the summarizeCustomerNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeCustomerNotesInputSchema = z.object({
  notes: z.array(
    z.object({
      bodyText: z.string().describe('The main content of the customer note.'),
      author: z.string().optional().describe('The author of the note.'),
      date: z.string().optional().describe('The date the note was created (e.g., "YYYY-MM-DD HH:MM:SS").'),
      noteType: z.string().optional().describe('The type of note (e.g., "Meeting", "Phone Call", "Email").'),
    })
  ).describe('A list of customer interaction notes to be summarized.'),
});
export type SummarizeCustomerNotesInput = z.infer<typeof SummarizeCustomerNotesInputSchema>;

const SummarizeCustomerNotesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the customer notes, highlighting important themes and key takeaways.'),
});
export type SummarizeCustomerNotesOutput = z.infer<typeof SummarizeCustomerNotesOutputSchema>;

export async function summarizeCustomerNotes(input: SummarizeCustomerNotesInput): Promise<SummarizeCustomerNotesOutput> {
  return summarizeCustomerNotesFlow(input);
}

const summarizeCustomerNotesPrompt = ai.definePrompt({
  name: 'summarizeCustomerNotesPrompt',
  input: { schema: SummarizeCustomerNotesInputSchema },
  output: { schema: SummarizeCustomerNotesOutputSchema },
  prompt: `You are an AI assistant specializing in summarizing customer interaction notes.
Your task is to review the provided customer notes and generate a concise summary that highlights the most important themes and key takeaways from recent interactions.
Focus on extracting critical details, customer history, preferences, and any recurring patterns.

Customer Notes:
{{#each notes}}
{{#if date}}Date: {{{date}}}
{{/if}}{{#if author}}Author: {{{author}}}
{{/if}}{{#if noteType}}Type: {{{noteType}}}
{{/if}}Content: {{{bodyText}}}

---
{{/each}}

Please provide a summary that is easy for an advisor to quickly review.`,
});

const summarizeCustomerNotesFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerNotesFlow',
    inputSchema: SummarizeCustomerNotesInputSchema,
    outputSchema: SummarizeCustomerNotesOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeCustomerNotesPrompt(input);
    return output!;
  }
);
