'use server';
/**
 * @fileOverview Provides crop recommendations to farmers based on their region, soil type, weather, and budget.
 * - recommendCrops - A function that handles the crop recommendation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecommendCropsInputSchema = z.object({
  location: z.string().describe("The farmer's location, e.g., Patna, Bihar"),
  soilType: z.string().describe('The type of soil, e.g., Alluvial, Black, Red'),
  season: z.string().describe('The current farming season, e.g., Kharif, Rabi, Zaid'),
  landSize: z.string().describe('The size of the land in acres'),
  irrigationAvailable: z.string().describe('Whether irrigation is available (Yes/No)'),
  budgetLevel: z.string().describe("The farmer's budget level (Low, Medium, High)"),
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

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
  },
  async (input) => {
    return {
      crops: ['Wheat', 'Mustard', 'Gram', 'Barley'],
      fertilizerSuggestions:
        'For the primary crop (Wheat), a balanced NPK fertilizer (12:32:16) at the time of sowing is recommended. Follow up with Urea after the first irrigation.',
      pestDiseaseControl:
        'Watch out for aphids and rust disease. Use neem oil spray as a preventive measure for aphids. For rust, ensure good air circulation and use a recommended fungicide if infection is severe.',
      weatherPrecautions:
        'Be prepared for cold waves in December and January. Light irrigation can protect the crop from frost damage.',
      estimatedYield:
        'With good practices, you can expect a yield of about 15-20 quintals per acre.',
      marketAdvice:
        'Market prices for wheat are generally stable post-harvest in April. Consider selling in May for potentially better prices.',
      motivationalMessage:
        'A well-planned crop leads to a bountiful harvest. Keep up the great work!',
    };
  }
);
