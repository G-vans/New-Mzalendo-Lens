
import { GoogleGenAI, Type } from "@google/genai";
import { BillAnalysis, FileData } from "../types";

export const analyzeBillSource = async (
  text?: string, 
  file?: FileData
): Promise<BillAnalysis> => {
  // Using a local variable to ensure the definition from vite.config.ts is captured
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING: The API key is not configured in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const parts: any[] = [];

  if (text) {
    parts.push({ text: `Analyze this bill text: ${text}` });
  }

  if (file) {
    parts.push({
      inlineData: {
        data: file.base64,
        mimeType: file.mimeType
      }
    });
    parts.push({ text: "Read the attached document and analyze the legislative content." });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction: `You are a savvy Kenyan civic educator. 
      Your goal is to explain complex legislation in 'Gen-Z' and 'Early Professional' Kenyan language. 
      Requirements: 1. summary (1 sentence), 2. detailedSummary (structured), 3. impactCards (exactly 3), 4. quiz (exactly 3).
      Tone: Informative, empathetic, slightly witty but respectful.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          detailedSummary: { type: Type.STRING },
          impactCards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                icon: { type: Type.STRING },
                category: { 
                    type: Type.STRING, 
                    enum: ['Salary', 'Fuel', 'Food', 'Business', 'Digital', 'Other'] 
                }
              },
              required: ["title", "description", "icon", "category"],
            },
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
            minItems: 3,
            maxItems: 3,
          },
        },
        required: ["summary", "detailedSummary", "impactCards", "quiz"],
      },
    },
  });

  const textOutput = response.text;
  if (!textOutput) {
    throw new Error("EMPTY_RESPONSE: The AI could not process this document.");
  }

  return JSON.parse(textOutput.trim()) as BillAnalysis;
};
