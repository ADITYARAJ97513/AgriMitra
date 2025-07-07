'use server';
import { z } from 'zod';

// ✅ Input Schema
const PestAndDiseaseAIInputSchema = z.object({
  cropType: z.string(),
  growthStage: z.string(),
  symptomsObserved: z.string(),
  organicPreference: z.string(),
  weatherConditions: z.string().optional(),
  chemicalsUsedEarlier: z.string().optional(),
});

// ✅ Output Schema
const PestAndDiseaseAIOutputSchema = z.object({
  pestThreats: z.array(z.string()),
  diseaseThreats: z.array(z.string()),
  preventativeMeasures: z.array(z.string()),
  organicTreatments: z.array(z.string()),
  chemicalTreatments: z.array(z.string()),
});

// ✅ Main Function
export async function pestAndDiseaseAI(input) {
  const validation = PestAndDiseaseAIInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: '❌ Invalid input provided.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in .env file.' };
  }

  try {
    return await pestAndDiseaseFlow(input);
  } catch (e) {
    console.error('❌ OpenRouter Error:', e);
    return {
      error: 'An error occurred while communicating with the AI service. Please check the logs or API key.',
    };
  }
}

// ✅ AI Flow Function
const pestAndDiseaseFlow = async (input) => {
  const prompt = `
You are a pest and plant disease expert helping Indian farmers.

A farmer is growing ${input.cropType} crop. Please identify possible threats and prevention methods based on the report below:

- Growth Stage: ${input.growthStage}
- Symptoms: ${input.symptomsObserved}
- Organic Preference: ${input.organicPreference}
${input.weatherConditions ? `- Weather Conditions: ${input.weatherConditions}` : ''}
${input.chemicalsUsedEarlier ? `- Previously Used Chemicals: ${input.chemicalsUsedEarlier}` : ''}

Your response must be in **simple English only**, no Hindi. Avoid complex terms. Keep it clear and easy for rural farmers to follow.

Return response in this JSON format exactly:

{
  "pestThreats": ["..."],
  "diseaseThreats": ["..."],
  "preventativeMeasures": ["..."],
  "organicTreatments": ["..."],
  "chemicalTreatments": ["..."]
}
Only return the JSON. No explanation.`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'You are a helpful agricultural assistant. Use only simple English.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const raw = await res.text();
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

    let final;
    try {
      final = JSON.parse(sanitized);
    } catch (err) {
      console.error('❌ Cleaned JSON parse error:', err);
      return {
        error: 'AI returned badly formatted data. Please try again.',
      };
    }

    const stringifyArray = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
        : [];

    const cleanOutput = {
      pestThreats: stringifyArray(final.pestThreats),
      diseaseThreats: stringifyArray(final.diseaseThreats),
      preventativeMeasures: stringifyArray(final.preventativeMeasures),
      organicTreatments: stringifyArray(final.organicTreatments),
      chemicalTreatments: stringifyArray(final.chemicalTreatments),
    };

    return PestAndDiseaseAIOutputSchema.parse(cleanOutput);
  } catch (err) {
    console.error('❌ Final Output Parse Error:', err);
    return {
      error: 'Something went wrong while processing AI response.',
    };
  }
};
