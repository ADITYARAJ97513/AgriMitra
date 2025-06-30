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

const detectPlantDiseaseFlow = ai.defineFlow(
  {
    name: 'detectPlantDiseaseFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    // Wait for a bit to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (input.cropType && input.cropType.toLowerCase() === 'tomato') {
        return {
            isPlant: true,
            disease: 'Tomato Early Blight',
            description: 'Early blight is a fungal disease characterized by brown to black spots with concentric rings, resembling a target. It typically starts on lower, older leaves.',
            solution: 'Remove and discard affected lower leaves. Ensure good air circulation by spacing plants properly. For organic treatment, use a copper-based fungicide. For chemical treatment, Mancozeb can be effective. Avoid overhead watering.'
        }
    }
    
    return {
      isPlant: true,
      disease: 'Healthy',
      description: 'The plant appears to be healthy. No signs of major diseases detected. The leaves have good color and structure.',
      solution: 'Continue with good agricultural practices. Ensure proper nutrition and watering to maintain plant health. Regularly monitor for any signs of pests or diseases.'
    };
  }
);
