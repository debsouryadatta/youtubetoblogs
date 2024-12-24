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
import { Upload, Clipboard } from 'lucide-react';
import { useGlobalStore } from '@/store/store';
import { BlogPost } from '@/lib/types';
import { toast } from 'sonner';

export function ImportBlogsDialog() {
  const [open, setOpen] = useState(false);
  const { setBlogs } = useGlobalStore();

  const validateBlogData = (data: any): data is BlogPost[] => {
    if (!Array.isArray(data)) return false;
    
    return data.every(item => 
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.content === 'string' &&
      typeof item.youtubeUrl === 'string' &&
      typeof item.videoType === 'string' &&
      typeof item.subtitles === 'string' &&
      Array.isArray(item.messages) &&
      item.messages.every((msg: any) => 
        typeof msg === 'object' &&
        (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system') &&
        typeof msg.content === 'string'
      ) &&
      typeof item.createdAt === 'string'
    );
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      
      if (!validateBlogData(data)) {
        throw new Error('Invalid blog data format');
      }

      setBlogs(data);
      localStorage.setItem('blogs', JSON.stringify(data));
      setOpen(false);
      toast.success("Import successful");
    } catch (error) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!validateBlogData(data)) {
          throw new Error('Invalid blog data format');
        }

        setBlogs(data);
        localStorage.setItem('blogs', JSON.stringify(data));
        setOpen(false);
        toast.success("Import successful");
      } catch (error) {
        toast.error("Failed to import");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Blogs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Blogs</DialogTitle>
          <DialogDescription>
            Import your blogs from a JSON file or paste from clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Button
            onClick={handlePasteFromClipboard}
            className="w-full justify-center"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            Paste from Clipboard
          </Button>
          <div className="relative">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload JSON File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
