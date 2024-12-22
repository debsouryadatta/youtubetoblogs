'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getSubtitlesAction, responseFromLlmAction } from '@/app/actions';
import { toast } from 'sonner';
import { nanoid } from 'nanoid'
import { useGlobalStore } from '@/store/store';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  youtubeUrl: z.string().url('Please enter a valid URL'),
  videoType: z.string().optional(),
  isShort: z.boolean().default(false),
});

type Props = {
  setOpen: (open: boolean) => void;
};

export function CreateBlogPostForm({ setOpen }: Props) {
  const { blogs, setBlogs } = useGlobalStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      youtubeUrl: '',
      videoType: '',
      isShort: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log(values);
      const { title, youtubeUrl, videoType, isShort } = values;
      const videoId = extractVideoId(youtubeUrl);
      console.log("isShort: ", isShort);
      console.log("videoId: ", videoId);

      const subtitles = await getSubtitlesAction(videoId!);
      console.log("Subtitles: ", subtitles);

      let responseFromLlm: string | null = "";
      if (isShort) {
        responseFromLlm = await responseFromLlmAction(subtitles!, 'ytshorts');
      } else {
        responseFromLlm = await responseFromLlmAction(subtitles!, videoType || 'general');
      }

      console.log("Response from LLM: ", responseFromLlm);
      const blogPost = {
        id: nanoid(),
        title,
        content: responseFromLlm!,
        youtubeUrl,
        videoType: isShort? 'ytshorts' : videoType || 'general',
        subtitles: subtitles!,
        messages: [],
        createdAt: new Date().toISOString(),
      }
      setBlogs([blogPost, ...blogs]);
      localStorage.setItem('blogs', JSON.stringify([blogPost, ...blogs]));
      toast.success('Blog post created successfully');
    } catch (error: any) {
      console.log(error);
      if (error.message === 'Rate limit exceeded. Please try again later.') {
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        toast.error('Failed to create blog post');
      }
    } finally {
      setOpen(false);
      setLoading(false);
    }
  }

  const extractVideoId = (url: string) => {
    url = url.trim();
    if (url.includes('v=')) {
      const params = new URLSearchParams(url.split('?')[1]);
      return params.get('v');
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('/shorts/')) {
      return url.split('/shorts/')[1]?.split('?')[0];
    }
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-black p-6 rounded-lg">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-200">Blog Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title..." className="bg-white dark:bg-black/10 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-200">YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=..." className="bg-white dark:bg-black/10 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isShort"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-center gap-4 rounded-lg p-4">
              <div className={`text-sm font-medium mt-3 ${field.value ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                YouTube Video
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-600"
                />
              </FormControl>
              <div className={`text-sm font-medium ${!field.value ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                YouTube Shorts
              </div>
            </FormItem>
          )}
        />

        {!form.getValues('isShort') && (
          <FormField
          control={form.control}
          name="videoType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-200">Video Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-black/10 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    <SelectValue placeholder="Select video type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="podcast">Podcast</SelectItem>
                  <SelectItem value="roadmap">Roadmap</SelectItem>
                  <SelectItem value="guidance">Guidance</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="howto">How-to</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="businessFinance">Business & Finance</SelectItem>
                  <SelectItem value="designCreative">Design & Creative</SelectItem>
                  <SelectItem value="languageLearning">Language Learning</SelectItem>
                  <SelectItem value="mathScience">Math & Science</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        )}


        <div className="w-full">
          <Button type="submit" className="w-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-600 text-white hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-700 dark:hover:to-gray-500 transition-all duration-300" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                <span>Creating...</span>
              </div>
            ) : (
              'Create Blog Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}