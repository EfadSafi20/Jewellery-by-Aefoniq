import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Initialize Gemini
export const initGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return;
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Start or retrieve a chat session
export const getChatSession = (): Chat => {
  if (!ai) initGemini();
  if (!ai) throw new Error("AI Client not initialized");

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but focused
      },
    });
  }
  return chatSession;
};

// Send message to Gemini
export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = getChatSession();
    const result: GenerateContentResponse = await session.sendMessage({ message });
    return result.text || "I apologize, I am momentarily distracted by the brilliance of our collection. Could you repeat that?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I am currently unable to access my styling notes. Please try again in a moment.";
  }
};
