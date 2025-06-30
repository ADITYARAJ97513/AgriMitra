'use server';
/**
 * @fileOverview An AI agent for detecting plant diseases from images.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const DetectPlantDiseaseInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  cropType: z.string().describe('The type of crop.'),
  growthStage: z.string().describe('The growth stage of the crop.'),
  location: z.string().optional().describe('The location of the farm.'),
  symptomsObserved: z.string().optional().describe('Additional symptoms observed by the farmer.'),
});

export const DetectPlantDiseaseOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether a plant leaf is detected in the image.'),
  disease: z.string().describe('The name of the detected disease, or "Healthy" if no disease is found.'),
  description: z.string().describe('A description of the disease and its symptoms.'),
  solution: z.string().describe('Actionable advice for treating the disease, including both organic and chemical options if applicable.'),
});

export async function detectPlantDisease(input) {
  return detectPlantDiseaseFlow(input);
}

const detectPlantDiseasePrompt = ai.definePrompt({
  name: 'detectPlantDiseasePrompt',
  input: { schema: DetectPlantDiseaseInputSchema },
  output: { schema: DetectPlantDiseaseOutputSchema },
  prompt: `You are a plant disease detection expert. Analyze the provided image and information to diagnose the plant's health.

  **Context:**
  - Crop Type: {{{cropType}}}
  - Growth Stage: {{{growthStage}}}
  {{#if location}}- Location: {{{location}}}{{/if}}
  {{#if symptomsObserved}}- Farmer's Notes: {{{symptomsObserved}}}{{/if}}

  **Image of the plant leaf:**
  {{media url=photoDataUri}}

  **Your Task:**
  1.  Determine if the image contains a plant leaf. Set 'isPlant' accordingly.
  2.  If it is a plant, identify any disease present. If none, state "Healthy".
  3.  Provide a clear description of the disease.
  4.  Suggest a concise, actionable solution. Mention both organic and chemical options for the farmer to choose from.
  
  If the image is not a plant, set isPlant to false and provide appropriate text for the other fields (e.g., "Not a plant", "N/A").
  
  Format the output as a structured JSON object.`,
});


const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
    inputSchema: DetectPlantDiseaseInputSchema,
    outputSchema: DetectPlantDiseaseOutputSchema,
  },
  async (input) => {
    const { output } = await detectPlantDiseasePrompt(input);
    return output;
  }
);
