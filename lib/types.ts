export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  youtubeUrl: string;
  videoType: string;
  subtitles: string;
  messages: Message[];
  createdAt: string;
  fontStyle?: string;
  language?: string;
  notes?: Note[];
}

export interface CreateBlogPostData {
  title: string;
  youtubeUrl: string;
}