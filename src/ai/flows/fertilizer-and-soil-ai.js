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

const fertilizerAndSoilAdvicePrompt = ai.definePrompt({
  name: 'fertilizerAndSoilAdvicePrompt',
  input: { schema: FertilizerAndSoilAdviceInputSchema },
  output: { schema: FertilizerAndSoilAdviceOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert soil scientist and agronomist advising an Indian farmer. Provide fertilizer and soil health recommendations based on the details below.

  **Farm Details:**
  - Crop: {{{cropSelected}}}
  - Soil Type: {{{soilType}}}
  - Land Size: {{{landSize}}} acres
  - Organic Preference: {{{organicPreference}}}
  {{#if recentFertilizerUsed}}- Recently Used Fertilizers: {{{recentFertilizerUsed}}}{{/if}}

  {{#if (eq soilTestAvailable "Yes")}}- **Soil Test Results:**
    - Nitrogen (N): {{{nitrogenLevel}}} kg/ha
    - Phosphorus (P): {{{phosphorusLevel}}} kg/ha
    - Potassium (K): {{{potassiumLevel}}} kg/ha
    - pH: {{{pH}}}
  {{else}}- No soil test results available. Provide general advice based on crop and soil type.
  {{/if}}
  
  **Your Task:**
  1.  **Fertilizer Suggestions**: Provide 2-3 clear, actionable suggestions for fertilizers. If organic preference is 'Yes', focus on organic options like compost, manure, bio-fertilizers. Otherwise, provide a balanced recommendation of chemical and/or organic fertilizers. Mention dosage per acre and application timing.
  2.  **Soil Improvement**: Provide 2-3 suggestions for long-term soil health improvement, like crop rotation, green manuring, or adding organic matter.

  Format the output as a structured JSON object. Each suggestion should be a separate item in the array.`,
});

const fertilizerAndSoilAdviceFlow = ai.defineFlow(
  {
    name: 'fertilizerAndSoilAdviceFlow',
    inputSchema: FertilizerAndSoilAdviceInputSchema,
    outputSchema: FertilizerAndSoilAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: fertilizerAndSoilAdvicePrompt,
      input: input,
    });
    return output;
  }
);
