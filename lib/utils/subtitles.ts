import he from 'he';
import axios from 'axios';


export async function getSubtitles(videoId: string) {
    try {

        
      


        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Cache-Control': 'max-age=0',
              'TE': 'Trailers'
          }
        };
        
        const response = await axios.request(config);
        console.log("Response status:", response.status);
        const html = response.data;
        
        // Extract the ytInitialPlayerResponse from the HTML
        const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        if (!playerResponseMatch) {
            console.log("HTML content length:", html.length);
            console.log("First 500 chars of HTML:", html.substring(0, 500));
            return null;
        }

        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        
        if (!captions || captions.length === 0) {
            console.log("Player response structure:", JSON.stringify(playerResponse?.captions, null, 2));
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