'use server';
/**
 * @fileOverview A Genkit flow for generating a two-step objection handling strategy
 *               with script lines tailored to customer context and vehicle model.
 *
 * - generateObjectionStrategy - A function that handles the generation of the objection strategy.
 * - GenerateObjectionStrategyInput - The input type for the generateObjectionStrategy function.
 * - GenerateObjectionStrategyOutput - The return type for the generateObjectionStrategy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateObjectionStrategyInputSchema = z.object({
  objectionCategory: z
    .string()
    .describe(
      'The category of the customer objection (e.g., "Price Too High", "Competitor Better", "Waiting Period", "Mileage Concern", "Custom").'
    ),
  customerContext: z
    .string()
    .describe(
      'A summary of the customer context, including their buyer persona, preferences, and priorities.'
    ),
  vehicleModel: z
    .string()
    .describe(
      'The specific vehicle model the customer is interested in, from the four agreed models.'
    ),
  vehicleData: z
    .string()
    .describe(
      'Key data about the vehicle, such as price, features, and competitive advantages.'
    ),
});
export type GenerateObjectionStrategyInput = z.infer<
  typeof GenerateObjectionStrategyInputSchema
>;

const GenerateObjectionStrategyOutputSchema = z.object({
  strategyName: z
    .string()
    .describe('A concise name for the objection handling strategy.'),
  steps: z
    .array(
      z.object({
        tactic: z.string().describe('A short, actionable tactic for this step.'),
        scriptLine: z
          .string()
          .describe('A script line for the advisor to use.'),
      })
    )
    .length(2)
    .describe(
      'A two-step strategy to handle the objection, each with a tactic and a script line.'
    ),
});
export type GenerateObjectionStrategyOutput = z.infer<
  typeof GenerateObjectionStrategyOutputSchema
>;

export async function generateObjectionStrategy(
  input: GenerateObjectionStrategyInput
): Promise<GenerateObjectionStrategyOutput> {
  return generateObjectionStrategyFlow(input);
}

const generateObjectionStrategyPrompt = ai.definePrompt({
  name: 'generateObjectionStrategyPrompt',
  input: { schema: GenerateObjectionStrategyInputSchema },
  output: { schema: GenerateObjectionStrategyOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI Co-Pilot named AURA AI, designed to assist automotive sales advisors.
Your goal is to provide a real-time, two-step strategy with script lines to handle a customer objection.
The strategy must be tailored to the specific customer, their context, and the vehicle they are interested in.

Customer Objection Category: {{{objectionCategory}}}
Customer Context: {{{customerContext}}}
Vehicle Model: {{{vehicleModel}}}
Vehicle Data: {{{vehicleData}}}

Based on the above information, generate a two-step strategy. Each step should include a tactic and a script line.
The script lines should be professional, empathetic, and aimed at addressing the customer's concern while highlighting the vehicle's value.`,
});

const generateObjectionStrategyFlow = ai.defineFlow(
  {
    name: 'generateObjectionStrategyFlow',
    inputSchema: GenerateObjectionStrategyInputSchema,
    outputSchema: GenerateObjectionStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await generateObjectionStrategyPrompt(input);
    if (!output) {
      throw new Error('Failed to generate objection handling strategy.');
    }
    return output;
  }
);
