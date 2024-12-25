"use client";

import { notFound } from "next/navigation";
import { ArrowLeft, CalendarIcon, YoutubeIcon, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getYoutubeVideoId } from "@/lib/utils/subtitles";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { TabsSection } from "@/components/blog/tabs-section";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useGlobalStore } from "@/store/store";
import { ChatDrawer } from "@/components/blog/chat-drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreOptionsSheet } from "@/components/blog/more-options-sheet";
import { useParams } from "next/navigation";
import { BlogPost } from "@/lib/types";

export default function BlogPostPage() {
  const params = useParams();
  const { blogs, setBlogs } = useGlobalStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
    setIsLoading(false);
  }, [setBlogs]);

  useEffect(() => {
    if (!isLoading) {
      const post = blogs.find((p) => p.id === params.id);
      if (!post) {
        notFound();
      }
      const videoId = getYoutubeVideoId(post?.youtubeUrl!);
      setVideoId(videoId);
      setPost(post);
    }
  }, [blogs, params.id, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const handleExportPdf = async () => {
    if (!contentRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    try {
      // Capture the content as canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        windowWidth: contentRef.current.scrollWidth,
        windowHeight: contentRef.current.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Calculate dimensions
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${post?.title}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleExportMarkdown = () => {
    if (!post) return;

    // Create markdown content
    const markdownContent = `# ${post.title}
Created on: ${new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}

YouTube URL: ${post.youtubeUrl}

${post.content}
`;

    // Create blob and download
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-b from-purple-100/30 to-cyan-100/30 dark:from-purple-900/20 dark:to-cyan-900/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-t from-blue-100/30 to-pink-100/30 dark:from-blue-900/20 dark:to-pink-900/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container relative mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="mb-8">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportPdf}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportMarkdown}>
              Export as Markdown
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post?.createdAt}>
                  {new Date(post?.createdAt!).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <YoutubeIcon className="h-4 w-4 text-red-600" />
                <span className="whitespace-nowrap">YouTube Blog</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex flex-wrap items-center gap-2">
                <ChatDrawer postId={post?.id!} post={post!} setPost={setPost} />
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex flex-wrap items-center gap-2">
                <MoreOptionsSheet post={post!} setPost={setPost} />
              </div>
            </div>
          </div>

          {videoId && (
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <Card className="p-8" ref={contentRef}>
            <BlogPostContent content={post?.content!} fontStyle={post?.fontStyle!} />
          </Card>

          {/* Tabs Section */}
          <div className="mt-16">
            <Separator className="my-4" />
            <TabsSection post={post!} setPost={setPost} />
          </div>
        </div>
      </div>
    </div>
  );
}
