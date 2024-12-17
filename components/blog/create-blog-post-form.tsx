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
import { getSubtitlesAction, responseFromLlmAction } from '@/app/actions';
import { toast } from 'sonner';
import { nanoid } from 'nanoid'
import { useGlobalStore } from '@/store/store';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  youtubeUrl: z.string().url('Please enter a valid URL'),
});

type Props = {
  setOpen: (open: boolean) => void;
};

export function CreateBlogPostForm({ setOpen }: Props) {
  const {blogs, setBlogs} = useGlobalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      youtubeUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      const { title, youtubeUrl } = values;
      const videoId = extractVideoId(youtubeUrl);
      const subtitles = await getSubtitlesAction(videoId!);
      console.log("Subtitles: ", subtitles);
      const responseFromLlm = await responseFromLlmAction(subtitles!);
      console.log("Response from LLM: ", responseFromLlm);
      const blogPost = {
        id: nanoid(),
        title,
        content: responseFromLlm!,
        youtubeUrl,
        createdAt: new Date().toISOString(),
      }
      setBlogs([blogPost, ...blogs]);
      localStorage.setItem('blogs', JSON.stringify([blogPost, ...blogs]));
    } catch (error) {
      console.log(error);
      toast.error('Failed to create blog post');
    } finally{
      setOpen(false);
    }
  }

  const extractVideoId = (url: string) => {
    url = url.trim();
    if (url.includes('v=')) {
      const params = new URLSearchParams(url.split('?')[1]);
      return params.get('v');
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title..." {...field} />
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
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Create Post</Button>
        </div>
      </form>
    </Form>
  );
}