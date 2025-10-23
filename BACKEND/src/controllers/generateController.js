// backend/src/controllers/generateController.js

import { generateComponentCode } from '../services/geminiService.js';

const generateComponent = async (req, res) => {
  try {
    const { prompt, framework } = req.body;
    if (!prompt || !framework) {
      return res.status(400).json({ error: "Prompt and framework are required." });
    }

    const code = await generateComponentCode(prompt, framework);
    res.status(200).json({ code });
  } catch (error) {
  // Log the entire error object to see the detailed message from the Gemini API
  console.error('💥 DETAILED ERROR:', error); 
  res.status(500).json({ error: "Failed to generate code.", details: error.message });
}
};

export { generateComponent };