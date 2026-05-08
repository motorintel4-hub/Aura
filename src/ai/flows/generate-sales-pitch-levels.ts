'use server';

import { generateSalesPitchLevelsAction } from '@/actions/ai-flows';
import { z } from 'zod';

/**
 * Input schema for sales pitch levels generation
 */
export const GenerateSalesPitchLevelsInputSchema = z.object({
  customerProfile: z
    .string()
    .min(1)
    .describe('A detailed description of the customer persona and profile.'),
  vehicleModel: z
    .string()
    .min(1)
    .describe('The name of the vehicle model.'),
  keyFeatures: z
    .string()
    .min(1)
    .describe('Key features of the vehicle to emphasize.'),
  pricePoint: z
    .string()
    .min(1)
    .describe('The price point and financing information.'),
});

export type GenerateSalesPitchLevelsInput = z.infer<typeof GenerateSalesPitchLevelsInputSchema>;

/**
 * Output schema for sales pitch levels generation
 */
export const GenerateSalesPitchLevelsOutputSchema = z.object({
  pitchLevels: z.array(
    z.object({
      level: z.enum(['introductory', 'detailed', 'closing']),
      duration: z.string(),
      content: z.string(),
      focusPoints: z.array(z.string()),
    })
  ),
});

export type GenerateSalesPitchLevelsOutput = z.infer<typeof GenerateSalesPitchLevelsOutputSchema>;

/**
 * Generates three levels of sales pitches (introductory, detailed, closing)
 * tailored to the customer profile and vehicle.
 *
 * @param input - Customer profile, vehicle details, and pricing information
 * @returns Three-level pitch progression
 */
export async function generateSalesPitchLevels(
  input: GenerateSalesPitchLevelsInput
): Promise<GenerateSalesPitchLevelsOutput> {
  // Validate input
  const validatedInput = GenerateSalesPitchLevelsInputSchema.parse(input);

  // Call the server action
  const result = await generateSalesPitchLevelsAction(validatedInput);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to generate sales pitch levels');
  }

  return result.data;
}
