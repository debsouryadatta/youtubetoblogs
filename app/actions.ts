"use server";

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
import { getSubtitles } from "@/lib/utils/subtitles";

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
        console.log("Video ID: ", videoId);
        const subtitles = await getSubtitles(videoId);
        return subtitles;
    } catch (error) {
        throw error;
    }
}

export const responseFromLlmAction = async (subtitles: string, videoType: string) => {
    try {
        const systemPrompt = getSystemPrompt(videoType) + BASE_PROMPT;
        console.log("System Prompt: ", systemPrompt);        
        const response = await responseFromGemini(subtitles, systemPrompt);
        // console.log("Response from LLM2: ", response);
        return response;
    } catch (error) {
        throw error;
    }
}