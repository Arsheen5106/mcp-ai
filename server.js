import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/ask', async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [...history, { role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const message = response.data.choices[0].message;
    res.json({ response: message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'MCP AI failed to respond.' });
  }
});
