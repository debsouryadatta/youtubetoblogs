"use server";

import arcjet, { tokenBucket, request } from "@arcjet/next";
import { CHAT_SYSTEM_PROMPT, CHANGE_LANG_SYSTEM_PROMPT } from "@/lib/prompts";
import { Message } from "@/lib/types";
import { chatResponseFromGemini } from "@/lib/utils/openaiChat";
import { changeLangWithGemini } from "@/lib/utils/openaiLang";
// import ip from "@arcjet/ip";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ['ip.src'],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,    // Refill 10 tokens per interval
      interval: 60,      // Refill interval in seconds
      capacity: 20,      // Maximum bucket size
    }),
  ],
});

export const getChatResponseAction = async (input: string, messages: Message[], subtitles: string, postId: string) => {
    try {
        // const req = new Request(`${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postId}`)
        const req = await request();
        // @ts-ignore
        // const userIp = ip(req);
        // console.log("User IP: ", userIp);
        const decision = await aj.protect(req, { requested: 1 })  // Each request consumes 1 token);
        
        if (decision.isDenied()) {
            console.log("Rate limit exceeded. Please try again later.");
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        const systemPrompt = CHAT_SYSTEM_PROMPT;
        const response = await chatResponseFromGemini(input, messages, subtitles, systemPrompt);
        return response;
    } catch (error) {
        throw error;
    }
}

export const changeLangAction = async (blogContent: string, language: string) => {
  try {
    const systemPrompt = CHANGE_LANG_SYSTEM_PROMPT;
    const response = await changeLangWithGemini(blogContent, language, systemPrompt);
    return response;
  } catch (error) {
    throw error;
  }
}
