import he from 'he';

export async function getSubtitles(videoId: string) {
    try {
        // Add user-agent header to mimic browser request
        const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch video page:", response.status);
            return null;
        }

        const html = await response.text();

        // Extract the ytInitialPlayerResponse from the HTML
        const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        if (!playerResponseMatch) {
            console.error("Could not find player response data");
            return null;
        }

        let playerResponse;
        try {
            playerResponse = JSON.parse(playerResponseMatch[1]);
        } catch (e) {
            console.error("Failed to parse player response:", e);
            return null;
        }

        const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        
        if (!captions || captions.length === 0) {
            console.error("No captions found for this video");
            return null;
        }

        // Get the first available caption track (usually English)
        const firstCaption = captions[0];
        const subtitleUrl = firstCaption.baseUrl;

        // Fetch the actual subtitle content with headers
        const subtitleResponse = await fetch(subtitleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (!subtitleResponse.ok) {
            console.error("Failed to fetch subtitles:", subtitleResponse.status);
            return null;
        }

        const subtitleText = await subtitleResponse.text();

        let subtitles = "";
        const textMatches = subtitleText.match(/<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)<\/text>/g);
        
        if (!textMatches) {
            console.error("No subtitle text matches found");
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

        return subtitles.trim();
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