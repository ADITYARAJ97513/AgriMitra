'use server';
/**
 * @fileOverview An AI agent for detecting plant diseases from images.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DetectPlantDiseaseInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  cropType: z.string().describe('The type of crop.'),
  growthStage: z.string().describe('The growth stage of the crop.'),
  location: z.string().optional().describe('The location of the farm.'),
  symptomsObserved: z.string().optional().describe('Additional symptoms observed by the farmer.'),
});

const DetectPlantDiseaseOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether a plant leaf is detected in the image.'),
  disease: z.string().describe('The name of the detected disease, or "Healthy" if no disease is found.'),
  description: z.string().describe('A description of the disease and its symptoms.'),
  solution: z.string().describe('Actionable advice for treating the disease, including both organic and chemical options if applicable.'),
});

export async function detectPlantDisease(input) {
  return detectPlantDiseaseFlow(input);
}

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
    inputSchema: DetectPlantDiseaseInputSchema,
    outputSchema: DetectPlantDiseaseOutputSchema,
  },
  async (input) => {
    // This is a mock response. In a real scenario, the image would be analyzed.
    // We'll return a sample diagnosis.
    return {
      isPlant: true,
      disease: "Tomato Early Blight",
      description: "Early blight is a common fungal disease characterized by dark, concentric rings forming on the lower leaves, often resembling a target. The leaves may yellow and drop.",
      solution: "Remove and destroy affected lower leaves. Ensure good air circulation. For organic treatment, use a copper-based fungicide spray. For chemical options, fungicides containing mancozeb or chlorothalonil are effective. Avoid overhead watering.",
    };
  }
);
