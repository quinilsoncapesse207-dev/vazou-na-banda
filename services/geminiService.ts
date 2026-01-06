
import { GoogleGenAI, Type } from "@google/genai";
import { NewsPost } from "../types";

// Fix: Updated initialization to match @google/genai guidelines using named parameter directly with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGossip = async (topic: string): Promise<NewsPost[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere 3 notícias fictícias e sensacionalistas de fofoca sobre ${topic} no estilo portal 'Vazou na Banda'. Use nomes fictícios ou genéricos para evitar problemas reais. O tom deve ser 'clickbait' e urgente.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING },
              thumbnail: { type: Type.STRING },
              views: { type: Type.STRING },
              date: { type: Type.STRING },
              author: { type: Type.STRING },
              isHot: { type: Type.BOOLEAN },
            },
            required: ["id", "title", "excerpt", "content", "category", "views", "date", "author"]
          }
        }
      }
    });

    const results = JSON.parse(response.text);
    return results.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
      date: 'Agora mesmo'
    }));
  } catch (error) {
    console.error("Error generating gossip:", error);
    return [];
  }
};
