'use server';
/**
 * @fileOverview This file implements a Genkit flow to automatically generate a detailed buyer persona,
 * a concise advisor briefing, and ranked vehicle recommendations based on the 6P customer discovery data.
 *
 * - generateBuyerPersonaBriefing - A function that orchestrates the persona and briefing generation process.
 * - GenerateBuyerPersonaBriefingInput - The input type for the generateBuyerPersonaBriefing function.
 * - GenerateBuyerPersonaBriefingOutput - The return type for the generateBuyerPersonaBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VEHICLE_MODELS = [
  'MotorIntel Grand Touring',
  'MotorIntel Urban Commuter',
  'MotorIntel Adventure SUV',
  'MotorIntel Electric Drive',
];

const GenerateBuyerPersonaBriefingInputSchema = z.object({
  p1Purpose: z.string().describe('Customer\'s purpose for buying a vehicle.'),
  p2People: z.string().describe('Information about the people influencing the purchase decision (family, etc.).'),
  p3Pattern: z.string().describe('Customer\'s usage patterns and driving habits.'),
  p4Preferences: z.string().describe('Customer\'s specific vehicle preferences (features, brand, etc.).'),
  p5Price: z.string().describe('Customer\'s budget and financing considerations.'),
  p6PurchaseContext: z.string().describe('Context surrounding the purchase (urgency, trade-in, etc.).'),
});
export type GenerateBuyerPersonaBriefingInput = z.infer<typeof GenerateBuyerPersonaBriefingInputSchema>;

const GenerateBuyerPersonaBriefingOutputSchema = z.object({
  personaLabel: z.string().describe('A concise label for the buyer persona (e.g., \'Urban Family Buyer\', \'First-Time Buyer\', \'Safety-Conscious Buyer\').'),
  advisorBriefing: z
    .object({
      leadWith: z.string().describe('What the advisor should lead with in the pitch.'),
      highlight: z.string().describe('Key features or aspects to highlight.'),
      mention: z.string().describe('Additional points to mention.'),
      avoid: z.string().describe('Topics or approaches to avoid.'),
    })
    .describe('A two-line summary for the advisor, covering what to lead with, highlight, mention, and avoid.'),
  vehicleRecommendations: z
    .array(
      z.object({
        modelName: z.enum(VEHICLE_MODELS).describe('The recommended vehicle model from the four agreed models.'),
        matchPercentage: z.number().min(0).max(100).describe('The match percentage of this vehicle for the customer.'),
        description: z.string().describe('A two-line description of why this vehicle suits the persona.'),
        featureTags: z.array(z.string()).describe('Relevant feature tags for this recommendation.'),
      })
    )
    .describe('A ranked list of vehicle recommendations with match percentages, tied to the four agreed models.'),
});
export type GenerateBuyerPersonaBriefingOutput = z.infer<typeof GenerateBuyerPersonaBriefingOutputSchema>;

export async function generateBuyerPersonaBriefing(input: GenerateBuyerPersonaBriefingInput): Promise<GenerateBuyerPersonaBriefingOutput> {
  return generateBuyerPersonaBriefingFlow(input);
}

const generateBuyerPersonaBriefingPrompt = ai.definePrompt({
  name: 'generateBuyerPersonaBriefingPrompt',
  input: {schema: GenerateBuyerPersonaBriefingInputSchema},
  output: {schema: GenerateBuyerPersonaBriefingOutputSchema},
  model: 'groq/llama-3.1-70b-versatile', // As per architecture prompt
  prompt: `You are an expert automotive sales co-pilot for MotorIntel. Your task is to analyze customer 6P discovery data and generate a detailed buyer persona, a concise advisor briefing, and ranked vehicle recommendations.

Use the following four vehicle models for recommendations ONLY: ${VEHICLE_MODELS.join(', ')}

Customer 6P Discovery Data:
Purpose: {{{p1Purpose}}}
People: {{{p2People}}}
Pattern: {{{p3Pattern}}}
Preferences: {{{p4Preferences}}}
Price: {{{p5Price}}}
Purchase Context: {{{p6PurchaseContext}}}

Based on the provided 6P data, generate a:
1.  Buyer persona label (e.g., 'Urban Family Buyer', 'First-Time Buyer', 'Safety-Conscious Buyer').
2.  Advisor briefing, covering what to lead with, highlight, mention, and avoid, in a concise two-line format.
3.  Ranked list of vehicle recommendations from the specified four models, including a match percentage, a two-line description of why it suits the persona, and relevant feature tags.

Provide the output strictly in the JSON format as defined by the output schema.`,
});

const generateBuyerPersonaBriefingFlow = ai.defineFlow(
  {
    name: 'generateBuyerPersonaBriefingFlow',
    inputSchema: GenerateBuyerPersonaBriefingInputSchema,
    outputSchema: GenerateBuyerPersonaBriefingOutputSchema,
  },
  async input => {
    const {output} = await generateBuyerPersonaBriefingPrompt(input);
    if (!output) {
      throw new Error('Failed to generate buyer persona briefing.');
    }
    return output;
  }
);
