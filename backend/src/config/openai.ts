import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey && apiKey !== 'your_openai_api_key_here'
  ? new OpenAI({ apiKey })
  : null;

if (!openai) {
  console.log('⚠️ OpenAI API Key is missing. Using high-fidelity sandboxed AI fallbacks for mock evaluations.');
}
