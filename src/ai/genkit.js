import {genkit} from 'genkit';
// We are removing the googleAI plugin to run the app without an API key.
// AI flows will return mock data instead.
// import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  // plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
});
