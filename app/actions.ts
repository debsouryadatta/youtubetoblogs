"use server";

import { responseFromGemini } from "@/lib/utils/openai";
import { getSubtitles } from "@/lib/utils/subtitles";

export const getSubtitlesAction = async (videoId: string) => {
    try {
        console.log("Video ID: ", videoId);
        const subtitles = await getSubtitles(videoId);
        return subtitles;
    } catch (error) {
        throw error;
    }
}

export const responseFromLlmAction = async (subtitles: string) => {
    try {
        const response = await responseFromGemini(subtitles);
        console.log("Response from LLM2: ", response);
        return response;
    } catch (error) {
        throw error;
    }
}