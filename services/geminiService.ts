import { GoogleGenAI, Type } from "@google/genai";
import { BillAnalysis, FileData } from "../types";

const schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A punchy, 2-sentence summary of the bill in slang/Gen Z friendly language.",
    },
    detailedSummary: {
      type: Type.STRING,
      description: "A comprehensive breakdown of the bill's implications.",
    },
    impactCards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING, description: "A single emoji representing the impact." },
          category: { 
            type: Type.STRING, 
            enum: ['Salary', 'Fuel', 'Food', 'Business', 'Digital', 'Other'] 
          }
        },
        required: ["title", "description", "icon", "category"]
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctIndex: { type: Type.NUMBER },
          explanation: { type: Type.STRING, description: "A witty, educational explanation." }
        },
        required: ["question", "options", "correctIndex", "explanation"]
      }
    }
  },
  required: ["summary", "detailedSummary", "impactCards", "quiz"]
};

export const analyzeBillSource = async (
  text?: string, 
  file?: FileData
): Promise<BillAnalysis> => {
  // Use import.meta.env.VITE_API_KEY for Vite (browser-accessible env vars must be prefixed with VITE_)
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API key is missing. Please set VITE_API_KEY in your .env.local file.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const promptParts: any[] = [];
  if (text) promptParts.push({ text: `Analyze this text: ${text}` });
  if (file) {
    promptParts.push({
      inlineData: {
        data: file.base64,
        mimeType: file.mimeType
      }
    });
  }
  
  promptParts.push({ 
    text: "Break this bill down for young Kenyans. Use a witty, informative tone. Focus on cost of living and digital rights." 
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: promptParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are 'Mzalendo AI', a savvy Kenyan civic educator translating complex bills into plain, punchy language for Gen Z."
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("The AI returned an empty response. Check if content violates safety filters.");
  }

  try {
    // Robustly handle cases where the model might wrap JSON in markdown blocks
    const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedJson) as BillAnalysis;
  } catch (e) {
    console.error("JSON Parse Error. Raw response:", rawText);
    throw new Error("Failed to decode the analysis. The bill segment might be too complex or fragmented.");
  }
};