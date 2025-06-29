'use server';
/**
 * @fileOverview An AI agent for detecting plant diseases from images.
 *
 * - detectPlantDisease - A function that handles the plant disease detection process.
 */

import {ai} from '@/ai/genkit';

export async function detectPlantDisease(input) {
  return detectPlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectPlantDiseasePrompt',
  prompt: `You are an expert plant pathologist. Your task is to identify diseases in plants from images of their leaves, focusing on tomato, paddy, and wheat.

You will be given a photo of a plant leaf and additional context to improve your diagnosis.

Analyze the image and context, then provide the following information:
1.  **isPlant**: Confirm if the image is of a plant leaf.
2.  **disease**: Identify the specific disease affecting the plant. If the plant appears healthy, state "Healthy".
3.  **description**: Provide a brief description of the disease, its symptoms, and causes.
4.  **solution**: Suggest practical and effective solutions for treating the disease, including both organic and chemical options if applicable.

If the image is not a plant leaf, set isPlant to false and leave other fields empty.

Context:
- Crop Type: {{{cropType}}}
- Growth Stage: {{{growthStage}}}
- Location: {{{location}}}
- Observed Symptoms: {{{symptomsObserved}}}

Photo: {{media url=photoDataUri}}

Provide your response as a single, valid JSON object with the keys: "isPlant", "disease", "description", and "solution". Do not include any other text or markdown formatting.
`,
});

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
  },
  async input => {
    const { text } = await prompt(input);
    if (!text) {
      throw new Error("AI returned no response.");
    }
     try {
      return JSON.parse(text);
    } catch (e) {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse AI response.");
    }
  }
);
