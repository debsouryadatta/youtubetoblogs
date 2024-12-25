"use client"

import { BlogPost } from "@/lib/types"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect } from "react";
import { useGlobalStore } from "@/store/store";
import { toast } from "sonner";

interface AppearanceAccordionProps {
  post: BlogPost;
  setPost: (post: BlogPost) => void;
}

export const AppearanceAccordion = ({
  post, setPost
}: AppearanceAccordionProps) => {
  const { blogs, setBlogs } = useGlobalStore();

  useEffect(() => {
    if(post && !post?.fontStyle) {
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            fontStyle: "Roboto",
          }
        }
        return blog;
      })
      setBlogs(updatedBlogs);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      const foundBlog = updatedBlogs.find((blog) => blog.id === post?.id);
      if (foundBlog) {
        setPost(foundBlog);
      }
    }
  }, [post])

  const handleFontStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedBlogs = blogs.map((blog) => {
      if(blog.id === post?.id) {
        return {
          ...blog,
          fontStyle: e.target.value,
        }
      }
      return blog;
    })
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    const foundBlog = updatedBlogs.find((blog) => blog.id === post?.id);
    if (foundBlog) {
      setPost(foundBlog);
    }
    toast.success('Font style updated successfully');
  }

  return (
    <AccordionItem value="appearance">
      <AccordionTrigger>Appearance</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Font</span>
            <select
              onChange={handleFontStyleChange}
              defaultValue={post?.fontStyle ? post.fontStyle : "Roboto"}
              className="rounded-md border p-1"
            >
              <option>Roboto</option>
              <option>Ubuntu</option>
              <option>Outfit</option>
              <option>Itim</option>
            </select>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
