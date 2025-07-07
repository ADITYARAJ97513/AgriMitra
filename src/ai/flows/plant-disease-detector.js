'use server';

import { z } from 'zod';

// ✅ Input Schema
const DetectPlantDiseaseInputSchema = z.object({
  cropType: z.string(),
  growthStage: z.string(),
  symptomsObserved: z.string(),
  location: z.string().optional().or(z.literal('')),
});

// ✅ Output Schema
const DetectPlantDiseaseOutputSchema = z.object({
  disease: z.string(),
  description: z.string(),
  solution: z.string(),
  motivationalMessage: z.string(),
});

// ✅ Main Function
export async function detectPlantDisease(input) {
  console.log('🧪 [AI] Received input:', input);

  const validation = DetectPlantDiseaseInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: '❌ Invalid input. Please check all fields.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in .env file.' };
  }

  const prompt = `
You are a plant disease expert who helps Indian farmers. Based on the following input:

- Crop: ${input.cropType}
- Growth Stage: ${input.growthStage}
- Symptoms: ${input.symptomsObserved}
${input.location ? `- Location: ${input.location}` : ''}

Provide advice using **only clear and simple English**. No Hindi or Hinglish. Use farmer-friendly wording.

Respond only in this **exact JSON format**:

{
  "disease": "Name of the disease or 'Healthy' or 'Unknown'",
  "description": "Short explanation of the disease in simple English",
  "solution": "Step-by-step treatment (organic + chemical if needed)",
  "motivationalMessage": "Short, positive encouragement for the farmer"
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
          {
            role: 'system',
            content: 'You are a friendly plant doctor for Indian farmers. Only use clear, simple English.',
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

    // ✅ Clean up escaped or broken text
    const sanitized = content
      .replace(/[\b\f\n\r\t\v]/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, ' ')
      .trim();

    let final;
    try {
      final = JSON.parse(sanitized);
    } catch (err) {
      console.error('❌ Failed to parse sanitized JSON:', err);
      return { error: '⚠️ AI response could not be understood. Please try again.' };
    }

    // ✅ Force `solution` to always be a string
    const cleanOutput = {
      disease: final.disease ?? '',
      description: final.description ?? '',
      solution:
        typeof final.solution === 'string'
          ? final.solution
          : JSON.stringify(final.solution, null, 2),
      motivationalMessage: final.motivationalMessage ?? '',
    };

    return DetectPlantDiseaseOutputSchema.parse(cleanOutput);
  } catch (e) {
    console.error('❌ Disease Detection Error:', e);
    return {
      error: '⚠️ Could not connect to AI. Please try again later.',
    };
  }
}
