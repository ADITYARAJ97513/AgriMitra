'use server';

/**
 * @fileOverview An AI agent that provides weather alerts and recommendations tailored to specific crops.
 *
 * - getWeatherAlerts - A function that returns weather alerts and recommendations.
 */

import {ai} from '@/ai/genkit';
import { getWeatherForecast } from '@/services/weather';
import { z } from 'zod';

export async function getWeatherAlerts(input) {
  return weatherWatchFlow(input);
}

const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Gets the weather forecast for a specified location for the next 3 to 7 days.',
    inputSchema: z.object({
      location: z.string().describe("The city and state to get the weather forecast for, e.g., \"Ranchi, Jharkhand\".")
    }),
    outputSchema: z.object({
        temperature: z.number().describe("The average temperature in Celsius."),
        precipitation: z.string().describe("The type of precipitation expected (e.g., 'None', 'Light Rain', 'Heavy Rain')."),
        windSpeed: z.number().describe("The wind speed in km/h."),
        humidity: z.number().describe("The humidity in percentage."),
        summary: z.string().describe("A brief summary of the weather conditions.")
    }),
  },
  async ({ location }) => {
    return getWeatherForecast(location);
  }
);


const weatherAlertsPrompt = ai.definePrompt({
  name: 'weatherAlertsPrompt',
  tools: [getWeatherForecastTool],
  prompt: `You are an AI Agritech Expert for Indian farmers. Your goal is to provide a single, clear, detailed, and actionable weather report in simple Hinglish.

  **Your Task:**
  1.  **Get Forecast:** Use the 'getWeatherForecast' tool to get the complete weather forecast for the specified 'location'.
  2.  **Synthesize and Summarize:** Analyze all the forecast data (temperature, precipitation, wind, humidity, and the text summary from the tool). Create a single, cohesive paragraph for the \`overallSummary\`. This summary is the most important part. It must not contain contradictions. For example, if heavy rain is predicted, the summary should focus on that, mentioning how the temperature might be affected by the rain. If it's hot and dry, focus on the heatwave.
  3.  **Provide Actionable Advice:** Based on your \`overallSummary\`, provide a list of clear, practical \`recommendations\` for the farmer. All recommendations must logically follow from the summary. If you warned about rain, the advice should be about drainage, not irrigation for heat.
  4.  **Tailor for Crop:** If a 'cropPlanned' is provided, make sure your summary and recommendations are tailored to that specific crop's needs.
  5.  **Be Encouraging:** End with a friendly, motivational message.

  **Farmer's Inputs:**
  -   Location: {{{location}}}
  -   Alert Type Requested: {{{alertType}}}
  -   Forecast Period: {{{dateRange}}}
  -   Crop Planned (Optional): {{{cropPlanned}}}

  Your final output must be a single, valid JSON object with the keys "reportTitle", "overallSummary", "recommendations" (an array of strings), and "motivationalMessage". Do not include any other text or markdown formatting.
  `,
});

const weatherWatchFlow = ai.defineFlow(
  {
    name: 'weatherWatchFlow',
  },
  async input => {
    const { text } = await weatherAlertsPrompt(input);
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
