import he from 'he';
import axios from 'axios';


export async function getSubtitles(videoId: string) {
    try {

        
      


        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          headers: {
            'Cookie': 'GPS=1; VISITOR_INFO1_LIVE=Jsc3mhuO81w; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgTA%3D%3D; YSC=PwzF2X7eK8M'
          }
        };
        
        const response = await axios.request(config);
        const html = response.data;

        // Extract the ytInitialPlayerResponse from the HTML
        const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        if (!playerResponseMatch) {
            console.log("Could not find player response data");
            return null;
        }

        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        
        if (!captions || captions.length === 0) {
            console.log("No captions found for this video");
            return null;
        }

        // Get the first available caption track (usually English)
        const firstCaption = captions[0];
        const subtitleUrl = firstCaption.baseUrl;

        // Fetch the actual subtitle content
        const subtitleResponse = await fetch(subtitleUrl);
        const subtitleText = await subtitleResponse.text();

        // Parse XML to get clean subtitles
        // const subtitles = [];
        let subtitles = "";
        const textMatches = subtitleText.match(/<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)<\/text>/g);
        
        if (!textMatches) {
            console.log("No subtitle text matches found");
            return null;
        }

        for (const match of textMatches) {
            const startMatch = match.match(/start="([^"]+)"/);
            const durMatch = match.match(/dur="([^"]+)"/);
            const textMatch = match.match(/>([^<]+)</);

            if (startMatch && durMatch && textMatch) {
                const start = parseFloat(startMatch[1]);
                const duration = parseFloat(durMatch[1]);
                const text = he.decode(textMatch[1].trim());

                // subtitles.push({
                //     start: start,
                //     duration: duration,
                //     text: text
                // });
                subtitles += text + ". ";
            }
        }

        return subtitles;
    } catch (error) {
        console.error("Error fetching subtitles:", error);
        return null;
    }
}

export function isValidYoutubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'youtube.com' ||
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtu.be'
    );
  } catch {
    return false;
  }
}

export function getYoutubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    return searchParams.get('v') || urlObj.pathname.slice(1);
  } catch {
    return null;
  }
}