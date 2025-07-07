'use server';

import { z } from 'zod';

// ✅ Input validation schema
const DetectPlantDiseaseInputSchema = z.object({
  cropType: z.string(),
  growthStage: z.string(),
  symptomsObserved: z.string(),
  location: z.string().optional().or(z.literal('')),
});

// ✅ Output schema
const DetectPlantDiseaseOutputSchema = z.object({
  disease: z.string(),
  description: z.string(),
  solution: z.union([z.string(), z.object(), z.array(z.string())]),
  motivationalMessage: z.string(),
});

export async function detectPlantDisease(input) {
  console.log("🧪 [AI] Received input:", input);

  const validation = DetectPlantDiseaseInputSchema.safeParse(input);
  console.log("🧪 [AI] Zod Validation Result:", validation);

  if (!validation.success) {
    return { error: '❌ Invalid input. Please check all fields.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in .env file.' };
  }

  const prompt = `
You are an expert plant pathologist. Based on the crop type, growth stage, and symptoms, diagnose the most likely disease and recommend solutions.

Farmer Input:
- Crop: ${input.cropType}
- Growth Stage: ${input.growthStage}
- Symptoms: ${input.symptomsObserved}
${input.location ? `- Location: ${input.location}` : ''}

Please respond in **this exact JSON** format:

{
  "disease": "Name of the disease or 'Healthy' or 'Unknown'",
  "description": "Explain the disease or say no symptoms detected",
  "solution": "List steps for organic and chemical treatment if applicable",
  "motivationalMessage": "Encourage the farmer in a friendly tone"
}
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'You are a helpful plant doctor for Indian farmers.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const raw = await response.text();
    const parsed = JSON.parse(raw);
    const content = parsed.choices?.[0]?.message?.content ?? '{}';

    const sanitized = content
      .replace(/[\b\f\n\r\t\v]/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .trim();

    let final = {};
    try {
      final = JSON.parse(sanitized);
    } catch (err) {
      console.error('❌ Failed to parse sanitized JSON:', err);
      return { error: 'AI returned invalid data. Please try again.' };
    }

    const clean = {
      ...final,
      solution:
        typeof final.solution === 'string'
          ? final.solution
          : JSON.stringify(final.solution, null, 2),
    };

    return DetectPlantDiseaseOutputSchema.parse(clean);
  } catch (e) {
    console.error('❌ Disease Detection Error:', e);
    return {
      error: 'Could not analyze the disease. Please try again.',
    };
  }
}
