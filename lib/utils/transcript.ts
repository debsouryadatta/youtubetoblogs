import { YoutubeTranscript } from "youtube-transcript";

export async function getTranscript(videoId: string) {
    try {
      let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
        // lang: "en",
        //   @ts-ignore
        // country: "EN",
      });
      let transcript = "";
      for (let t of transcript_arr) {
        transcript += t.text + " ";
      }
      return transcript.replaceAll("\n", "");
    } catch (error) {
      return "";
    }
  }