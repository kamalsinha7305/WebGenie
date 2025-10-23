// api/generate.js
import { GoogleGenAI } from "@google/genai";

// Initialize with the API key from environment variables
const genai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Helper function to extract code blocks from Markdown
function extractCode(text) {
  const match = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

// Export the handler function for Vercel
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, framework } = req.body;

    if (!prompt || !framework) {
      return res
        .status(400)
        .json({ error: "Prompt and framework are required." });
    }

    // Use the getGenerativeModel method with the new model name
// The updated line for your api/generate.js file
    const model = genai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `
      You are an expert web developer specializing in modern, animated, and fully responsive UI components.
      You have deep expertise in HTML, CSS, Tailwind CSS, Bootstrap, and JavaScript.

      Generate a single, complete HTML file for the following UI component request:
      Component Description: "${prompt}"
      Framework/Libraries to use: "${framework}"

      IMPORTANT REQUIREMENTS:
      1. **Single File Output:** The entire code (HTML, CSS, JavaScript) must be in a single HTML file.
      2. **Styling:**
         - If using Tailwind CSS, include via CDN: <script src="https://cdn.tailwindcss.com"></script>.
         - If using Bootstrap, include CSS & JS CDNs.
         - If using plain CSS, embed it within <style> tags.
      3. **JavaScript:** All JS must be embedded within <script> tags at the end of the <body>.
      4. **Quality:** The code must be clean, modern, animated, and responsive with smooth hover effects and transitions.
      5. **Content:** Use professional placeholder text/images (unsplash.com, placehold.co, etc.).
      6. **Response Format:** Return ONLY the complete HTML code inside a single Markdown code block. No explanations or text outside the code block.
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    const code = extractCode(text);

    res.status(200).json({ code });

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    res.status(500).json({
      error: "Failed to generate code from Gemini API.",
      details: error.message,
    });
  }
}