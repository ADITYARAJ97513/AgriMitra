import { detectPlantDisease } from '@/ai/flows/plant-disease-detector';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🧪 Received API body:", body);

    const result = await detectPlantDisease(body);

    if (result?.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ API route error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
