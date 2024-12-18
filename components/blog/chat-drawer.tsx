import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Loader2, SendHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/lib/types"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import { getChatResponseAction } from "@/app/posts/[id]/actions"
import { useGlobalStore } from "@/store/store"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.css';

export function ChatDrawer({ postId }: { postId: string }) {
  const [input, setInput] = useState("");
  const [chatResponseLoading, setChatResponseLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { blogs, setBlogs } = useGlobalStore();
  const post = blogs.find((p) => p.id === postId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [post?.messages, chatResponseLoading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to ensure drawer content is rendered
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    try {
      setChatResponseLoading(true);
      console.log("Messages: ", post?.messages);
      
      const response = await getChatResponseAction(input, post?.messages || [], post?.subtitles || "");
      console.log("response from chat: ", response);
      const updatedBlogs = blogs.map((blog) => {
        if (blog.id === postId && response) {
          return {
            ...blog,
            messages: [
              ...blog.messages,
              { role: "user" as const, content: input },
              { role: "assistant" as const, content: response },
            ],
          };
        }
        return blog;
      });
      setBlogs(updatedBlogs);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      setInput("");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setChatResponseLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === postId) {
        return {
          ...blog,
          messages: [],
        };
      }
      return blog;
    });
    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    toast.success("Chat cleared successfully");
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm" className="inline-flex">
          Chat with this
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[96vh] p-6">
        <DrawerHeader className="px-0">
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Chat about this blog</span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearChat}
                className="hidden sm:inline-flex"
              >
                Clear Chat
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={clearChat}
                className="sm:hidden"
              >
                Clear
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  ✕
                </Button>
              </DrawerClose>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4" ref={scrollAreaRef}>
          <div className="flex flex-col gap-4">
            {post?.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <AvatarImage src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png" alt="AI" />
                  ) : (
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  )}
                  <AvatarFallback>
                    {message.role === "assistant" ? "AI" : "U"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "flex flex-col rounded-lg p-4 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "text-sm prose dark:prose-invert max-w-none",
                    message.role === "user" && "text-primary-foreground prose-headings:text-primary-foreground prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-em:text-primary-foreground prose-code:text-primary-foreground prose-pre:text-primary-foreground"
                  )}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {chatResponseLoading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                <span>AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 pt-4">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button size="icon" onClick={handleSend} disabled={chatResponseLoading}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
