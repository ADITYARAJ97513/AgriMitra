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

const marketAndYieldForecastPrompt = ai.definePrompt({
  name: 'marketAndYieldForecastPrompt',
  input: { schema: MarketAndYieldForecastInputSchema },
  output: { schema: MarketAndYieldForecastOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert agricultural market analyst for India. Provide a yield and market forecast based on the following information.

  **Crop Details:**
  - Crop: {{{cropName}}}
  {{#if cropVariety}}- Variety: {{{cropVariety}}}{{/if}}
  - Location: {{{location}}}
  - Land Size: {{{landSize}}} acres
  - Farming Method: {{{farmingMethod}}}
  - Expected Harvest: {{{expectedHarvestMonth}}}
  {{#if mandiPreference}}- Preferred Mandi: {{{mandiPreference}}}{{/if}}
  {{#if inputCosts}}- Estimated Input Costs: Rs. {{{inputCosts}}}{{/if}}

  **Your Task:**
  1.  **Yield Estimation**: Provide a realistic yield estimation for the given land size and farming method.
  2.  **Market Advice**: Give advice on the expected market price around the harvest month. Mention trends and if it's better to sell immediately or store.
  3.  **Profit Analysis**: If input costs are provided, calculate a potential profit range. If not, leave the profitAnalysis field as an empty string.

  Provide the output in a structured JSON format. The tone should be advisory and easy for a farmer to understand.`,
});

const marketAndYieldForecastFlow = ai.defineFlow(
  {
    name: 'marketAndYieldForecastFlow',
    inputSchema: MarketAndYieldForecastInputSchema,
    outputSchema: MarketAndYieldForecastOutputSchema,
  },
  async (input) => {
    const { output } = await marketAndYieldForecastPrompt(input);
    return output;
  }
);
