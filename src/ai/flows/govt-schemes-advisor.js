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

const govtSchemesAdvisorFlow = ai.defineFlow(
  {
    name: 'govtSchemesAdvisorFlow',
  },
  async (input) => {
    // Return mock data instead of calling the AI
    return {
        schemes: [
            {
                name: "PM-Kisan Samman Nidhi",
                summary: "Provides income support of Rs. 6,000 per year in three equal installments to all landholding farmer families.",
                eligibility: "All landholding farmer families in the country, irrespective of their land size.",
                howToApply: "1. Register on the official PM-KISAN portal (pmkisan.gov.in).\n2. You can also visit your nearest Common Service Centre (CSC) for registration.\n3. Required documents include Aadhar card and bank account details."
            },
            {
                name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                summary: "Provides insurance coverage and financial support to farmers in the event of failure of any of the notified crops as a result of natural calamities, pests, or diseases.",
                eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.",
                howToApply: "Enroll through your lending bank, a registered insurance company, or your nearest Common Service Centre (CSC) at the beginning of the crop season."
            }
        ]
    };
  }
);
