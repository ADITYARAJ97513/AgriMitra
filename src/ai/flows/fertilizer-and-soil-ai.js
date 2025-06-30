'use server';
/**
 * @fileOverview An AI agent that provides fertilizer and soil health advice to farmers.
 *
 * - getFertilizerAndSoilAdvice - A function that provides fertilizer and soil advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FertilizerAndSoilAdviceInputSchema = z.object({
  cropSelected: z.string().describe('The crop the farmer is growing.'),
  soilType: z.string().describe('The type of soil.'),
  landSize: z.string().describe('The size of the land in acres.'),
  organicPreference: z.string().describe('Whether the farmer prefers organic methods (Yes/No).'),
  recentFertilizerUsed: z.string().optional().describe('Any fertilizers used recently.'),
  soilTestAvailable: z.string().describe('If soil test results are available (Yes/No).'),
  nitrogenLevel: z.number().optional().describe('Nitrogen level in kg/ha, if available.'),
  phosphorusLevel: z.number().optional().describe('Phosphorus level in kg/ha, if available.'),
  potassiumLevel: z.number().optional().describe('Potassium level in kg/ha, if available.'),
  pH: z.number().optional().describe('Soil pH, if available.'),
});

const FertilizerAndSoilAdviceOutputSchema = z.object({
  fertilizerSuggestions: z.array(z.object({ suggestion: z.string() })).describe('A list of specific fertilizer suggestions with application details.'),
  soilImprovementSuggestions: z.array(z.object({ suggestion: z.string() })).describe('A list of suggestions to improve overall soil health.'),
});

export async function getFertilizerAndSoilAdvice(input) {
  return fertilizerAndSoilAdviceFlow(input);
}

const fertilizerAndSoilAdviceFlow = ai.defineFlow(
  {
    name: 'fertilizerAndSoilAdviceFlow',
    inputSchema: FertilizerAndSoilAdviceInputSchema,
    outputSchema: FertilizerAndSoilAdviceOutputSchema,
  },
  async (input) => {
    return {
      fertilizerSuggestions: [
        { suggestion: "Apply 5-10 tons of Farm Yard Manure (FYM) or compost per acre about a month before sowing to improve soil structure and nutrient content." },
        { suggestion: `For your ${input.cropSelected || 'crop'}, a basal dose of 50kg DAP and 25kg Muriate of Potash per acre is a good starting point for chemical fertilizers.` },
        { suggestion: "If you prefer organic, use vermicompost (1-2 tons/acre) and a bio-fertilizer like Azotobacter to enhance nitrogen fixation." }
      ],
      soilImprovementSuggestions: [
        { suggestion: "Practice crop rotation with a leguminous crop like green gram (moong) to naturally fix nitrogen in the soil." },
        { suggestion: "Incorporate crop residues back into the soil after harvest to increase organic matter." },
        { suggestion: "Consider green manuring by growing crops like sunnhemp or dhaincha and ploughing them into the soil before they flower." }
      ],
    };
  }
);
