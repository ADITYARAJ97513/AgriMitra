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

const weatherWatchFlow = ai.defineFlow(
  {
    name: 'weatherWatchFlow',
  },
  async ({location, cropPlanned}) => {
    // Call the mock service directly, bypassing the AI
    const forecast = await getWeatherForecast(location || "default");

    const recommendations = [];
    if (forecast.precipitation === 'Heavy Rain') {
        recommendations.push("Ensure proper drainage in fields to avoid waterlogging.");
        recommendations.push("Postpone spraying of pesticides or fertilizers.");
    } else if (forecast.temperature > 35) {
        recommendations.push("Ensure adequate irrigation to prevent heat stress to crops.");
        if(cropPlanned) {
             recommendations.push(`For ${cropPlanned}, consider applying a light mulch to retain soil moisture.`);
        }
    } else {
        recommendations.push("Weather conditions seem favorable. Continue with normal farm operations.");
    }

    return {
        reportTitle: `Weather Forecast for ${location}`,
        overallSummary: `The forecast shows ${forecast.summary.toLowerCase()} with an average temperature of ${forecast.temperature}°C.`,
        recommendations: recommendations,
        motivationalMessage: "Stay prepared, stay safe. A well-informed farmer is a successful farmer!"
    };
  }
);
