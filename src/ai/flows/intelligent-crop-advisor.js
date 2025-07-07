'use server';
import { z } from 'zod';

// ✅ Input Schema
const RecommendCropsInputSchema = z.object({
  location: z.string(),
  soilType: z.string(),
  season: z.string(),
  landSize: z.string(),
  irrigationAvailable: z.string(),
  budgetLevel: z.string(),
  preferredCrops: z.string().optional(),
  pastCrops: z.string().optional(),
});

// ✅ Output Schema
const RecommendCropsOutputSchema = z.object({
  crops: z.array(z.string()),
  fertilizerSuggestions: z.string(),
  pestDiseaseControl: z.string(),
  weatherPrecautions: z.string(),
  estimatedYield: z.string(),
  marketAdvice: z.string(),
  motivationalMessage: z.string(),
});

// ✅ Main Export
export async function recommendCrops(input) {
  const validation = RecommendCropsInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: '❌ Invalid input. Please check the fields.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in environment.' };
  }

  try {
    return await recommendCropsFlow(input);
  } catch (e) {
    console.error('❌ OpenRouter Error:', e);
    return {
      error: '❌ Failed to communicate with AI. Please try again.',
    };
  }
}

// ✅ OpenRouter Logic
const recommendCropsFlow = async (input) => {
  const prompt = `
You are an Indian agricultural advisor. A farmer shared these details:

- Location: ${input.location}
- Soil Type: ${input.soilType}
- Season: ${input.season}
- Land Size: ${input.landSize} acres
- Irrigation Available: ${input.irrigationAvailable}
- Budget Level: ${input.budgetLevel}
${input.preferredCrops ? `- Preferred Crops: ${input.preferredCrops}` : ''}
${input.pastCrops ? `- Past Crops: ${input.pastCrops}` : ''}

Please give:
1. 3–4 crop suggestions that fit this situation.
2. Fertilizer advice for the top crop.
3. Common pest and disease protection tips.
4. Seasonal weather precautions.
5. Estimated yield for the top crop.
6. Tips on where and when to sell.
7. A motivational message.

⚠️ Important:
- Use only **simple and clear English**.
- Do **not** use Hindi or regional language.
- Keep sentences short and easy for small farmers to understand.

Return your answer in **this exact JSON format**:
{
  "crops": ["...", "..."],
  "fertilizerSuggestions": "...",
  "pestDiseaseControl": "...",
  "weatherPrecautions": "...",
  "estimatedYield": "...",
  "marketAdvice": "...",
  "motivationalMessage": "..."
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
          content: `You are a helpful agriculture assistant for Indian farmers. 
          Use **only English**. 
          Make sure your words are **simple** and **clear**. 
          Avoid using Hindi. Keep advice short and practical.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const raw = await res.text();
  const parsed = JSON.parse(raw);
  const content = parsed.choices?.[0]?.message?.content ?? '{}';

  // ✅ Sanitize JSON
  const sanitized = content
    .replace(/[\b\f\n\r\t\v]/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .trim();

  try {
    const final = JSON.parse(sanitized);
    return RecommendCropsOutputSchema.parse(final);
  } catch (err) {
    console.error('❌ JSON parse or validation failed:', err);
    return {
      crops: ['❌ Could not parse AI response.'],
      fertilizerSuggestions: '',
      pestDiseaseControl: '',
      weatherPrecautions: '',
      estimatedYield: '',
      marketAdvice: '',
      motivationalMessage: '',
    };
  }
};
