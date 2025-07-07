'use server';
import { z } from 'zod';

// ✅ Input Schema
const FertilizerAndSoilAdviceInputSchema = z.object({
  cropSelected: z.string(),
  soilType: z.string(),
  landSize: z.string(),
  organicPreference: z.string(),
  recentFertilizerUsed: z.string().optional(),
  soilTestAvailable: z.string(),
  nitrogenLevel: z.number().optional(),
  phosphorusLevel: z.number().optional(),
  potassiumLevel: z.number().optional(),
  pH: z.number().optional(),
});

// ✅ Output Schema
const FertilizerAndSoilAdviceOutputSchema = z.object({
  fertilizerSuggestions: z.array(z.object({ suggestion: z.string() })),
  soilImprovementSuggestions: z.array(z.object({ suggestion: z.string() })),
});

// ✅ Main Function
export async function getFertilizerAndSoilAdvice(input) {
  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in environment.' };
  }

  try {
    return await fertilizerAndSoilAdviceFlow(input);
  } catch (e) {
    console.error('❌ OpenRouter API Error:', e);
    return {
      error: '❌ Failed to connect to AI. Please try again later.',
    };
  }
}

// ✅ AI Call to OpenRouter
const fertilizerAndSoilAdviceFlow = async (input) => {
  const prompt = `
You are an Indian soil and fertilizer expert. A farmer has shared the following:

- Crop: ${input.cropSelected}
- Soil Type: ${input.soilType}
- Land Size: ${input.landSize} acres
- Organic Preference: ${input.organicPreference}
${input.recentFertilizerUsed ? `- Recently Used Fertilizers: ${input.recentFertilizerUsed}` : ''}

Soil Test:
- Available: ${input.soilTestAvailable}
${input.nitrogenLevel ? `- Nitrogen: ${input.nitrogenLevel} kg/ha` : ''}
${input.phosphorusLevel ? `- Phosphorus: ${input.phosphorusLevel} kg/ha` : ''}
${input.potassiumLevel ? `- Potassium: ${input.potassiumLevel} kg/ha` : ''}
${input.pH ? `- Soil pH: ${input.pH}` : ''}

Your task:
1. Suggest 2–3 fertilizer ideas (organic or chemical, depending on preference).
2. Give 2–3 tips to improve soil health long term.

🧠 Important:
- Use **simple English only**
- Do not use Hindi or any mixed language
- Keep suggestions clear and practical
- Reply only in this exact JSON format:

{
  "fertilizerSuggestions": [
    { "suggestion": "..." },
    { "suggestion": "..." }
  ],
  "soilImprovementSuggestions": [
    { "suggestion": "..." },
    { "suggestion": "..." }
  ]
}
`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          content: 'You are a kind and clear-speaking farming assistant for Indian farmers. Use only simple English.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const raw = await response.text();
  const parsed = JSON.parse(raw);
  const content = parsed.choices?.[0]?.message?.content ?? '{}';

  // ✅ Clean and sanitize JSON response
  const sanitized = content
    .replace(/[\b\f\n\r\t\v]/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .trim();

  try {
    const final = JSON.parse(sanitized);
    return FertilizerAndSoilAdviceOutputSchema.parse(final);
  } catch (err) {
    console.error('⚠️ Failed to parse OpenRouter response:', err);
    return {
      fertilizerSuggestions: [{ suggestion: '❌ Sorry, could not understand the AI response.' }],
      soilImprovementSuggestions: [],
    };
  }
};
