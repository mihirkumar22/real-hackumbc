const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai'); // Use this for the newer SDK version

const app = express();
const PORT = 5000;

// Middleware
require('dotenv').config();
app.use(cors());
app.use(express.json());

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your .env file is properly configured
});

// Function to moderate content using a text prompt
async function moderateContent(text) {
  try {
    // Constructing the moderation prompt
    const messages = [
      { role: "system", content: " You are a content moderation AI. Your job is to review the following content and determine whether it is acceptable. If the content contains inappropriate language (such as offensive, discriminatory, or inappropriate content), or creepiness, respond with 'REJECTED'. Otherwise, respond with 'APPROVED'. Be 40% lenient but %60 firm. If it's called 'REMOVE ME' then ignore" },
      { role: "user", content: text }
    ];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 60,
      temperature: 0
    });

    // Extracting the correct response format
    const result = response.choices[0].message.content.trim();

    console.log("OpenAI Moderation Response:", result); // Debugging output

    // Ensure strict validation of response
    return result === "APPROVED" ? { result: "APPROVED" } : { result: "REJECTED" };
  } catch (error) {
    console.error('Error processing moderation:', error);
    return { result: "REJECTED", message: "Error while moderating the content." };
  }
}


// Moderation Route
app.post('/moderate', async (req, res) => {
  const { text } = req.body;

  // Make sure the text is valid
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and should be a string.' });
  }

  // Call the moderation function with the provided text
  const moderationResult = await moderateContent(text);

  // Send the moderation result back to the frontend
  return res.json(moderationResult);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
