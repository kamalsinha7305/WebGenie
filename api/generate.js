// api/generate.js
// This file will be automatically picked up by Vercel as a serverless function.

// Use the official Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the API key from environment variables for security
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractCode(text) {
  // This regex finds code within markdown code blocks (```)
  const match = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

// Export the handler function for Vercel
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, framework } = req.body;

    if (!prompt || !framework) {
      return res.status(400).json({ error: 'Prompt and framework are required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The detailed prompt for the AI model
    const fullPrompt = `
      You are an expert web developer specializing in modern, animated, and fully responsive UI components. You have deep expertise in HTML, CSS, Tailwind CSS, Bootstrap, and JavaScript.

      Generate a single, complete HTML file for the following UI component request:
      Component Description: "${prompt}"
      Framework/Libraries to use: "${framework}"

      IMPORTANT REQUIREMENTS:
      1.  **Single File Output:** The entire code (HTML, CSS, JavaScript) must be in a single HTML file.
      2.  **Styling:**
          - If using Tailwind CSS, include it via the CDN script: <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>.
          - If using Bootstrap, include the necessary CSS and JS CDN links.
          - If using plain CSS, embed it within <style> tags in the <head>.
      3.  **JavaScript:** All JavaScript must be embedded within <script> tags at the end of the <body>.
      4.  **Quality:** The code must be clean, well-structured, modern, animated, and responsive. Use high-quality hover effects, shadows, and smooth transitions.
      5.  **Content:** Use appropriate and professional-looking placeholder text and images (e.g., from unsplash.com or placehold.co).
      6.  **Response Format:** Return ONLY the complete HTML code inside a single Markdown fenced code block. Do NOT include any explanations, comments, or other text outside of the code block.
    `;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const code = extractCode(text);

    // Send the extracted code back to the frontend
    res.status(200).json({ code });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to generate code from AI' });
  }
}