'use server';

import { provideContextualCopilotInsightsAction } from '@/actions/ai-flows';
import { z } from 'zod';

/**
 * Input schema for contextual copilot insights
 */
export const ProvideContextualCopilotInsightsInputSchema = z.object({
  conversationHistory: z
    .string()
    .min(1)
    .describe('The recent conversation history with the customer.'),
  currentPhase: z
    .string()
    .min(1)
    .describe('The current phase of the sales process (e.g., discovery, pitch, negotiation).'),
  customerMood: z
    .string()
    .min(1)
    .describe('Assessment of the customer\'s mood and engagement level.'),
  nextAction: z
    .string()
    .min(1)
    .describe('The intended next action in the sales flow.'),
});

export type ProvideContextualCopilotInsightsInput = z.infer<
  typeof ProvideContextualCopilotInsightsInputSchema
>;

/**
 * Output schema for contextual copilot insights
 */
export const ProvideContextualCopilotInsightsOutputSchema = z.object({
  insights: z.array(z.string()),
  recommendations: z.array(
    z.object({
      priority: z.enum(['high', 'medium', 'low']),
      action: z.string(),
      reasoning: z.string(),
    })
  ),
  suggestedMessage: z.string().optional(),
});

export type ProvideContextualCopilotInsightsOutput = z.infer<
  typeof ProvideContextualCopilotInsightsOutputSchema
>;

/**
 * Provides real-time, context-aware insights and recommendations to sales advisors
 * based on the current customer interaction and sales phase.
 *
 * @param input - Conversation context, current phase, and customer mood
 * @returns Actionable insights and recommendations
 */
export async function provideContextualCopilotInsights(
  input: ProvideContextualCopilotInsightsInput
): Promise<ProvideContextualCopilotInsightsOutput> {
  // Validate input
  const validatedInput = ProvideContextualCopilotInsightsInputSchema.parse(input);

  // Call the server action
  const result = await provideContextualCopilotInsightsAction(validatedInput);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to provide contextual copilot insights');
  }

  return result.data;
}
