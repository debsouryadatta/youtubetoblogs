import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.LLM_API_KEY,
    baseURL: process.env.LLM_BASE_URL
});

export const responseFromGemini = async(subtitles: string, systemPrompt: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            max_tokens: 5000,
            messages: [
                { role: "system", content: systemPrompt },
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
