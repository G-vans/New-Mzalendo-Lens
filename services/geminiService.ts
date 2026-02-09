
import { GoogleGenAI, Type } from "@google/genai";
import { BillAnalysis, FileData } from "../types";

export const analyzeBillSource = async (
  text?: string, 
  file?: FileData
): Promise<BillAnalysis> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: Please check your environment variables in Vercel.");
  }

  // Create a fresh instance for the call
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
      
      Requirements:
      1. summary: A concise 1-sentence 'vibe check' of the bill.
      2. detailedSummary: A comprehensive, structured breakdown. Use bullet points.
      3. impactCards: Identify 3 specific impact areas.
      4. quiz: Create exactly 3 multiple-choice questions with a PROGRESSIVE DIFFICULTY curve.
      
      Use local examples (e.g., M-Pesa, fuel at Shell/Rubis, rent in Roysambu).
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
