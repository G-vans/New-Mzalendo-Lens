
import { GoogleGenAI, Type } from "@google/genai";
import { BillAnalysis, FileData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeBillSource = async (
  text?: string, 
  file?: FileData
): Promise<BillAnalysis> => {
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
    parts.push({ text: "Read the attached document (it might be a scan or PDF) and analyze the legislative content within it." });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction: `You are a savvy Kenyan civic educator. 
      Your goal is to explain complex legislation in 'Gen-Z' and 'Early Professional' Kenyan language. 
      
      Requirements:
      1. summary: A concise 1-sentence 'vibe check' of the bill.
      2. detailedSummary: A comprehensive, structured breakdown. Use bullet points. Cover: 
         - Main Objective: What is this bill trying to achieve?
         - Key Provisions: List the most important changes/rules.
         - Timeline: When does this take effect?
         - Red Flags: What should the public be worried about?
      3. impactCards: Identify 3 specific impact areas.
      4. quiz: Create exactly 3 multiple-choice questions with a PROGRESSIVE DIFFICULTY curve (Easy, Medium, Hard).
      
      Use local examples (e.g., M-Pesa, fuel at Shell/Rubis, rent in Roysambu, cost of 1kg sugar).
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

  return JSON.parse(response.text.trim()) as BillAnalysis;
};
