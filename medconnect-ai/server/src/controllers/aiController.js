const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');

const SYSTEM_PROMPT = `You are a medical assistant. A patient will provide current symptoms, city, age and gender.
Respond ONLY in this JSON format:
{
  "possibleConditions": ["string", "string", "string"],
  "recommendedSpecialist": "string",
  "urgencyLevel": "low" | "medium" | "high",
  "cityWeatherNote": "string (mention likely city weather context and how it affects symptoms)",
  "sevenDayPrecautions": ["day 1 precaution", "day 2 precaution", "day 3 precaution", "day 4 precaution", "day 5 precaution", "day 6 precaution", "day 7 precaution"],
  "advice": "string (max 2 sentences)"
}
Rules:
- Keep recommendations practical and safe for home care unless urgency is high.
- sevenDayPrecautions must have exactly 7 items.
- Always end the advice field with a disclaimer that this is not a medical diagnosis.`;

let openAiClient;
let geminiClient;
let groqClient;
const GEMINI_MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL?.trim(),
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite'
].filter(Boolean);

const looksLikeGeminiKey = (value = '') => value.startsWith('AIza');
const looksLikeOpenAiKey = (value = '') => value.startsWith('sk-');
const looksLikeGroqKey = (value = '') => value.startsWith('gsk_');

const getProviderConfig = () => {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();

  if (groqKey && looksLikeGroqKey(groqKey)) {
    return { provider: 'groq', apiKey: groqKey };
  }
  if (geminiKey && looksLikeGeminiKey(geminiKey)) {
    return { provider: 'gemini', apiKey: geminiKey };
  }
  if (openAiKey && looksLikeOpenAiKey(openAiKey)) {
    return { provider: 'openai', apiKey: openAiKey };
  }
  return { provider: null, apiKey: '' };
};

const getOpenAiClient = (apiKey) => {
  if (!openAiClient) openAiClient = new OpenAI({ apiKey });
  return openAiClient;
};

const getGroqClient = (apiKey) => {
  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  }
  return groqClient;
};

const getGeminiClient = (apiKey) => {
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
};

const runWithOpenAi = async (patientInput, apiKey) => {
  const completion = await getOpenAiClient(apiKey).chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: patientInput }
    ],
    temperature: 0.3,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
};

const runWithGroq = async (patientInput, apiKey) => {
  const completion = await getGroqClient(apiKey).chat.completions.create({
    model: process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: patientInput }
    ],
    temperature: 0.3,
    max_tokens: 500
  });

  return completion.choices[0].message.content;
};

const runWithGemini = async (patientInput, apiKey) => {
  const prompt = `${SYSTEM_PROMPT}\n\nPatient details:\n${patientInput}`;
  const client = getGeminiClient(apiKey);
  let lastError;

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

const tryRunWithOpenAiFallback = async (patientInput, preferredProviderError) => {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (!openAiKey || !looksLikeOpenAiKey(openAiKey)) {
    throw preferredProviderError;
  }
  return runWithOpenAi(patientInput, openAiKey);
};

const tryRunWithGroqFallback = async (patientInput, preferredProviderError) => {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (!groqKey || !looksLikeGroqKey(groqKey)) {
    throw preferredProviderError;
  }
  return runWithGroq(patientInput, groqKey);
};

const isQuotaExceededError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return error?.status === 429 || message.includes('429') || message.includes('quota');
};

exports.symptomCheck = catchAsync(async (req, res) => {
  const symptoms = req.body.symptoms?.trim();
  const city = req.body.city?.trim();
  const gender = req.body.gender?.trim();
  const age = Number(req.body.age);
  if (!symptoms || !city || !gender || !age || age < 1 || age > 120) {
    return res.status(400).json({ message: 'Please provide current symptom, city, age and gender' });
  }

  const patientInput = `Current symptom: ${symptoms}
City: ${city}
Age: ${age}
Gender: ${gender}`;

  const { provider, apiKey } = getProviderConfig();
  if (!apiKey) {
    return res.status(503).json({ message: 'AI service not configured' });
  }

  try {
    let text;
    if (provider === 'groq') {
      text = await runWithGroq(patientInput, apiKey);
    } else if (provider === 'gemini') {
      try {
        text = await runWithGemini(patientInput, apiKey);
      } catch (error) {
        try {
          text = await tryRunWithGroqFallback(patientInput, error);
        } catch (groqError) {
          text = await tryRunWithOpenAiFallback(patientInput, groqError);
        }
      }
    } else {
      text = await runWithOpenAi(patientInput, apiKey);
    }
    const match = text.match(/\{[\s\S]*\}/);
    try {
      res.json(JSON.parse(match ? match[0] : text));
    } catch {
      res.status(502).json({ message: 'AI response could not be parsed' });
    }
  } catch (error) {
    if (isQuotaExceededError(error)) {
      return res.status(429).json({
        message: 'AI service quota exceeded. Please retry shortly or configure billing/openai fallback.'
      });
    }
    throw error;
  }
});
