import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, QuizQuestion } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Flashcard Generation Schema ---
const flashcardSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      front: { type: Type.STRING, description: "The question or term on the front of the card" },
      back: { type: Type.STRING, description: "The answer or definition on the back" },
      topic: { type: Type.STRING, description: "The sub-topic this card belongs to" },
    },
    required: ["front", "back", "topic"],
  },
};

// --- Quiz Generation Schema ---
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 4 possible answers" 
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "0-based index of the correct option" },
      explanation: { type: Type.STRING, description: "Why the answer is correct" }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"],
  },
};

// --- Service Functions ---

/**
 * Generates a text response using Gemini 2.5 Flash.
 * Supports "Online Mode" (Google Search) and "Offline Mode" (Knowledge Base/Context).
 */
export const generateChatResponse = async (
  message: string,
  history: { role: 'user' | 'model'; parts: [{ text: string }] }[],
  systemInstruction: string,
  contextNotes: string,
  knowledgeBase: string,
  isOnline: boolean
): Promise<{ text: string; sources?: string[] }> => {
  
  if (!apiKey) throw new Error("API Key missing");

  const model = 'gemini-2.5-flash';
  
  // Construct System Instruction
  let augmentedSystemInstruction = systemInstruction;

  if (knowledgeBase || contextNotes) {
    // We feed the data but instruct the AI to treat it as internal knowledge.
    augmentedSystemInstruction += `\n\n[INTERNAL KNOWLEDGE BASE]:\n${knowledgeBase}\n\n[USER NOTES]:\n${contextNotes}`;
    
    if (!isOnline) {
        augmentedSystemInstruction += `\n\nINSTRUCTION: You are a tutor. Answer the user's question DIRECTLY and CONCISELY using the information provided in the Internal Knowledge Base above. 
        - DO NOT say "Based on the syllabus", "According to the notes", or "The text mentions". 
        - Pretend you already know this information.
        - If the user asks for a specific definition (e.g., "What is getchar?"), give the definition immediately without preamble.
        - If the information is missing, state "I don't have specific information on that topic in my current database, but generally..." and provide a standard answer.`;
    } else {
        augmentedSystemInstruction += `\n\nINSTRUCTION: Answer the user's question. You may use Google Search to supplement your knowledge, but prioritize the Internal Knowledge Base definitions if available. Do not cite the syllabus document itself, just give the answer.`;
    }
  }

  const tools = isOnline ? [{ googleSearch: {} }] : undefined;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: augmentedSystemInstruction,
        tools: tools,
        thinkingConfig: { thinkingBudget: 0 }, 
      }
    });

    // Extract text
    const text = response.text || "I couldn't generate a response.";
    
    // Extract grounding metadata (sources) - only if online
    let sources: string[] = [];
    if (isOnline) {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
            sources.push(chunk.web.uri);
            }
        });
        }
    }

    return { text, sources: Array.from(new Set(sources)) }; 
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return { text: "Error connecting to AI service. Please check your API key." };
  }
};

export const generateFlashcards = async (
  topic: string, 
  subjectName: string,
  contextNotes: string
): Promise<Flashcard[]> => {
  if (!apiKey) return [];

  const prompt = `Generate 10 high-quality flashcards for ${subjectName}, specifically focusing on: ${topic}. 
  Use the provided context notes if relevant: ${contextNotes.substring(0, 5000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      },
    });
    
    if (response.text) {
        return JSON.parse(response.text) as Flashcard[];
    }
    return [];
  } catch (error) {
    console.error("Flashcard Gen Error:", error);
    return [];
  }
};

export const generateQuiz = async (
  topic: string, 
  subjectName: string,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): Promise<QuizQuestion[]> => {
  if (!apiKey) return [];

  const prompt = `Create a ${difficulty} level quiz with 5 questions for ${subjectName} about ${topic}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return [];
  }
};