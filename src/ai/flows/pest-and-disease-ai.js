'use server';
/**
 * @fileOverview An AI agent to identify pest and disease threats and suggest preventative measures.
 *
 * - pestAndDiseaseAI - A function that handles the pest and disease identification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PestAndDiseaseAIInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown.'),
  growthStage: z.string().describe('The current growth stage of the crop.'),
  symptomsObserved: z.string().describe('Any observed symptoms on the plants.'),
  organicPreference: z.string().describe('Whether the farmer prefers organic solutions (Yes/No).'),
  weatherConditions: z.string().optional().describe('Current weather conditions.'),
  chemicalsUsedEarlier: z.string().optional().describe('Any chemicals used recently.'),
});

const PestAndDiseaseAIOutputSchema = z.object({
  pestThreats: z.array(z.string()).describe('A list of likely pest threats based on the input.'),
  diseaseThreats: z.array(z.string()).describe('A list of likely disease threats based on the input.'),
  preventativeMeasures: z.array(z.string()).describe('A list of measures to prevent these issues.'),
  organicTreatments: z.array(z.string()).describe('A list of organic treatment options.'),
  chemicalTreatments: z.array(z.string()).describe('A list of chemical treatment options. Provide only if organic preference is "No".'),
});

export async function pestAndDiseaseAI(input) {
  return pestAndDiseaseFlow(input);
}

const pestAndDiseaseFlow = ai.defineFlow(
  {
    name: 'pestAndDiseaseFlow',
    inputSchema: PestAndDiseaseAIInputSchema,
    outputSchema: PestAndDiseaseAIOutputSchema,
  },
  async (input) => {
    const organicTreatments = [
      "Spray a solution of Neem Oil (5ml per liter of water) with a few drops of liquid soap. It's effective against a wide range of soft-bodied insects.",
      "For fungal issues, a spray of diluted buttermilk or a solution of baking soda (1 teaspoon per liter of water) can be effective as a preventative measure.",
      "Set up yellow sticky traps to monitor and control populations of aphids and whiteflies."
    ];
    const chemicalTreatments = input.organicPreference === 'No' ? [
      "For sucking pests like aphids, consider a systemic insecticide like Imidacloprid 17.8% SL. Always follow the dosage instructions on the label.",
      "For fungal diseases, a broad-spectrum fungicide like Mancozeb can be used. Ensure proper coverage."
    ] : [];

    return {
      pestThreats: ["Aphids", "Whiteflies", "Stem Borer"],
      diseaseThreats: ["Powdery Mildew", "Leaf Spot", "Rust"],
      preventativeMeasures: [
        "Ensure proper spacing between plants for good air circulation to reduce fungal growth.",
        "Remove and destroy infected plant parts immediately to prevent spread.",
        "Encourage beneficial insects like ladybugs and lacewings by planting companion flowers."
      ],
      organicTreatments: organicTreatments,
      chemicalTreatments: chemicalTreatments,
    };
  }
);
