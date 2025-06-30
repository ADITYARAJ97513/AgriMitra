'use server';
/**
 * @fileOverview An AI agent to identify pest and disease threats and suggest preventative measures.
 *
 * - pestAndDiseaseAI - A function that handles the pest and disease identification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const PestAndDiseaseAIInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  growthStage: z.string().describe('The current growth stage of the crop.'),
  symptomsObserved: z.string().describe('Any observed symptoms on the plants.'),
  organicPreference: z.string().describe('Whether the farmer prefers organic solutions (Yes/No).'),
  weatherConditions: z.string().optional().describe('Current weather conditions.'),
  chemicalsUsedEarlier: z.string().optional().describe('Any chemicals used recently.'),
});

export const PestAndDiseaseAIOutputSchema = z.object({
  pestThreats: z.array(z.string()).describe('A list of likely pest threats based on the input.'),
  diseaseThreats: z.array(z.string()).describe('A list of likely disease threats based on the input.'),
  preventativeMeasures: z.array(z.string()).describe('A list of measures to prevent these issues.'),
  organicTreatments: z.array(z.string()).describe('A list of organic treatment options.'),
  chemicalTreatments: z.array(z.string()).describe('A list of chemical treatment options. Provide only if organic preference is "No".'),
});

export async function pestAndDiseaseAI(input) {
  return pestAndDiseaseFlow(input);
}

const pestAndDiseasePrompt = ai.definePrompt({
  name: 'pestAndDiseasePrompt',
  input: { schema: PestAndDiseaseAIInputSchema },
  output: { schema: PestAndDiseaseAIOutputSchema },
  prompt: `You are an expert plant pathologist for Indian agriculture. Analyze the farmer's situation and provide pest and disease control advice.

  **Farmer's Report:**
  - Crop: {{{cropType}}}
  - Growth Stage: {{{growthStage}}}
  - Symptoms: {{{symptomsObserved}}}
  - Organic Preference: {{{organicPreference}}}
  {{#if weatherConditions}}- Weather: {{{weatherConditions}}}{{/if}}
  {{#if chemicalsUsedEarlier}}- Past Chemicals: {{{chemicalsUsedEarlier}}}{{/if}}

  **Your Task:**
  1.  Identify potential **pest threats** and **disease threats**.
  2.  Suggest 3-4 **preventative measures**.
  3.  Provide 2-3 **organic treatment** options.
  4.  If (and only if) \`organicPreference\` is 'No', provide 1-2 suitable **chemical treatment** options as a last resort. Otherwise, this array should be empty.

  Keep the advice concise and easy for a farmer to understand. Format the output as a structured JSON object.`,
});

const pestAndDiseaseFlow = ai.defineFlow(
  {
    name: 'pestAndDiseaseFlow',
    inputSchema: PestAndDiseaseAIInputSchema,
    outputSchema: PestAndDiseaseAIOutputSchema,
  },
  async (input) => {
    const { output } = await pestAndDiseasePrompt(input);
    return output;
  }
);
