// src/actions/ai-flows.ts
'use server';

import { grokClient, GROK_MODELS, AI_CONFIG, type StructuredResponse } from '@/ai/client';
import { z } from 'zod';

/**
 * Generic server action wrapper for AI flows
 * Provides consistent error handling, logging, and response formatting
 */
async function executeAIFlow<T>(
  flowName: string,
  payload: Record<string, unknown>,
  schema: z.ZodSchema,
  userPrompt: string
): Promise<StructuredResponse<T>> {
  const startTime = Date.now();
  
  try {
    console.log(`[${flowName}] Starting AI flow...`);
    
    // Call Grok API with JSON schema validation
    const response = await grokClient.chat.completions.create({
      model: GROK_MODELS.LATEST,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [
        {
          role: 'system',
          content: AI_CONFIG.systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`No response content from Grok API for ${flowName}`);
    }

    // Parse and validate response
    const jsonResponse = JSON.parse(content);
    const validatedData = schema.parse(jsonResponse) as T;

    const duration = Date.now() - startTime;
    console.log(`[${flowName}] Completed successfully in ${duration}ms`);
    console.log(`[${flowName}] Tokens used: ${response.usage?.total_tokens ?? 'unknown'}`);

    return {
      success: true,
      data: validatedData,
      timestamp: new Date(),
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`[${flowName}] Failed after ${duration}ms:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
      timestamp: new Date(),
    };
  }
}

/**
 * Generate Buyer Persona and Advisor Briefing
 * Input: Customer 6P discovery data
 * Output: Persona label, advisor briefing, vehicle recommendations
 */
export async function generateBuyerPersonaBriefingAction(input: {
  p1Purpose: string;
  p2People: string;
  p3Pattern: string;
  p4Preferences: string;
  p5Price: string;
  p6PurchaseContext: string;
}): Promise<
  StructuredResponse<{
    personaLabel: string;
    advisorBriefing: {
      leadWith: string;
      highlight: string;
      mention: string;
      avoid: string;
    };
    vehicleRecommendations: Array<{
      modelName: string;
      matchPercentage: number;
      description: string;
      featureTags: string[];
    }>;
  }>
> {
  const schema = z.object({
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
    ),
  });

  const vehicleModels = [
    'MotorIntel Grand Touring',
    'MotorIntel Urban Commuter',
    'MotorIntel Adventure SUV',
    'MotorIntel Electric Drive',
  ];

  const prompt = `You are an expert automotive sales co-pilot for MotorIntel. Analyze the customer 6P discovery data and generate a buyer persona, advisor briefing, and vehicle recommendations.

Available vehicles: ${vehicleModels.join(', ')}

Customer Data:
- Purpose: ${input.p1Purpose}
- People: ${input.p2People}
- Pattern: ${input.p3Pattern}
- Preferences: ${input.p4Preferences}
- Price: ${input.p5Price}
- Purchase Context: ${input.p6PurchaseContext}

Generate a JSON response with:
1. personaLabel: A concise buyer persona label (e.g., 'Urban Family Buyer')
2. advisorBriefing: Object with leadWith, highlight, mention, avoid fields
3. vehicleRecommendations: Array of 3-4 vehicles with matchPercentage (0-100), description, and featureTags

Respond ONLY with valid JSON.`;

  return executeAIFlow('generateBuyerPersonaBriefing', input, schema, prompt);
}

/**
 * Generate Objection Handling Strategy
 * Input: Objection category, customer context, vehicle model
 * Output: Strategy name and two-step handling approach with script lines
 */
export async function generateObjectionStrategyAction(input: {
  objectionCategory: string;
  customerContext: string;
  vehicleModel: string;
  vehicleData: string;
}): Promise<
  StructuredResponse<{
    strategyName: string;
    steps: Array<{
      tactic: string;
      scriptLine: string;
    }>;
  }>
> {
  const schema = z.object({
    strategyName: z.string(),
    steps: z.array(
      z.object({
        tactic: z.string(),
        scriptLine: z.string(),
      })
    ).length(2),
  });

  const prompt = `You are AURA AI, an automotive sales co-pilot. Generate a two-step objection handling strategy.

Objection Category: ${input.objectionCategory}
Customer Context: ${input.customerContext}
Vehicle Model: ${input.vehicleModel}
Vehicle Data: ${input.vehicleData}

Generate a JSON response with:
1. strategyName: A concise name for the strategy
2. steps: Array of exactly 2 objects, each with tactic and scriptLine

The strategy should be professional, empathetic, and focused on addressing the objection while highlighting value.
Respond ONLY with valid JSON.`;

  return executeAIFlow('generateObjectionStrategy', input, schema, prompt);
}

/**
 * Generate Sales Pitch Levels
 * Input: Customer context, vehicle details
 * Output: Three-level pitch (introductory, detailed, closing)
 */
export async function generateSalesPitchLevelsAction(input: {
  customerProfile: string;
  vehicleModel: string;
  keyFeatures: string;
  pricePoint: string;
}): Promise<
  StructuredResponse<{
    pitchLevels: Array<{
      level: 'introductory' | 'detailed' | 'closing';
      duration: string;
      content: string;
      focusPoints: string[];
    }>;
  }>
> {
  const schema = z.object({
    pitchLevels: z.array(
      z.object({
        level: z.enum(['introductory', 'detailed', 'closing']),
        duration: z.string(),
        content: z.string(),
        focusPoints: z.array(z.string()),
      })
    ),
  });

  const prompt = `You are AURA AI, an automotive sales co-pilot. Generate three levels of sales pitches.

Customer Profile: ${input.customerProfile}
Vehicle Model: ${input.vehicleModel}
Key Features: ${input.keyFeatures}
Price Point: ${input.pricePoint}

Generate a JSON response with pitchLevels array containing exactly 3 objects (introductory, detailed, closing) with:
- level: The pitch level type
- duration: Estimated duration (e.g., "30 seconds", "2 minutes")
- content: The pitch text
- focusPoints: Array of 3-4 key points to emphasize

Each pitch should build on the previous level. Respond ONLY with valid JSON.`;

  return executeAIFlow('generateSalesPitchLevels', input, schema, prompt);
}

/**
 * Provide Contextual Copilot Insights
 * Input: Customer interaction context
 * Output: Real-time insights and next-step recommendations
 */
export async function provideContextualCopilotInsightsAction(input: {
  conversationHistory: string;
  currentPhase: string;
  customerMood: string;
  nextAction: string;
}): Promise<
  StructuredResponse<{
    insights: string[];
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      action: string;
      reasoning: string;
    }>;
    suggestedMessage?: string;
  }>
> {
  const schema = z.object({
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

  const prompt = `You are AURA AI, providing real-time contextual insights to a sales advisor.

Conversation History: ${input.conversationHistory}
Current Phase: ${input.currentPhase}
Customer Mood: ${input.customerMood}
Next Action: ${input.nextAction}

Generate a JSON response with:
1. insights: Array of 2-3 key observations about the customer and conversation
2. recommendations: Array of 2-3 actionable recommendations with priority (high/medium/low)
3. suggestedMessage (optional): A suggested next message for the advisor

Respond ONLY with valid JSON.`;

  return executeAIFlow('provideContextualCopilotInsights', input, schema, prompt);
}

/**
 * Summarize Customer Notes
 * Input: Raw customer notes/conversation
 * Output: Structured summary with key findings and action items
 */
export async function summarizeCustomerNotesAction(input: {
  notes: string;
  customerName: string;
  visitDate: string;
}): Promise<
  StructuredResponse<{
    summary: string;
    keyNeeds: string[];
    objections: string[];
    nextSteps: string[];
    followUpDeadline: string;
  }>
> {
  const schema = z.object({
    summary: z.string(),
    keyNeeds: z.array(z.string()),
    objections: z.array(z.string()),
    nextSteps: z.array(z.string()),
    followUpDeadline: z.string(),
  });

  const prompt = `You are AURA AI, an assistant for organizing customer sales data. Summarize and structure customer notes.

Customer Name: ${input.customerName}
Visit Date: ${input.visitDate}

Notes:
${input.notes}

Generate a JSON response with:
1. summary: A 2-3 sentence summary of the visit
2. keyNeeds: Array of 2-3 identified customer needs
3. objections: Array of any objections or concerns mentioned
4. nextSteps: Array of 2-3 recommended follow-up actions
5. followUpDeadline: Recommended follow-up date/timeframe

Respond ONLY with valid JSON.`;

  return executeAIFlow('summarizeCustomerNotes', input, schema, prompt);
}
