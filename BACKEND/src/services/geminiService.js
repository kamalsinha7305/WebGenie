// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// Use the correct class name for instantiation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractCode(text) {
  // This regex finds content within ```...``` code blocks
  const match = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

async function generateComponentCode(prompt, framework) {
  // Use a valid, available model name
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const fullPrompt = `
    You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

    Now, generate a UI component for: ${prompt}  
    Framework to use: ${framework.value}  
    Requirements:  
    - The code must be clean, well-structured, and easy to understand.  
    - Optimize for SEO where applicable.  
    - Focus on creating a modern, animated, and responsive UI design.  
    - Include high-quality hover effects, shadows, animations, colors, and typography.  
    - Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
    - Do NOT include explanations, text, comments, or anything else besides the code.  
    - And give the whole code in a single HTML file.
    `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const text = response.text();
  
  // Your extractCode function is good, but you can also just return the raw text
  // since the improved prompt asks the model to avoid markdown.
  // For safety, we can still use it.
  const code = extractCode(text);

  return code;
}

export { generateComponentCode };