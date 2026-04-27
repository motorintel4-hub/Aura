'use server';
/**
 * @fileOverview A Genkit flow for generating sales pitch levels (functional, emotional, aspirational)
 *               tailored to a customer's persona for a specific vehicle model.
 *
 * - generateSalesPitchLevels - A function that generates sales pitch levels.
 * - GenerateSalesPitchLevelsInput - The input type for the generateSalesPitchLevels function.
 * - GenerateSalesPitchLevelsOutput - The return type for the generateSalesPitchLevels function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSalesPitchLevelsInputSchema = z.object({
  vehicleModel: z.string().describe('The name of the vehicle model (one of the four agreed models).'),
  customerPersona: z.string().describe('A detailed description of the customer persona, including their needs, priorities, and lifestyle.'),
});
export type GenerateSalesPitchLevelsInput = z.infer<typeof GenerateSalesPitchLevelsInputSchema>;

const GenerateSalesPitchLevelsOutputSchema = z.object({
  functionalPitch: z.string().describe('A pitch level focused on the hardware, specifications, and practical features of the vehicle.'),
  emotionalPitch: z.string().describe('A pitch level focused on emotional benefits like family safety, pride of ownership, and driving experience.'),
  aspirationalPitch: z.string().describe('A pitch level positioning the vehicle as a lifestyle statement, enhancing social status and personal brand.'),
});
export type GenerateSalesPitchLevelsOutput = z.infer<typeof GenerateSalesPitchLevelsOutputSchema>;

const generateSalesPitchLevelsPrompt = ai.definePrompt({
  name: 'generateSalesPitchLevelsPrompt',
  input: { schema: GenerateSalesPitchLevelsInputSchema },
  output: { schema: GenerateSalesPitchLevelsOutputSchema },
  prompt: `You are an expert automotive sales advisor. Your task is to generate three distinct sales pitch levels for the "{{vehicleModel}}" vehicle model, tailored specifically to the customer persona provided.

The pitch levels should be:
1.  **Functional Pitch**: Focus on the hardware, specifications, and practical features of the vehicle.
2.  **Emotional Pitch**: Focus on emotional benefits, such as family safety, pride of ownership, and the overall driving experience.
3.  **Aspirational Pitch**: Position the vehicle as a lifestyle statement, enhancing social status, personal brand, or achieving life goals.

Ensure all pitches are persuasive and align with the customer's needs and preferences based on their persona.

Vehicle Model: {{vehicleModel}}

Customer Persona: {{{customerPersona}}}

Generate the three pitch levels in the specified JSON format.`,
});

const generateSalesPitchLevelsFlow = ai.defineFlow(
  {
    name: 'generateSalesPitchLevelsFlow',
    inputSchema: GenerateSalesPitchLevelsInputSchema,
    outputSchema: GenerateSalesPitchLevelsOutputSchema,
  },
  async (input) => {
    const { output } = await generateSalesPitchLevelsPrompt(input);
    return output!;
  }
);

export async function generateSalesPitchLevels(input: GenerateSalesPitchLevelsInput): Promise<GenerateSalesPitchLevelsOutput> {
  return generateSalesPitchLevelsFlow(input);
}
