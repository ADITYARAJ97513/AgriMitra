"use server";

import { getWeatherForecast } from "@/services/weather";
import { z } from "zod";

// ✅ Input Schema
const GetWeatherAlertsInputSchema = z.object({
  location: z.string().describe("The farmer's location."),
  cropPlanned: z
    .string()
    .optional()
    .describe("The crop being planned or grown."),
});

// ✅ Output Schema
const GetWeatherAlertsOutputSchema = z.object({
  reportTitle: z.string(),
  overallSummary: z.string(),
  recommendations: z.array(z.string()),
  motivationalMessage: z.string(),
});

// ✅ Main Function
export async function getWeatherAlerts(input) {
  const validation = GetWeatherAlertsInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: "❌ Invalid input. Please check the fields." };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: "❌ Missing OPENROUTER_API_KEY in .env file." };
  }

  try {
    return await weatherWatchFlow(input);
  } catch (e) {
    console.error("❌ OpenRouter Weather AI Error:", e);
    return {
      error: "❌ Could not connect to weather AI. Please try again later.",
    };
  }
}

// ✅ Core Logic with Sanitation
const weatherWatchFlow = async ({ location, cropPlanned }) => {
  const normalizedLocation = location.trim().toLowerCase().replace(/\s+/g, " ");
  const forecast = await getWeatherForecast(normalizedLocation || "default");

  if (!forecast || !forecast.summary) {
    return {
      reportTitle: `Weather Report for ${location}`,
      overallSummary: `Sorry, weather data for "${location}" could not be fetched.`,
      recommendations: [
        "✅ Try entering a nearby city or district name.",
        "✅ Check spelling and avoid local town nicknames.",
      ],
      motivationalMessage: "Keep going! Nature rewards the patient.",
    };
  }

  const prompt = `
You are a kind weather advisor for Indian farmers.

Give weather and crop advice using only simple and clear English. Do not use Hindi or any Hindi-English mix.


- Location: ${location}
- Crop: ${cropPlanned || "Unknown"}
- Weather Summary: ${forecast.summary}
- Temperature: ${forecast.temperature}°C
- Rain/Precipitation: ${forecast.precipitation}
- Wind: ${forecast.windSpeed} km/h
- Humidity: ${forecast.humidity}%

Tasks:
1. Title like "Weather Forecast for Patna".
2. Simple explanation of the weather (rain, sun, storm, etc.).
3. 2–3 easy farming tips.
4. One motivational line.

Strictly use this JSON format:
{
  "reportTitle": "...",
  "overallSummary": "...",
  "recommendations": ["...", "..."],
  "motivationalMessage": "..."
}
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a kind weather assistant for Indian farmers. 
          Always reply using very simple and clear ENGLISH only.
          Do NOT use Hindi or Hindi-English mix.
          Keep the tone friendly, short, and easy to understand for rural farmers.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const raw = await res.text();
  console.log("🔍 OpenRouter Raw Weather Response:", raw);

  if (!res.ok) {
    throw new Error(`OpenRouter API returned status ${res.status}`);
  }

  try {
    const parsed = JSON.parse(raw);
    const content = parsed.choices?.[0]?.message?.content ?? "{}";

    const sanitized = content
      .replace(/[\b\f\n\r\t\v]/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, " ")
      .trim();

    const final = JSON.parse(sanitized);

    return GetWeatherAlertsOutputSchema.parse(final);
  } catch (err) {
    console.error("❌ Failed to parse OpenRouter response:", err);
    return {
      reportTitle: "Weather Report Unavailable",
      overallSummary: "⚠️ Could not understand AI response. Please try again.",
      recommendations: [],
      motivationalMessage: "",
    };
  }
};
