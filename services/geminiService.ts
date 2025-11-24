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
        augmentedSystemInstruction += `\n\nINSTRUCTION: You are an expert tutor. Answer the user's question DIRECTLY and CONFIDENTLY.
        - Use the provided Internal Knowledge Base as your primary source of truth for definitions and facts.
        - DO NOT use meta-phrases like "Based on the syllabus", "According to the notes", "In my database", "I don't have specific info", or "The text mentions".
        - If the user asks subjective questions (e.g., "hardest topic", "important questions", "summary"), use your best judgment and general academic knowledge to provide a definitive answer without qualifying it.
        - Pretend you are a teacher who has taught this subject for years.
        - If the user asks for a specific definition (e.g., "What is getchar?"), give the definition immediately without preamble.`;
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

export const generateSyllabusDetails = async (
  subjectName: string,
  units: string[]
): Promise<string> => {
  if (!apiKey) return "";

  const prompt = `You are a professor creating comprehensive study notes for the subject: "${subjectName}".
  
  The syllabus contains the following units:
  ${units.map((u, i) => `${i+1}. ${u}`).join('\n')}
  
  INSTRUCTION:
  1. For EACH unit, generate a detailed summary.
  2. Include key definitions, important concepts, formulas (if math), and code snippets (if programming).
  3. Organize the output with clear Markdown headers (## Unit Name).
  4. The goal is to create a "Self-Learning Material" (SLM) that covers the gaps in the student's current notes.
  5. Be concise but thorough.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using standard flash for potentially long context generation
      contents: prompt,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Syllabus Gen Error:", error);
    return "";
  }
};

// --- Compiler & OCR Services ---

export const compileCode = async (code: string, stdin: string = ''): Promise<string> => {
  if (!apiKey) return "Error: API Key missing.";

  const prompt = `
  You are a GCC C Compiler Simulator.
  
  TASK:
  Compile and execute the following C code.
  
  INPUT CODE:
  ${code}
  
  STANDARD INPUT (stdin):
  ${stdin || "No input provided"}
  
  RULES:
  1. Output ONLY the program execution result (stdout) or error messages (stderr).
  2. Do not explain your thought process.
  3. Do not use markdown blocks in the response.
  4. If the code expects input (scanf) but none is provided in standard input, simulate the program waiting or erroring out gracefully.
  5. If there is a syntax error, mimic GCC error output format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Compiler Error:", error);
    return "Error: Failed to simulate compilation.";
  }
};

export const scanCodeFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  if (!apiKey) return "// Error: API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: "Extract the C code from this image. Return ONLY the raw code. Fix obvious OCR typos if they break C syntax (e.g. '1nt' -> 'int'), but keep logic identical. Do not use markdown backticks." }
        ]
      }
    });
    return response.text || "// Could not extract code.";
  } catch (error) {
    console.error("OCR Error:", error);
    return "// Error: Failed to scan image.";
  }
};