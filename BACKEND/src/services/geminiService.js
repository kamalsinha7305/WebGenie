// backend/src/services/geminiService.js
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI(process.env.GEMINI_API_KEY);

function extractCode(text) {
  const match = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

async function generateComponentCode(prompt, framework) {
  const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const fullPrompt = `
    You are an expert web developer... 
    Component Description: "${prompt}"
    Framework/Libraries to use: "${framework}"
    ... (rest of your detailed prompt) ...
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  const code = extractCode(text);

  return code;
}

export { generateComponentCode };