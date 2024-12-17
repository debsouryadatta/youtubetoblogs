export interface BlogPost {
  id: string;
  title: string;
  content: string;
  youtubeUrl: string;
  createdAt: string;
}

export interface CreateBlogPostData {
  title: string;
  youtubeUrl: string;
}