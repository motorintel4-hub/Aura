'use server';

import { summarizeCustomerNotesAction } from '@/actions/ai-flows';
import { z } from 'zod';

/**
 * Input schema for customer notes summarization
 */
export const SummarizeCustomerNotesInputSchema = z.object({
  notes: z
    .string()
    .min(1)
    .describe('The customer notes and interaction history to summarize.'),
  customerName: z
    .string()
    .min(1)
    .describe('The name of the customer.'),
  visitDate: z
    .string()
    .min(1)
    .describe('The date of the customer visit or interaction.'),
});

export type SummarizeCustomerNotesInput = z.infer<typeof SummarizeCustomerNotesInputSchema>;

/**
 * Output schema for customer notes summarization
 */
export const SummarizeCustomerNotesOutputSchema = z.object({
  summary: z.string(),
  keyNeeds: z.array(z.string()),
  objections: z.array(z.string()),
  nextSteps: z.array(z.string()),
  followUpDeadline: z.string(),
});

export type SummarizeCustomerNotesOutput = z.infer<typeof SummarizeCustomerNotesOutputSchema>;

/**
 * Summarizes customer notes and interaction history into structured insights
 * including key needs, objections, and recommended next steps.
 *
 * @param input - Customer notes and context
 * @returns Structured summary with actionable next steps
 */
export async function summarizeCustomerNotes(
  input: SummarizeCustomerNotesInput
): Promise<SummarizeCustomerNotesOutput> {
  // Validate input
  const validatedInput = SummarizeCustomerNotesInputSchema.parse(input);

  // Call the server action
  const result = await summarizeCustomerNotesAction(validatedInput);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to summarize customer notes');
  }

  return result.data;
}
