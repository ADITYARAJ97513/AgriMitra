'use server';
/**
 * @fileOverview An AI agent that suggests relevant government schemes for farmers in India.
 *
 * - getGovtSchemes - A function that suggests relevant government schemes.
 */

import {ai} from '@/ai/genkit';

export async function getGovtSchemes(input) {
  return govtSchemesAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'govtSchemesAdvisorPrompt',
  prompt: `You are an expert on Indian government agricultural schemes. Your task is to provide farmers with clear and actionable information about relevant schemes based on their profile.

  You have access to up-to-date information on major schemes like PM-Kisan Samman Nidhi, Pradhan Mantri Fasal Bima Yojana, Soil Health Card Scheme, Paramparagat Krishi Vikas Yojana (PKVY), and other state-specific schemes.

  Based on the farmer's details below, identify the most relevant central and state-level government schemes.

  Farmer's Profile:
  - State: {{{state}}}
  - Landholding Size: {{{landholdingSize}}} acres
  - Main Crops Grown: {{{cropsGrown}}}
  - Farmer Category: {{{farmerCategory}}}

  For each recommended scheme, provide the following details:
  1.  **name**: The official name of the scheme.
  2.  **summary**: A brief, easy-to-understand summary of its benefits.
  3.  **eligibility**: Key eligibility criteria.
  4.  **howToApply**: Simple, step-by-step instructions on how to apply, including links to official portals if available.

  Please provide the output as a single, valid JSON object with a single key "schemes", which is an array of scheme objects. Do not include any other text or markdown formatting.
  `,
});

const govtSchemesAdvisorFlow = ai.defineFlow(
  {
    name: 'govtSchemesAdvisorFlow',
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
