"use server";

import { CHAT_SYSTEM_PROMPT } from "@/lib/prompts/chatPrompt";
import { Message } from "@/lib/types";
import { chatResponseFromGemini } from "@/lib/utils/openaiChat";

export const getChatResponseAction = async (input: string, messages: Message[], subtitles: string) => {
    try {
        const systemPrompt = CHAT_SYSTEM_PROMPT;
        const response = await chatResponseFromGemini(input, messages, subtitles, systemPrompt);
        return response;
    } catch (error) {
        throw error;
    }
}