'use server';
/**
 * @fileOverview Provides dynamic, context-aware AI insights and recommendations to sales advisors.
 *
 * - provideContextualCopilotInsights - A function that generates and returns a contextual AI insight.
 * - ProvideContextualCopilotInsightsInput - The input type for the provideContextualCopilotInsights function.
 * - ProvideContextualCopilotInsightsOutput - The return type for the provideContextualCopilotInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProvideContextualCopilotInsightsInputSchema = z.object({
  screenContext: z.string().describe('The current screen or flow the advisor is on (e.g., "customer-profile", "discovery-flow", "pitch-flow", "training-hub").'),
  customerName: z.string().optional().describe('The name of the customer, if applicable.'),
  customerBuyerPersona: z.string().optional().describe('The detected buyer persona of the customer (e.g., "Urban Family Buyer").'),
  customerLeadStage: z.string().optional().describe('The current lead stage of the customer.'),
  customerVehicleInterest: z.string().optional().describe('The specific vehicle model the customer is interested in (from the four agreed models).'),
  currentPitchLevel: z.string().optional().describe('If in a pitch flow, the current pitch level (e.g., "Functional", "Emotional", "Aspirational").'),
  customerDecisionPriorities: z.string().optional().describe('Key decision priorities for the customer, e.g., "Safety: 8, Price: 6".'),
  advisorPerformanceMetric: z.string().optional().describe('Relevant advisor performance metric if in a training context.'),
});
export type ProvideContextualCopilotInsightsInput = z.infer<typeof ProvideContextualCopilotInsightsInputSchema>;

const ProvideContextualCopilotInsightsOutputSchema = z.object({
  copilotInsight: z.string().describe('A dynamic, context-aware AI insight or recommendation tailored to the current situation.'),
});
export type ProvideContextualCopilotInsightsOutput = z.infer<typeof ProvideContextualCopilotInsightsOutputSchema>;

export async function provideContextualCopilotInsights(input: ProvideContextualCopilotInsightsInput): Promise<ProvideContextualCopilotInsightsOutput> {
  return provideContextualCopilotInsightsFlow(input);
}

const copilotInsightPrompt = ai.definePrompt({
  name: 'copilotInsightPrompt',
  input: { schema: ProvideContextualCopilotInsightsInputSchema },
  output: { schema: ProvideContextualCopilotInsightsOutputSchema },
  model: 'groq/llama3-8b-8192', // Using Llama 3.1 8B for lighter tasks as per architecture
  prompt: `You are AURA AI, the Kinetic Intelligence co-pilot for sales advisors. Your role is to provide a single, dynamic, and context-aware insight or recommendation to the advisor. This insight should be highly relevant to the current situation and the customer's profile, always focusing on maximizing the advisor's effectiveness with the four agreed vehicle models. When referencing vehicles, use generic names like 'Vehicle Model A', 'Vehicle Model B', 'Vehicle Model C', 'Vehicle Model D' as placeholders for the four agreed models.

Current Context:
Screen/Flow: {{{screenContext}}}
{{#if customerName}}Customer Name: {{{customerName}}}{{/if}}
{{#if customerBuyerPersona}}Customer Persona: {{{customerBuyerPersona}}}{{/if}}
{{#if customerLeadStage}}Lead Stage: {{{customerLeadStage}}}{{/if}}
{{#if customerVehicleInterest}}Vehicle Interest: {{{customerVehicleInterest}}}{{/if}}
{{#if currentPitchLevel}}Current Pitch Level: {{{currentPitchLevel}}}{{/if}}
{{#if customerDecisionPriorities}}Customer Priorities: {{{customerDecisionPriorities}}}{{/if}}
{{#if advisorPerformanceMetric}}Advisor Performance: {{{advisorPerformanceMetric}}}{{/if}}

Based on the above, provide a single, actionable insight or recommendation. Focus on behavioral tips, next steps, or pitch adjustments. Ensure the response is concise and directly addresses the current context.

Example insights:
- "Given the customer's interest in 'Vehicle Model B' and their 'Urban Family Buyer' persona, highlight the advanced safety features and spacious interior first."
- "During the discovery flow, as you're capturing 'Pattern' data, inquire about the customer's daily commute and typical usage to tailor recommendations."
- "For a customer in the 'Negotiation' lead stage, with 'Price' as a high priority, consider emphasizing long-term value and low maintenance costs of 'Vehicle Model C'."
- "Your conversion rate is lagging in 'Vehicle Model A' pitches; focus on mastering the 'Emotional Pitch' level for this model."

Your insight:`,
});

const provideContextualCopilotInsightsFlow = ai.defineFlow(
  {
    name: 'provideContextualCopilotInsightsFlow',
    inputSchema: ProvideContextualCopilotInsightsInputSchema,
    outputSchema: ProvideContextualCopilotInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await copilotInsightPrompt(input);
    if (!output) {
      throw new Error('Failed to generate copilot insight.');
    }
    return output;
  }
);
