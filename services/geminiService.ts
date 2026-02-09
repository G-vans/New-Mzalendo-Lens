
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
      description: "A comprehensive, 300-word breakdown of the bill's implications.",
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
          explanation: { type: Type.STRING, description: "A witty, educational explanation of why this answer is correct." }
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
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API Key is missing from build. Please redeploy on Vercel after setting the API_KEY variable.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const promptParts = [];
  if (text) promptParts.push({ text: `Analyze this text: ${text}` });
  if (file) {
    promptParts.push({
      inlineData: {
        data: file.base64,
        mimeType: file.mimeType
      }
    });
  }
  
  // Add base instructions
  promptParts.push({ text: "Break this bill down. Focus on how it affects young Kenyans (taxes, digital services, fuel, cost of living). Use a witty but informative tone." });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: promptParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      systemInstruction: "You are 'Mzalendo AI', a savvy Kenyan civic educator. You translate complex government bills into plain, punchy language that Gen Z Kenyans can understand and act upon."
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("The AI returned an empty response. This might be due to safety filters on the document content.");
  }

  try {
    // Some models might still include markdown blocks despite the mimeType setting
    const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedJson) as BillAnalysis;
  } catch (e) {
    console.error("JSON Parse Error:", rawText);
    throw new Error("Failed to decode the analysis. The bill might be too fragmented.");
  }
};
