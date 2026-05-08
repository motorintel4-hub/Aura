'use server';

import { generateBuyerPersonaBriefingAction } from '@/actions/ai-flows';
import { z } from 'zod';

/**
 * Input schema for buyer persona generation
 * Validates the 6P customer discovery data
 */
export const GenerateBuyerPersonaBriefingInputSchema = z.object({
  p1Purpose: z.string().min(1).describe('Customer\'s purpose for buying a vehicle.'),
  p2People: z.string().min(1).describe('Information about the people influencing the purchase decision.'),
  p3Pattern: z.string().min(1).describe('Customer\'s usage patterns and driving habits.'),
  p4Preferences: z.string().min(1).describe('Customer\'s specific vehicle preferences.'),
  p5Price: z.string().min(1).describe('Customer\'s budget and financing considerations.'),
  p6PurchaseContext: z.string().min(1).describe('Context surrounding the purchase (urgency, trade-in, etc.).'),
});

export type GenerateBuyerPersonaBriefingInput = z.infer<typeof GenerateBuyerPersonaBriefingInputSchema>;

/**
 * Output schema for buyer persona generation
 */
export const GenerateBuyerPersonaBriefingOutputSchema = z.object({
  personaLabel: z.string(),
  advisorBriefing: z.object({
    leadWith: z.string(),
    highlight: z.string(),
    mention: z.string(),
    avoid: z.string(),
  }),
  vehicleRecommendations: z.array(
    z.object({
      modelName: z.string(),
      matchPercentage: z.number().min(0).max(100),
      description: z.string(),
      featureTags: z.array(z.string()),
    })
  ).min(1),
});

export type GenerateBuyerPersonaBriefingOutput = z.infer<typeof GenerateBuyerPersonaBriefingOutputSchema>;

/**
 * Generates a buyer persona, advisor briefing, and vehicle recommendations
 * based on the 6P customer discovery framework.
 *
 * @param input - Customer 6P discovery data
 * @returns Buyer persona, briefing, and ranked vehicle recommendations
 */
export async function generateBuyerPersonaBriefing(
  input: GenerateBuyerPersonaBriefingInput
): Promise<GenerateBuyerPersonaBriefingOutput> {
  // Validate input
  const validatedInput = GenerateBuyerPersonaBriefingInputSchema.parse(input);

  // Call the server action
  const result = await generateBuyerPersonaBriefingAction(validatedInput);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to generate buyer persona briefing');
  }

  return result.data;
}
