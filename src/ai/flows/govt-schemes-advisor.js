'use server';
import { z } from 'zod';

// ✅ Input Schema
const GetGovtSchemesInputSchema = z.object({
  state: z.string(),
  landholdingSize: z.string(),
  cropsGrown: z.string(),
  farmerCategory: z.string(),
});

// ✅ Output Schema
const GetGovtSchemesOutputSchema = z.object({
  schemes: z.array(
    z.object({
      name: z.string(),
      summary: z.string(),
      eligibility: z.string(),
      howToApply: z.string(),
    })
  ),
});

// ✅ Public export
export async function getGovtSchemes(input) {
  const validation = GetGovtSchemesInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: '❌ Invalid input provided. Please check the fields.' };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return { error: '❌ Missing OPENROUTER_API_KEY in .env file.' };
  }

  try {
    return await govtSchemesAdvisorFlow(input);
  } catch (e) {
    console.error('❌ OpenRouter Error:', e);
    return {
      error: '❌ Failed to connect to the AI service. Please try again later.',
    };
  }
}

// ✅ Internal AI call function
const govtSchemesAdvisorFlow = async (input) => {
  const prompt = `
You are an expert in Indian government schemes for agriculture. A farmer has shared the following:

- State: ${input.state}
- Land Size: ${input.landholdingSize} acres
- Crops: ${input.cropsGrown}
- Farmer Category: ${input.farmerCategory}

Your task is to:
1. Suggest 2–3 government schemes (state or central) that are helpful to this farmer.
2. Use **only clear and simple English**. Avoid Hindi or mixed Hindi-English.
3. Keep the response short and easy to understand for rural farmers.

Respond ONLY in this strict JSON format:
{
  "schemes": [
    {
      "name": "Scheme Name",
      "summary": "What benefits this scheme gives.",
      "eligibility": "Who can apply.",
      "howToApply": "Simple steps to apply."
    },
    ...
  ]
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
          content: 'You are a kind government scheme advisor who speaks only in clear English for Indian farmers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const raw = await res.text();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to parse full AI response:', err);
    return {
      schemes: [
        {
          name: '❌ Invalid AI response',
          summary: 'Unable to parse AI output.',
          eligibility: 'N/A',
          howToApply: 'N/A',
        },
      ],
    };
  }

  const content = parsed.choices?.[0]?.message?.content ?? '{}';

  const sanitized = content
    .replace(/[\b\f\n\r\t\v]/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .trim();

  try {
    const final = JSON.parse(sanitized);
    return GetGovtSchemesOutputSchema.parse(final);
  } catch (err) {
    console.error('❌ Failed to parse OpenRouter response:', err);
    return {
      schemes: [
        {
          name: '❌ Parsing Error',
          summary: 'Sorry, could not understand the AI response.',
          eligibility: 'N/A',
          howToApply: 'N/A',
        },
      ],
    };
  }
};
