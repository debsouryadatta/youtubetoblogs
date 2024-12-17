'use client';

import { YoutubeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/blog/post-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateBlogPostForm } from '@/components/blog/create-blog-post-form';
import { useGlobalStore } from '@/store/store';

export default function Home() {
  const [open, setOpen] = useState(false);
  const { blogs, setBlogs } = useGlobalStore();
  
  useEffect(() => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-12">
          <div className="space-y-4 text-center">
            <YoutubeIcon className="mx-auto h-16 w-16 text-red-600" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              YouTube Video to Detailed Guided Blogs
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
              Transform YouTube videos into detailed guided blog posts with ai powered subtitle extraction and formatting.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="font-semibold">
                  Create New Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new blog post.
                  </DialogDescription>
                </DialogHeader>
                <CreateBlogPostForm setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full max-w-6xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Recent Blog Posts
              </h2>
              <Button variant="ghost">View All</Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
