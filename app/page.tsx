'use client';

import { YoutubeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CategoryTabs } from '@/components/blog/category-tabs';
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
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';

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
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-purple-100/30 to-cyan-100/30 dark:from-purple-900/20 dark:to-cyan-900/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-100/30 to-pink-100/30 dark:from-blue-900/20 dark:to-pink-900/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <main className="container mx-auto px-4 py-12 relative">
        <div className="flex flex-col items-center justify-center space-y-16">
          <div className="space-y-6 text-center relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-200/20 to-cyan-200/20 dark:from-purple-500/20 dark:to-cyan-500/20 -z-10" />
            <YoutubeIcon className="mx-auto h-20 w-20 text-red-500 animate-pulse" />
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              YouTube To Blogs
            </h1>
            <div className="text-center mb-10 -mt-10">
              <Badge variant="outline" className="text-sm py-2 border border-primary">
                <span className="mr-2 text-primary">
                  <Badge>New</Badge>
                </span>
                <span> Ai Powered Blog Generation </span>
              </Badge>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-[600px] mx-auto leading-relaxed">
              Transform YouTube videos into detailed guided blog posts with interactive chat feature.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:to-black text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 dark:from-gray-800 dark:to-gray-900">
                  Create New Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-800 dark:text-gray-200">Create New Blog Post</DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Enter the details for your new blog post.
                  </DialogDescription>
                </DialogHeader>
                <CreateBlogPostForm setOpen={setOpen} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-full max-w-6xl space-y-8">
            {blogs.length === 0 ? (
              <div className="flex flex-row items-center justify-center space-x-2 mt-10">
                <YoutubeIcon className="h-6 w-6" />
                <p className="text-gray-600 dark:text-gray-300">Create your first blog post now!</p>
              </div>
            ) : (
              <CategoryTabs blogs={blogs} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
