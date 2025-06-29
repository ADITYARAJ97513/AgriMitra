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

const prompt = ai.definePrompt({
  name: 'recommendCropsPrompt',
  prompt: `You are an AI Agritech Expert helping small and marginal farmers in India. Your goal is to provide accurate, practical, and region-specific advice in simple Hindi-English (Hinglish) so farmers can easily understand.

Based on the following inputs, generate comprehensive advice.

Input Details:
- Location: {{{location}}}
- Soil Type: {{{soilType}}}
- Current Season: {{{season}}}
- Land Size: {{{landSize}}} acres
- Irrigation Available: {{{irrigationAvailable}}}
- Budget: {{{budgetLevel}}}
- Preferred Crops (Optional): {{{preferredCrops}}}
- Past Crops (for crop rotation advice, Optional): {{{pastCrops}}}

Your answer must:
- Be in simple Hindi-English (Hinglish).
- Prioritize recommendations based on all inputs. If the user has preferred crops, evaluate their suitability first.
- If past crops are mentioned, provide crop rotation advice.
- End with a friendly motivational line.

Output the response as a single, valid JSON object with the following keys: "crops" (an array of strings), "fertilizerSuggestions", "pestDiseaseControl", "weatherPrecautions", "estimatedYield", "marketAdvice", and "motivationalMessage". Do not include any other text or markdown formatting.
`,
});

const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
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
