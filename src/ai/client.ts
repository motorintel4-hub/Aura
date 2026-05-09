// src/ai/client.ts
'use server';

import OpenAI from 'openai';

const xaiApiKey = process.env.XAI_API_KEY;

if (!xaiApiKey) {
  console.warn('⚠️  XAI_API_KEY is not configured. Grok AI features will not work.');
  console.warn('To fix: Set XAI_API_KEY in your environment variables.');
}

/**
 * Initialize OpenAI client configured for Grok API (xAI)
 * Grok models are accessed via the OpenAI SDK with a custom base URL
 */
export const grokClient = new OpenAI({
  apiKey: xaiApiKey || 'sk-placeholder',
  baseURL: 'https://api.x.ai/v1',
});

/**
 * Available Grok models
 * Note: Grok-3 and Grok-4 are the latest available models
 */
export const GROK_MODELS = {
  LATEST: 'grok-3', // Use grok-3 as the latest stable model
  GROK_3: 'grok-3',
  GROK_2: 'grok-2-1212', // Fallback option if needed
} as const;

export type GrokModel = (typeof GROK_MODELS)[keyof typeof GROK_MODELS];

/**
 * Sales-focused AI configuration
 */
export const AI_CONFIG = {
  temperature: 0.7, // Balanced between creative and consistent
  maxTokens: 2048,
  salesTemperature: 0.6, // Slightly lower for more consistent sales messaging
  systemPrompt: `You are AURA, an expert automotive sales co-pilot designed to assist sales advisors at MotorIntel.
Your role is to provide intelligent, contextual insights, strategies, and recommendations to help advisors close deals and build customer relationships.
Always maintain a professional, empathetic tone focused on customer needs and value delivery.
When generating content, format responses clearly and actionably for advisor use.`,
} as const;

/**
 * Type for structured AI responses
 */
export interface StructuredResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
