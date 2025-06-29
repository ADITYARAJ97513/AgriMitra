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

const prompt = ai.definePrompt({
  name: 'fertilizerAndSoilAdvicePrompt',
  prompt: `You are an AI Agritech Expert helping farmers in India. Your advice should be practical, clear, and easy to understand, using simple Hinglish.

  Based on the following inputs, generate tailored fertilizer and soil improvement suggestions.

  - Crop to be grown: {{{cropSelected}}}
  - Soil Type: {{{soilType}}}
  - Land Size: {{{landSize}}} acres
  - Prefers Organic Solutions: {{{organicPreference}}}
  - Recent Fertilizer Used: {{{recentFertilizerUsed}}}
  - Soil Test Available: {{{soilTestAvailable}}}

  {{#if pH}}
  Soil Test Results:
  - Nitrogen: {{{nitrogenLevel}}} kg/ha
  - Phosphorus: {{{phosphorusLevel}}} kg/ha
  - Potassium: {{{potassiumLevel}}} kg/ha
  - pH: {{{pH}}}
  {{/if}}

  If soil test results are available, provide precise nutrient recommendations. If not, give general advice based on the crop and soil type.
  If organic preference is 'Yes', prioritize organic and sustainable methods.

  Provide your response as a single, valid JSON object with two keys: "fertilizerSuggestions" and "soilImprovementSuggestions". Do not include any other text or markdown formatting.`,
});

const fertilizerAndSoilAdviceFlow = ai.defineFlow(
  {
    name: 'fertilizerAndSoilAdviceFlow',
  },
  async input => {
    const { text } = await prompt(input);
    if (!text) {
      throw new Error("AI returned no response.");
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      // In case the model doesn't return valid JSON, we'll try to extract it.
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse AI response.");
    }
  }
);
