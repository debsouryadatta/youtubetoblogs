import OpenAI from "openai";
import { Message } from "@/lib/types";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const chatResponseFromGemini = async(input: string, messages: Message[], subtitles: string, systemPrompt: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash-exp",
            max_tokens: 5000,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: subtitles },
                ...messages,
                { role: "user", content: input },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}
