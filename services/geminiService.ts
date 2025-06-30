import { GoogleGenAI } from "@google/genai";
import { Message, Sender } from '../types';

// The API key must be provided as an environment variable.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    // This will be caught by the App's error handler and provides a clear message.
    throw new Error("Missing API_KEY environment variable. Please configure it in your deployment environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

const SYSTEM_INSTRUCTION = 'You are a friendly and helpful chatbot named NP Chatbot. Your responses should be informative, well-formatted, and conversational. Avoid using markdown formatting like asterisks for bolding.';

/**
 * Maps the application's message history to the format required by the Gemini API.
 * @param history - The array of Message objects from the application state.
 * @returns An array of content objects formatted for the API.
 */
const formatHistoryForApi = (history: Message[]) => {
  return history
    // Filter out the initial welcome message, as it's not part of the actual conversation.
    .filter(msg => msg.text !== "Hello! I'm NP Chatbot. How can I assist you today?")
    .map(msg => ({
      role: msg.sender,
      parts: [{ text: msg.text }],
    }));
};

/**
 * Sends the conversation history to the Gemini API and returns a streaming response.
 * @param history - The current conversation history.
 * @param signal - An AbortSignal to allow for cancelling the request.
 * @returns An async generator that yields text chunks from the API response.
 */
export async function* getStreamingResponse(history: Message[], signal: AbortSignal): AsyncGenerator<string> {
  const contents = formatHistoryForApi(history);

  try {
    const streamResult = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
        }
    });

    for await (const chunk of streamResult) {
        // Check for abortion signal on each chunk. This allows the user to stop generation.
        if (signal.aborted) {
            throw new DOMException('Request aborted by user.', 'AbortError');
        }
        
        const text = chunk.text;
        if (text) {
            yield text;
        }
    }
  } catch (error: any) {
    // If the error is an AbortError from our check, just log it and stop.
    if (error.name === 'AbortError') {
        console.log('Stream generation stopped by user.');
        return; // Exit the generator gracefully.
    }
    
    // For other errors, log them and re-throw a user-friendly message.
    console.error("Gemini API Error:", error);
    throw new Error(error.message || `An error occurred while fetching the response.`);
  }
}
