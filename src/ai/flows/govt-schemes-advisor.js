'use server';
/**
 * @fileOverview An AI agent that suggests relevant government schemes for farmers in India.
 *
 * - getGovtSchemes - A function that suggests relevant government schemes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetGovtSchemesInputSchema = z.object({
  state: z.string().describe("The farmer's state of residence."),
  landholdingSize: z.string().describe('The size of landholding in acres.'),
  cropsGrown: z.string().describe('The main crops grown by the farmer.'),
  farmerCategory: z.string().describe('The category of the farmer (e.g., Small and Marginal, Medium, Large).'),
});

const GetGovtSchemesOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string().describe('The official name of the government scheme.'),
      summary: z.string().describe('A brief summary of what the scheme provides.'),
      eligibility: z.string().describe('Key eligibility criteria for the scheme.'),
      howToApply: z.string().describe('A simple step-by-step guide on how to apply.'),
    })
  ).describe('A list of 2-3 relevant government schemes.'),
});

export async function getGovtSchemes(input) {
  return govtSchemesAdvisorFlow(input);
}

const govtSchemesAdvisorPrompt = ai.definePrompt({
  name: 'govtSchemesAdvisorPrompt',
  input: { schema: GetGovtSchemesInputSchema },
  output: { schema: GetGovtSchemesOutputSchema },
  prompt: `You are an advisor specializing in Indian government agricultural schemes. Based on the farmer's profile below, identify and detail 2-3 of the most relevant central or state-specific schemes.

  **Farmer Profile:**
  - State: {{{state}}}
  - Landholding Size: {{{landholdingSize}}} acres
  - Crops Grown: {{{cropsGrown}}}
  - Farmer Category: {{{farmerCategory}}}

  **Your Task:**
  For each recommended scheme, provide:
  1.  **Name**: The official scheme name.
  2.  **Summary**: A simple one-sentence summary.
  3.  **Eligibility**: The main eligibility points relevant to this farmer.
  4.  **How to Apply**: A clear, step-by-step application process.
  
  Focus on the most impactful and relevant schemes. For example, if the farmer grows specific crops, look for crop-related insurance or subsidy schemes. If they are a small farmer, highlight schemes like PM-KISAN.

  Provide the output in a structured JSON format.`,
});

const govtSchemesAdvisorFlow = ai.defineFlow(
  {
    name: 'govtSchemesAdvisorFlow',
    inputSchema: GetGovtSchemesInputSchema,
    outputSchema: GetGovtSchemesOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: govtSchemesAdvisorPrompt,
      model: 'googleai/gemini-1.5-flash-latest',
      input: input,
    });
    return output;
  }
);
