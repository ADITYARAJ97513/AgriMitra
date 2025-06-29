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

const prompt = ai.definePrompt({
  name: 'pestAndDiseasePrompt',
  prompt: `You are an AI Agritech Expert diagnosing crop issues for farmers in India. Your advice should be practical, effective, and budget-friendly, delivered in simple Hinglish.

  Based on the following inputs, identify potential pest and disease threats and suggest treatments.

  - Crop Type: {{{cropType}}}
  - Growth Stage: {{{growthStage}}}
  - Symptoms Observed: {{{symptomsObserved}}}
  - Weather Conditions: {{{weatherConditions}}}
  - Chemicals Used Recently: {{{chemicalsUsedEarlier}}}
  - Prefers Organic Solutions: {{{organicPreference}}}

  Your response should:
  - First, identify the most likely pests and diseases.
  - Then, provide a list of preventative measures.
  - Finally, suggest treatment options. If 'organicPreference' is 'Yes', prioritize organic solutions. If 'No', provide both organic and effective chemical options.
  
  Structure the output as a single, valid JSON object with the keys: "pestThreats", "diseaseThreats", "preventativeMeasures", "organicTreatments", "chemicalTreatments". Each key should hold an array of strings. Do not include any other text or markdown formatting.
`,
});

const pestAndDiseaseFlow = ai.defineFlow(
  {
    name: 'pestAndDiseaseFlow',
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
