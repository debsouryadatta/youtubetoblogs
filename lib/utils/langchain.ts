import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const model = new ChatOpenAI({
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.3,
    configuration: {
        baseURL: process.env.LLM_BASE_URL,
        apiKey: process.env.LLM_API_KEY,
    }
});

const outoutParser = new StringOutputParser();

export const responseFromGemini = async(subtitles: string, systemPrompt: string) => {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["user", "{input}"],
    ]);

    try {
        const chain = prompt.pipe(model).pipe(outoutParser);
        const response = await chain.invoke({
            input: subtitles
        });
        return response;
    } catch (error) {
        console.log("Error in responseFromGemini", error);
        throw error;
    }
}