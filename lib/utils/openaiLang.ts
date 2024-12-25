import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const changeLangWithGemini = async(blogContent: string, language: string, systemPrompt: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash-exp",
            // max_tokens: 5000,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Please change the following content to ${language} language: ${blogContent}` },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}
