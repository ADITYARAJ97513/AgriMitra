'use server';
/**
 * @fileOverview An AI agent that provides yield estimation and market advice for farmers.
 *
 * - marketAndYieldForecast - A function that handles the market and yield forecast process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MarketAndYieldForecastInputSchema = z.object({
  cropName: z.string().describe('Name of the crop.'),
  location: z.string().describe('Location (District, State) for market price context.'),
  landSize: z.string().describe('Land size in acres.'),
  farmingMethod: z.string().describe('Farming method used (e.g., Organic, Traditional, High-yield hybrid).'),
  expectedHarvestMonth: z.string().describe('The month the harvest is expected.'),
  cropVariety: z.string().optional().describe('Specific variety of the crop, if known.'),
  inputCosts: z.string().optional().describe('Total input costs in Rupees, if available.'),
  mandiPreference: z.string().optional().describe('Preferred local market (mandi).'),
});

const MarketAndYieldForecastOutputSchema = z.object({
  yieldEstimation: z.string().describe('An estimated yield for the crop in quintals or tons per acre.'),
  marketAdvice: z.string().describe('Advice on expected market prices, demand, and best time/place to sell.'),
  profitAnalysis: z.string().describe('A simple profit analysis if input costs are provided, otherwise an empty string.'),
});

export async function marketAndYieldForecast(input) {
  return marketAndYieldForecastFlow(input);
}

const marketAndYieldForecastFlow = ai.defineFlow(
  {
    name: 'marketAndYieldForecastFlow',
    inputSchema: MarketAndYieldForecastInputSchema,
    outputSchema: MarketAndYieldForecastOutputSchema,
  },
  async (input) => {
    let profitAnalysis = "";
    if (input.inputCosts) {
      const costs = parseFloat(input.inputCosts);
      const revenue = 20 * 2200; // Mock yield * mock price
      const profit = revenue - costs;
      profitAnalysis = `With an estimated input cost of Rs. ${costs}, and a potential revenue of Rs. ${revenue} (based on 20 quintals at Rs. 2200/quintal), your estimated profit could be around Rs. ${profit}. This is just an estimate.`;
    }

    return {
      yieldEstimation: `For ${input.cropName} using a ${input.farmingMethod} method on ${input.landSize} acres, a realistic yield would be between 18-22 quintals per acre.`,
      marketAdvice: `The market price for ${input.cropName} in ${input.location} during ${input.expectedHarvestMonth} is expected to be around Rs. 2100-2350 per quintal. Prices are often lower immediately after harvest, so if you have storage capacity, waiting a month could fetch a better price.`,
      profitAnalysis: profitAnalysis,
    };
  }
);
