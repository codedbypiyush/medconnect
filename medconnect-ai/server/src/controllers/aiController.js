const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');

const SYSTEM_PROMPT = `You are a medical assistant. A patient will describe their symptoms.
Respond ONLY in this JSON format:
{
  "possibleConditions": ["string", "string", "string"],
  "recommendedSpecialist": "string",
  "urgencyLevel": "low" | "medium" | "high",
  "advice": "string (max 2 sentences)"
}
Always end the advice field with a disclaimer that this is not a medical diagnosis.`;

let openAiClient;
let geminiClient;

const looksLikeGeminiKey = (value = '') => value.startsWith('AIza');
const looksLikeOpenAiKey = (value = '') => value.startsWith('sk-');

const getApiKey = () => {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  return geminiKey || openAiKey || '';
};

const detectProvider = (apiKey) => {
  if (looksLikeGeminiKey(apiKey)) return 'gemini';
  if (looksLikeOpenAiKey(apiKey)) return 'openai';
  return 'openai';
};

const getOpenAiClient = (apiKey) => {
  if (!openAiClient) openAiClient = new OpenAI({ apiKey });
  return openAiClient;
};

const getGeminiClient = (apiKey) => {
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
};

const runWithOpenAi = async (symptoms, apiKey) => {
  const completion = await getOpenAiClient(apiKey).chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: symptoms }
    ],
    temperature: 0.3,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
};

const runWithGemini = async (symptoms, apiKey) => {
  const model = getGeminiClient(apiKey).getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `${SYSTEM_PROMPT}\n\nPatient symptoms:\n${symptoms}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

exports.symptomCheck = catchAsync(async (req, res) => {
  const symptoms = req.body.symptoms?.trim();
  if (!symptoms) return res.status(400).json({ message: 'Please describe your symptoms' });
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(503).json({ message: 'AI service not configured' });
  }

  const provider = detectProvider(apiKey);
  const text = provider === 'gemini'
    ? await runWithGemini(symptoms, apiKey)
    : await runWithOpenAi(symptoms, apiKey);
  const match = text.match(/\{[\s\S]*\}/);
  try {
    res.json(JSON.parse(match ? match[0] : text));
  } catch {
    res.status(502).json({ message: 'AI response could not be parsed' });
  }
});
