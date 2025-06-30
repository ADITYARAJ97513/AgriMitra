'use server';

/**
 * @fileOverview Provides crop recommendations to farmers based on their region, soil type, weather, and budget.
 *
 * - recommendCrops - A function that handles the crop recommendation process.
 */

import {ai} from '@/ai/genkit';

export async function recommendCrops(input) {
  return recommendCropsFlow(input);
}

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    return {
      crops: ['Wheat', 'Mustard', 'Gram'],
      fertilizerSuggestions:
        'For Wheat, use a base application of DAP and Potash. Follow up with Urea in two split doses.',
      pestDiseaseControl:
        'Monitor for aphids in Mustard. Use a mild organic pesticide like neem oil if detected early.',
      weatherPrecautions:
        'Ensure proper irrigation if winter rains are insufficient. Protect young plants from frost.',
      estimatedYield: 'You can expect a good yield of 15-20 quintals per acre for wheat.',
      marketAdvice:
        'Market prices for wheat are expected to be stable. Consider selling in April for better returns.',
      motivationalMessage:
        'Happy farming! Your hard work will surely pay off.',
    };
  }
);
