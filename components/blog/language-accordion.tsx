"use client"

import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Loader2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react";
import { BlogPost } from "@/lib/types";
import { useGlobalStore } from "@/store/store";
import { changeLangAction } from "@/app/posts/[id]/actions";
import { toast } from "sonner";

interface LanguageAccordionProps {
  post: BlogPost;
  setPost: (post: BlogPost) => void;
}

export const LanguageAccordion = ({post, setPost}: LanguageAccordionProps) => {
  const { blogs, setBlogs } = useGlobalStore();
  const [language, setLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    setLanguage(post?.language || "en");
  }, [post])

  useEffect(() => {
    if(post && !post?.language) {
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            language: "en",
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

  const handleLanguageChange = async () => {
    try {
      setLoading(true);
      const lang = language === "en" ? "english" : language === "hi" ? "hindi" : language === "bn" ? "bengali" : language === "es" ? "spanish" : language === "fr" ? "french" : language === "de" ? "german" : "english";
      const changeLangContent = await changeLangAction(post?.content, lang);
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            content: changeLangContent!,
            language: language,
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
      toast.success('Language changed successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to change language');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AccordionItem value="language">
      <AccordionTrigger>Language</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>Select Language</span>
              <select onChange={(e) => setLanguage(e.target.value)} className="rounded-md border p-1 w-32" defaultValue={post?.language || "en"}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <Button
              variant="secondary"
              className="w-full flex justify-center items-center"
              onClick={handleLanguageChange}
              disabled={loading}
            >
              <span>
                <Sparkles className="mr-2 h-4 w-4" />
              </span>
              <span>Change Language With AI</span>
              {loading && <Loader2 className="ml-2 animate-spin w-5 h-5 -mt-[2px]" />}
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
