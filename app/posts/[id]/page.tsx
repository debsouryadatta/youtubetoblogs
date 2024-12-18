"use client";

import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarIcon, YoutubeIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getYoutubeVideoId } from '@/lib/utils/subtitles';
import { BlogPostContent } from '@/components/blog/blog-post-content';
import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useGlobalStore } from '@/store/store';
import { ChatDrawer } from '@/components/blog/chat-drawer';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const { blogs } = useGlobalStore();
  const post = blogs.find((p) => p.id === params.id);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!post) {
    notFound();
  }

  const videoId = getYoutubeVideoId(post.youtubeUrl);

  const handleExportPdf = async () => {
    if (!contentRef.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
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

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate dimensions
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${post.title}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Button onClick={handleExportPdf} className="mb-8">
          Export as PDF
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex flex-wrap items-center gap-2">
                <YoutubeIcon className="h-4 w-4 text-red-600" />
                <span className="whitespace-nowrap">YouTube Blog</span>
                <ChatDrawer postId={post.id} />
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
            <BlogPostContent content={post.content} />
          </Card>
        </div>
      </div>
    </div>
  );
}
