import he from 'he';

export async function getSubtitles(videoId: string) {
    try {
        // First try to get the captions directly from the timedtext API
        const langResponse = await fetch(`https://video.google.com/timedtext?type=list&v=${videoId}`);
        if (!langResponse.ok) {
            throw new Error(`Failed to fetch language list: ${langResponse.status}`);
        }

        const langText = await langResponse.text();
        // If there are no captions available through this API, fall back to the old method
        if (!langText.includes('name="')) {
            return await getFallbackSubtitles(videoId);
        }

        // Parse the language list XML to find English or the first available track
        const langMatch = langText.match(/lang_code="([^"]+)"/);
        if (!langMatch) {
            throw new Error("No caption tracks found");
        }

        const langCode = langMatch[1];
        const captionResponse = await fetch(
            `https://video.google.com/timedtext?lang=${langCode}&v=${videoId}`
        );

        if (!captionResponse.ok) {
            throw new Error(`Failed to fetch captions: ${captionResponse.status}`);
        }

        const captionText = await captionResponse.text();
        let subtitles = "";
        const textMatches = captionText.match(/<text[^>]*>([^<]+)<\/text>/g);

        if (!textMatches) {
            throw new Error("No caption text found");
        }

        for (const match of textMatches) {
            const textContent = match.match(/>([^<]+)</);
            if (textContent) {
                const text = he.decode(textContent[1].trim());
                subtitles += text + ". ";
            }
        }

        return subtitles.trim();
    } catch (error) {
        console.error("Error in primary method:", error);
        // If the primary method fails, try the fallback method
        return await getFallbackSubtitles(videoId);
    }
}

async function getFallbackSubtitles(videoId: string) {
    try {
        const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video page: ${response.status}`);
        }

        const html = await response.text();
        const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        
        if (!playerResponseMatch) {
            throw new Error("Could not find player response data");
        }

        const playerResponse = JSON.parse(playerResponseMatch[1]);
        const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        
        if (!captions || captions.length === 0) {
            throw new Error("No captions found for this video");
        }

        const firstCaption = captions[0];
        const subtitleUrl = firstCaption.baseUrl;

        const subtitleResponse = await fetch(subtitleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        if (!subtitleResponse.ok) {
            throw new Error(`Failed to fetch subtitles: ${subtitleResponse.status}`);
        }

        const subtitleText = await subtitleResponse.text();
        let subtitles = "";
        const textMatches = subtitleText.match(/<text[^>]*>([^<]+)<\/text>/g);
        
        if (!textMatches) {
            throw new Error("No subtitle text matches found");
        }

        for (const match of textMatches) {
            const textContent = match.match(/>([^<]+)</);
            if (textContent) {
                const text = he.decode(textContent[1].trim());
                subtitles += text + ". ";
            }
        }

        return subtitles.trim();
    } catch (error) {
        console.error("Error in fallback method:", error);
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