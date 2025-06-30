'use server';
/**
 * @fileOverview An AI agent to identify pest and disease threats and suggest preventative measures.
 *
 * - pestAndDiseaseAI - A function that handles the pest and disease identification process.
 */

import {ai} from '@/ai/genkit';

export async function pestAndDiseaseAI(input) {
  return pestAndDiseaseFlow(input);
}

const pestAndDiseaseFlow = ai.defineFlow(
  {
    name: 'pestAndDiseaseFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    const mockResponse = {
      pestThreats: ['Aphids', 'Whiteflies'],
      diseaseThreats: ['Powdery Mildew', 'Leaf Spot'],
      preventativeMeasures: [
        'Ensure proper spacing between plants for good air circulation.',
        'Remove and destroy infected plant parts immediately.',
        'Use certified disease-free seeds.',
      ],
      organicTreatments: [
        'For pests, spray a solution of neem oil (5ml per liter of water).',
        'For powdery mildew, spray a solution of baking soda (1 tsp) and liquid soap (a few drops) in 1 liter of water.',
      ],
      chemicalTreatments: [],
    };

    if (input.organicPreference !== 'Yes') {
        mockResponse.chemicalTreatments.push("For severe whitefly infestation, consider using Imidacloprid as per label instructions.");
        mockResponse.chemicalTreatments.push("For fungal diseases, a spray of Mancozeb can be effective.");
    }

    return mockResponse;
  }
);
