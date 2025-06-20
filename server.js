// server.js
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

app.get('/', (req, res) => {
  res.send('MCP AI is alive');
});

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ response: result });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Groq request failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ MCP AI is running on port ${port}`);
});
