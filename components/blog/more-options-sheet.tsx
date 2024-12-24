"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useGlobalStore } from "@/store/store"
import { BlogPost } from "@/lib/types"
import { useEffect } from "react"
import { Sparkles } from "lucide-react"

export function MoreOptionsSheet({post, setPost}: {post: BlogPost, setPost: (post: BlogPost) => void}) {
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
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <span>More Options</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Additional Options</SheetTitle>
          <SheetDescription>
            Configure additional settings and preferences
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="appearance">
              <AccordionTrigger>Appearance</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Font</span>
                    <select onChange={handleFontStyleChange} defaultValue={post?.fontStyle ? post.fontStyle : "Roboto"} className="rounded-md border p-1">
                      <option>Roboto</option>
                      <option>Ubuntu</option>
                      <option>Outfit</option>
                      <option>Itim</option>
                    </select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* <AccordionItem value="language">
              <AccordionTrigger>Language</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span>Select Language</span>
                      <select 
                        className="rounded-md border p-1 w-32"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                      </select>
                    </div>
                    <Button 
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        // Language change function will be implemented here
                        console.log("Language change clicked");
                      }}
                    >
                    <span><Sparkles className="mr-2 h-4 w-4" /></span>
                      Change Language With AI
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
