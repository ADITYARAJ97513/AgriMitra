'use server';

/**
 * @fileOverview An AI agent that provides yield estimation and market advice for farmers.
 *
 * - marketAndYieldForecast - A function that handles the market and yield forecast process.
 */

import {ai} from '@/ai/genkit';

export async function marketAndYieldForecast(input) {
  return marketAndYieldForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketAndYieldForecastPrompt',
  prompt: `You are an AI Agritech Expert helping farmers in India with market analysis, in simple Hinglish.

  Based on the following inputs, generate:
  * Estimated yield
  * Market advice (including demand and pricing trends for the harvest month)
  * A simple profit analysis (if input costs are provided)

  Input Details:
  - Crop: {{{cropName}}}
  - Variety: {{{cropVariety}}}
  - Land Size: {{{landSize}}}
  - Location (District/State): {{{location}}}
  - Farming Method: {{{farmingMethod}}}
  - Expected Harvest Month: {{{expectedHarvestMonth}}}
  - Input Costs: {{{inputCosts}}}
  - Preferred Mandi: {{{mandiPreference}}}

  Your answer must:
  * Be in simple Hindi-English (Hinglish).
  * Provide practical, actionable advice.
  * Use real-time or near real-time data for market prices if possible, mentioning the source or that it's an estimate.
  * End with a friendly motivational line.

  The output should be a single, valid JSON object with 'yieldEstimation', 'marketAdvice', and optional 'profitAnalysis' keys. Do not include any other text or markdown formatting.`,
});

const marketAndYieldForecastFlow = ai.defineFlow(
  {
    name: 'marketAndYieldForecastFlow',
  },
  async input => {
    const { text } = await prompt(input);
    if (!text) {
      throw new Error("AI returned no response.");
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse AI response.");
    }
  }
);
