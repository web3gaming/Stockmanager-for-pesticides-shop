import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGeminiClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key missing');
  }

  return new GoogleGenerativeAI(apiKey);
}
