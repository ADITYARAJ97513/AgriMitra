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

const marketAndYieldForecastFlow = ai.defineFlow(
  {
    name: 'marketAndYieldForecastFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    const mockResponse = {
      yieldEstimation:
        `For ${input.cropName || 'your crop'} (${input.cropVariety || 'local variety'}) on ${input.landSize} acres using ${input.farmingMethod} methods, you can expect an estimated yield of around 18-22 quintals.`,
      marketAdvice:
        `In ${input.expectedHarvestMonth || 'the upcoming month'}, prices for ${input.cropName || 'your crop'} at the ${input.mandiPreference || 'local'} mandi are expected to be stable. Look for a price around Rs. 2100-2250 per quintal.`,
      profitAnalysis: '',
    };
    if (input.inputCosts) {
      mockResponse.profitAnalysis = `With input costs of Rs. ${input.inputCosts}, you could see a potential profit of Rs. 20,000 - 25,000. This is an estimate and depends on final market price and yield.`;
    }
    return mockResponse;
  }
);
