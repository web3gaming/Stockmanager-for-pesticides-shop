
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAgriculturalAdvice = async (query: string, inventory: Product[]) => {
  const model = 'gemini-3-flash-preview';
  
  const inventorySummary = inventory.map(p => `${p.name} (${p.category}) - Stock: ${p.stock}`).join(', ');

  const systemInstruction = `
    You are an expert Agricultural Consultant specializing in Pakistani crops (Cotton, Wheat, Rice, Sugarcane).
    You are assisting Ishrat Ullah Khan, the owner of 'Insaaf Zarai Markaz'.
    Based on the available inventory: [${inventorySummary}], provide advice on:
    1. Pest control for current season crops in Pakistan.
    2. Which products in the inventory should be recommended for specific issues.
    3. Warning about expired or low-stock products if relevant.
    Keep the tone professional, helpful, and localized for Pakistan. Use Urdu terms where appropriate (e.g., 'Sundi', 'Telay', 'Khaad').
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf kijiye, system me masla hai. Please try again later.";
  }
};

export const getInventoryAnalysis = async (inventory: Product[]) => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this inventory for a Pakistani pesticide shop and give 3 actionable business insights: ${JSON.stringify(inventory)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["insights"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{"insights":[]}');
  } catch {
    return { insights: ["Stock levels are normal.", "Focus on seasonal seeds.", "Check expiry dates regularly."] };
  }
};
