export interface BlogPost {
  id: string;
  title: string;
  content: string;
  youtubeUrl: string;
  videoType: string;
  subtitles: string;
  messages: any[];
  createdAt: string;
}

export interface CreateBlogPostData {
  title: string;
  youtubeUrl: string;
}