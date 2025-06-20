import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 10000;
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Set this in your environment

if (!GROQ_API_KEY) {
  console.error('Error: GROQ_API_KEY is not set in environment variables.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "mixtral-8x7b-32768",  // Change if needed
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Assuming response format follows OpenAI chat completion
    const answer = groqResponse.data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({ error: 'No response from Groq AI' });
    }

    return res.json({ response: answer });
  } catch (error) {
    console.error('Groq API request failed:', error.response?.data || error.message);

    const errMsg = error.response?.data?.error || error.message || 'Groq API request failed';

    return res.status(error.response?.status || 500).json({ error: errMsg });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP AI is running on port ${PORT}`);
});
