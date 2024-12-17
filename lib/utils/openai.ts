import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompts/prompt";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const responseFromGemini = async(subtitles: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash-exp",
            max_tokens: 5000,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: subtitles,
                },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}
