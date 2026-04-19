import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_GUIDELINES } from "../lib/prompt";


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

function stripCodeFences(text) {
  if (!text) return "";
  let t = text.trim();
  // Strip leading ```html or ```
  t = t.replace(/^```(?:html)?\s*/i, "");
  t = t.replace(/```\s*$/i, "");
  // If it doesn't start with <!DOCTYPE, try to find the first <!DOCTYPE
  const idx = t.indexOf("<!DOCTYPE");
  if (idx > 0) t = t.slice(idx);
  return t.trim();
}

export async function generateWebsite({ prompt, currentHtml, history, }) {
  let fullPrompt = SYSTEM_GUIDELINES + "\n\n";

  if (currentHtml) {
    fullPrompt += `CURRENT WEBSITE (modify this based on the new instruction):\n\n${currentHtml}\n\n`;
  }

  if (history && history.length) {
    fullPrompt += `CONVERSATION HISTORY:\n`;
    history.slice(-6).forEach((m) => {
      fullPrompt += `${m.role.toUpperCase()}: ${m.content}\n`;
    });
    fullPrompt += `\n`;
  }

  fullPrompt += `USER REQUEST:\n${prompt}\n\nGenerate the complete updated HTML document now.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  //the response is an object with a lot of metadata, the actual text is in candidates, cotents parts text
  const html = stripCodeFences(response?.candidates?.[0]?.content?.parts?.[0]?.text || ""); 

  console.log("Full AI response:", html);
  return html;

  
}

export async function generateTitle(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent({
    role: "user",
    prompt: `Generate a very short (2-4 words) project title for this website brief. Return ONLY the title, no quotes, no punctuation.\n\nBrief: ${prompt}`
  });
  const response = await result.response;
  return (response || "Untitled Site").replace(/["'.\n]/g, "").trim().slice(0, 40);
}