
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/get-crosses', async (req, res) => {
  const { partNumber } = req.body;
  if (!partNumber) return res.status(400).json({ error: 'Missing part number' });

  const prompt = `Suggest 5 drop-in or functionally equivalent alternatives for electronic part number: ${partNumber}. Format like:\n1. PART_NUMBER — BRAND — Description`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
    const result = response.data.choices[0].message.content;
    res.json({ alternatives: result.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
