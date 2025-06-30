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

const govtSchemesAdvisorFlow = ai.defineFlow(
  {
    name: 'govtSchemesAdvisorFlow',
    inputSchema: GetGovtSchemesInputSchema,
    outputSchema: GetGovtSchemesOutputSchema,
  },
  async (input) => {
    return {
      schemes: [
        {
          name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
          summary: "Provides income support of Rs. 6,000 per year to all landholding farmer families.",
          eligibility: `Applicable to all landholding farmer families, especially beneficial for the '${input.farmerCategory}' category.`,
          howToApply: "1. Visit the official PM-KISAN portal.\n2. Click on 'New Farmer Registration'.\n3. Enter your Aadhaar number, mobile number, and state.\n4. Fill in the required details and upload land documents."
        },
        {
          name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          summary: "Provides insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.",
          eligibility: `All farmers growing notified crops like '${input.cropsGrown}' in a notified area during the season who have insurable interest in the crop are eligible.`,
          howToApply: "1. Contact your nearest bank, Primary Agricultural Credit Society (PACS), or a Common Service Center (CSC).\n2. Fill out the application form and provide details of your land and crops.\n3. Pay the nominal premium amount."
        }
      ]
    };
  }
);
