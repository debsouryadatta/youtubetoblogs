"use server";

import arcjet, { tokenBucket } from "@arcjet/next";
import { BASE_PROMPT } from "@/lib/prompts";
import { PROGRAMMING_TUTORIAL_SYSTEM_PROMPT } from "@/lib/prompts";
import { ACADEMIC_LECTURE_SYSTEM_PROMPT } from "@/lib/prompts";
import { BUSINESS_FINANCE_SYSTEM_PROMPT } from "@/lib/prompts";
import { DESIGN_CREATIVE_SYSTEM_PROMPT } from "@/lib/prompts";
import { GENERAL_SYSTEM_PROMPT } from "@/lib/prompts";
import { GUIDANCE_SYSTEM_PROMPT } from "@/lib/prompts";
import { DIY_HOWTO_SYSTEM_PROMPT } from "@/lib/prompts";
import { LANGUAGE_LEARNING_SYSTEM_PROMPT } from "@/lib/prompts";
import { MATH_SCIENCE_SYSTEM_PROMPT } from "@/lib/prompts";
import { PODCAST_SYSTEM_PROMPT } from "@/lib/prompts";
import { ROADMAP_SYSTEM_PROMPT } from "@/lib/prompts";
import { TECHNOLOGY_REVIEW_SYSTEM_PROMPT } from "@/lib/prompts";
import { responseFromGemini } from "@/lib/utils/openai";
import { getSubtitles2 } from "@/lib/utils/subtitles2";

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ['ip.src'],
    rules: [
        tokenBucket({
            mode: "LIVE",
            refillRate: 2,    // Refill 2 tokens per interval
            interval: 60,      // Refill interval in seconds
            capacity: 6,      // Maximum bucket size - twice since we are making two requests below
        }),
    ],
});

const getSystemPrompt = (videoType: string) => {
    switch (videoType) {
        case 'academic':
            return ACADEMIC_LECTURE_SYSTEM_PROMPT;
        case 'businessFinance':
            return BUSINESS_FINANCE_SYSTEM_PROMPT;
        case 'designCreative':
            return DESIGN_CREATIVE_SYSTEM_PROMPT;
        case 'general':
            return GENERAL_SYSTEM_PROMPT;
        case 'guidance':
            return GUIDANCE_SYSTEM_PROMPT;
        case 'howto':
            return DIY_HOWTO_SYSTEM_PROMPT;
        case 'languageLearning':
            return LANGUAGE_LEARNING_SYSTEM_PROMPT;
        case 'mathScience':
            return MATH_SCIENCE_SYSTEM_PROMPT;
        case 'podcast':
            return PODCAST_SYSTEM_PROMPT;
        case 'programming':
            return PROGRAMMING_TUTORIAL_SYSTEM_PROMPT;
        case 'roadmap':
            return ROADMAP_SYSTEM_PROMPT;
        case 'technology':
            return TECHNOLOGY_REVIEW_SYSTEM_PROMPT;
        default:
            return GENERAL_SYSTEM_PROMPT;
    }
};

export const getSubtitlesAction = async (videoId: string) => {
    try {
        const decision = await aj.protect(
            new Request(`${process.env.NEXT_PUBLIC_SITE_URL}/`),
            { requested: 1 } // Each request consumes 1 token
        );

        if (decision.isDenied()) {
            console.log("Rate limit exceeded. Please try again later.");
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        console.log("Video ID: ", videoId);
        const subtitles = await getSubtitles2(videoId);
        return subtitles;
    } catch (error) {
        throw error;
    }
}

export const responseFromLlmAction = async (subtitles: string, videoType: string) => {
    try {
        const decision = await aj.protect(
            new Request(`${process.env.NEXT_PUBLIC_SITE_URL}/`),
            { requested: 1 }
        );

        if (decision.isDenied()) {
            console.log("Rate limit exceeded. Please try again later.");
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        const systemPrompt = getSystemPrompt(videoType) + BASE_PROMPT;
        console.log("System Prompt: ", systemPrompt);        
        const response = await responseFromGemini(subtitles, systemPrompt);
        return response;
    } catch (error) {
        throw error;
    }
}
