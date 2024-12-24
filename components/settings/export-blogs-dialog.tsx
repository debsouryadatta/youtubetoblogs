'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Copy } from 'lucide-react';
import { useGlobalStore } from '@/store/store';
import { toast } from 'sonner';

export function ExportBlogsDialog() {
  const [open, setOpen] = useState(false);
  const { blogs, setBlogs } = useGlobalStore();

  // Load blogs from localStorage when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      const storedBlogs = localStorage.getItem('blogs');
      setBlogs(storedBlogs ? JSON.parse(storedBlogs) : []);
    }
    setOpen(open);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(blogs, null, 2));
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(blogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-to-blogs-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger asChild>
    <Button variant="outline">Export Blogs</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[625px]">
    <DialogHeader>
      <DialogTitle>Export Blogs</DialogTitle>
      <DialogDescription>
        Your blogs data in JSON format. You can copy it to clipboard or download as a file.
      </DialogDescription>
    </DialogHeader>
    <div className="mt-4 space-y-4">
      <div className="relative">
        <pre className="p-4 rounded-lg bg-muted overflow-auto max-h-[400px] text-sm whitespace-pre-wrap break-words">
          {JSON.stringify(blogs, null, 2)}
        </pre>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleCopyToClipboard} className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </Button>
        <Button onClick={handleDownload} variant="secondary" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download JSON
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
  );
}
