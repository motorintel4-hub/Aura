'use server';

import { generateObjectionStrategyAction } from '@/actions/ai-flows';
import { z } from 'zod';

/**
 * Input schema for objection strategy generation
 */
export const GenerateObjectionStrategyInputSchema = z.object({
  objectionCategory: z
    .string()
    .min(1)
    .describe('The category of the customer objection (e.g., "Price Too High", "Competitor Better").'),
  customerContext: z
    .string()
    .min(1)
    .describe('A summary of the customer context, including their buyer persona and preferences.'),
  vehicleModel: z
    .string()
    .min(1)
    .describe('The specific vehicle model the customer is interested in.'),
  vehicleData: z
    .string()
    .min(1)
    .describe('Key data about the vehicle, such as price, features, and competitive advantages.'),
});

export type GenerateObjectionStrategyInput = z.infer<typeof GenerateObjectionStrategyInputSchema>;

/**
 * Output schema for objection strategy generation
 */
export const GenerateObjectionStrategyOutputSchema = z.object({
  strategyName: z.string(),
  steps: z
    .array(
      z.object({
        tactic: z.string(),
        scriptLine: z.string(),
      })
    )
    .length(2),
});

export type GenerateObjectionStrategyOutput = z.infer<typeof GenerateObjectionStrategyOutputSchema>;

/**
 * Generates a two-step objection handling strategy with script lines
 * tailored to the customer context and vehicle.
 *
 * @param input - Objection details and customer context
 * @returns Strategy name and two-step handling approach
 */
export async function generateObjectionStrategy(
  input: GenerateObjectionStrategyInput
): Promise<GenerateObjectionStrategyOutput> {
  // Validate input
  const validatedInput = GenerateObjectionStrategyInputSchema.parse(input);

  // Call the server action
  const result = await generateObjectionStrategyAction(validatedInput);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to generate objection handling strategy');
  }

  return result.data;
}
