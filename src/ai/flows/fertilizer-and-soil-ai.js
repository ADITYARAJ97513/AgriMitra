'use server';
/**
 * @fileOverview An AI agent that provides fertilizer and soil health advice to farmers.
 *
 * - getFertilizerAndSoilAdvice - A function that provides fertilizer and soil advice.
 */

import {ai} from '@/ai/genkit';

export async function getFertilizerAndSoilAdvice(input) {
  return fertilizerAndSoilAdviceFlow(input);
}

const fertilizerAndSoilAdviceFlow = ai.defineFlow(
  {
    name: 'fertilizerAndSoilAdviceFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    const suggestions = {
      fertilizerSuggestions: [
        {
          suggestion:
            'Based on your crop, apply a basal dose of 50kg DAP and 25kg Muriate of Potash (MOP) per acre.',
        },
        {
          suggestion:
            'Top-dress with 40kg of Urea per acre after 25-30 days of sowing.',
        },
      ],
      soilImprovementSuggestions: [
        {
          suggestion:
            'Incorporate farmyard manure (FYM) or compost at 5 tons per acre to improve soil organic matter.',
        },
        {
          suggestion:
            "Practice crop rotation with legumes like gram or moong to naturally fix nitrogen in the soil.",
        },
      ],
    };

    if (input.organicPreference === 'Yes') {
       suggestions.fertilizerSuggestions = [{ suggestion: "Use vermicompost (500kg/acre) and neem cake (100kg/acre) as a basal dose."}];
       suggestions.soilImprovementSuggestions.push({ suggestion: "Consider green manuring with Dhaincha before the main crop season." });
    }

    return suggestions;
  }
);
