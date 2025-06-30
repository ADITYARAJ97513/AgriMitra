'use server';
/**
 * @fileOverview Provides crop recommendations to farmers based on their region, soil type, weather, and budget.
 * - recommendCrops - A function that handles the crop recommendation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecommendCropsInputSchema = z.object({
  location: z.string().describe('The farmer\'s location, e.g., Patna, Bihar'),
  soilType: z.string().describe('The type of soil, e.g., Alluvial, Black, Red'),
  season: z.string().describe('The current farming season, e.g., Kharif, Rabi, Zaid'),
  landSize: z.string().describe('The size of the land in acres'),
  irrigationAvailable: z.string().describe('Whether irrigation is available (Yes/No)'),
  budgetLevel: z.string().describe('The farmer\'s budget level (Low, Medium, High)'),
  preferredCrops: z.string().optional().describe('Crops the farmer prefers to grow'),
  pastCrops: z.string().optional().describe('Crops grown in the past for rotation advice'),
});

const RecommendCropsOutputSchema = z.object({
  crops: z.array(z.string()).describe('A list of 3-4 recommended crops suitable for the conditions.'),
  fertilizerSuggestions: z.string().describe('Specific fertilizer advice for the top recommended crop.'),
  pestDiseaseControl: z.string().describe('Common pest and disease control measures for the recommended crops.'),
  weatherPrecautions: z.string().describe('Precautions to take based on the likely weather for the season.'),
  estimatedYield: z.string().describe('An estimated yield for the primary recommended crop.'),
  marketAdvice: z.string().describe('Advice on when and where to sell the produce for better returns.'),
  motivationalMessage: z.string().describe('A short, encouraging message for the farmer.'),
});

export async function recommendCrops(input) {
  return recommendCropsFlow(input);
}

const recommendCropsPrompt = ai.definePrompt({
  name: 'recommendCropsPrompt',
  input: { schema: RecommendCropsInputSchema },
  output: { schema: RecommendCropsOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert agricultural advisor for Indian farmers. Based on the following details, provide a detailed crop recommendation.

  **Farmer's Details:**
  - Location: {{{location}}}
  - Soil Type: {{{soilType}}}
  - Season: {{{season}}}
  - Land Size: {{{landSize}}} acres
  - Irrigation: {{{irrigationAvailable}}}
  - Budget: {{{budgetLevel}}}
  {{#if preferredCrops}}- Preferred Crops: {{{preferredCrops}}}{{/if}}
  {{#if pastCrops}}- Past Crops (for rotation): {{{pastCrops}}}{{/if}}

  **Your Task:**
  1.  **Recommend Crops**: Suggest 3-4 crops that are highly suitable for these conditions.
  2.  **Provide Detailed Advice**: For the top recommended crop, give specific advice on fertilizers, pest control, weather precautions, estimated yield, and market strategy.
  3.  **Be encouraging**: End with a motivational message.
  
  Provide the response in the structured JSON format.`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: recommendCropsPrompt,
      input: input,
    });
    return output;
  }
);
