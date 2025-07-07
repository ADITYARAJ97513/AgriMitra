'use server';

/**
 * @fileOverview An AI agent that provides yield estimation and market advice for farmers using OpenRouter.
 */

import { z } from 'zod';

// ✅ Input Schema
const MarketAndYieldForecastInputSchema = z.object({
  cropName: z.string(),
  location: z.string(),
  landSize: z.string(),
  farmingMethod: z.string(),
  expectedHarvestMonth: z.string(),
  cropVariety: z.string().optional(),
  inputCosts: z.string().optional(),
  mandiPreference: z.string().optional(),
});

// ✅ Output Schema
const MarketAndYieldForecastOutputSchema = z.object({
  yieldEstimation: z.string(),
  marketAdvice: z.string(),
  profitAnalysis: z.string(),
});

// ✅ Main Exported Function
export async function marketAndYieldForecast(input) {
  const validation = MarketAndYieldForecastInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: '❌ Invalid input provided.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in .env file.' };
  }

  try {
    return await marketAndYieldForecastFlow(input);
  } catch (e) {
    console.error('❌ OpenRouter Error:', e);
    return {
      error: '❌ Could not connect to AI service. Check logs or API key.',
    };
  }
}

// ✅ OpenRouter Logic — English Only & Safe Parsing
const marketAndYieldForecastFlow = async (input) => {
  const prompt = `
You are an agricultural market and yield advisor in India. A farmer shared this:

- Crop: ${input.cropName}
${input.cropVariety ? `- Variety: ${input.cropVariety}` : ''}
- Location: ${input.location}
- Land Size: ${input.landSize} acres
- Farming Method: ${input.farmingMethod}
- Expected Harvest Month: ${input.expectedHarvestMonth}
${input.inputCosts ? `- Input Costs: Rs. ${input.inputCosts}` : ''}
${input.mandiPreference ? `- Preferred Mandi: ${input.mandiPreference}` : ''}

Your job:
1. Estimate the yield per acre in quintals or tons.
2. Give market advice (expected price, demand, whether to store/sell).
3. If input cost is provided, estimate profit = (yield x price) - cost.

❗ Use only **simple English**. No Hindi. No Hinglish. Be clear and helpful.

Respond only in this exact JSON structure:

{
  "yieldEstimation": "...",
  "marketAdvice": "...",
  "profitAnalysis": "..."
}
`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful agricultural assistant for Indian farmers. Use only simple English.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const raw = await res.text();
  console.log('🔍 OpenRouter Raw Response:', raw);

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  try {
    const parsed = JSON.parse(raw);
    const content = parsed.choices?.[0]?.message?.content ?? '{}';

    const sanitized = content
      .replace(/[\b\f\n\r\t\v]/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .trim();

    const final = JSON.parse(sanitized);

    return MarketAndYieldForecastOutputSchema.parse(final);
  } catch (err) {
    console.error('❌ Failed to parse OpenRouter response:', err);
    return {
      yieldEstimation: '❌ Failed to parse AI response.',
      marketAdvice: '',
      profitAnalysis: '',
    };
  }
};
