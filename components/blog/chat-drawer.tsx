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
import { Loader2, SendHorizontal, Copy, BookmarkPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BlogPost, Message } from "@/lib/types"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

interface AddToNotesDialogProps {
  message: Message;
  postId: string;
  triggerId: string;
  post: BlogPost;
  setPost: (post: BlogPost) => void;
}

function AddToNotesDialog({ message, postId, triggerId, post, setPost }: AddToNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const { blogs, setBlogs } = useGlobalStore();

  const handleAddToNotes = () => {
    if (!title.trim()) return;

    try {
      const note = {
        id: Date.now().toString(),
        title: title.trim(),
        date: format(new Date(), "yyyy-MM-dd"),
        content: message.content
      };

      const updatedBlogs = blogs.map((blog) => {
        if (blog.id === postId) {
          return {
            ...blog,
            notes: [...blog.notes!, note],
          };
        }
        return blog;
      });
      setBlogs(updatedBlogs);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      const foundBlog = updatedBlogs.find((blog) => blog.id === postId);
      if (foundBlog) {
        setPost(foundBlog);
      }

      setOpen(false);
      setTitle("");
      toast.success("Added to notes successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to notes");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button id={triggerId} className="hidden" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              readOnly
              value={message.content}
              className="h-[200px] resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAddToNotes}>Add to Notes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ChatDrawer({ postId, post, setPost }: { postId: string, post: BlogPost, setPost: (post: BlogPost) => void }) {
  const [input, setInput] = useState("");
  const [chatResponseLoading, setChatResponseLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { blogs, setBlogs } = useGlobalStore();
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
      
      const response = await getChatResponseAction(input, post?.messages || [], post?.subtitles || "", postId);
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
      const foundBlog = updatedBlogs.find((blog) => blog.id === postId);
      if (foundBlog) {
        setPost(foundBlog);
      }
      setInput("");
    } catch (error: any) {
      console.log(error);
      if(error.message === "Rate limit exceeded. Please try again later.") {
        toast.error("Rate limit exceeded. Please try again later.");
      } else {
        toast.error("Something went wrong");
      }
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
    const foundBlog = updatedBlogs.find((blog) => blog.id === postId);
    if (foundBlog) {
      setPost(foundBlog);
    }
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
                  "flex items-start gap-3 group",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <AvatarImage src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png" alt="AI" />
                  ) : message.role === "user" ? (
                    <AvatarImage src="https://github.com/shadcn.png" alt="AI" />
                  ) : (
                    <AvatarFallback>U</AvatarFallback>
                  )}
                </Avatar>
                <div className={cn(
                  "flex flex-col flex-1 gap-2",
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "rounded-lg px-3 py-2",
                    message.role === "assistant" ? "bg-muted" : "bg-primary",
                    message.role === "user" ? "max-w-[85%]" : "max-w-[90%]",
                  )}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                      className={cn(
                        "prose prose-sm dark:prose-invert max-w-none",
                        message.role === "user" ? "text-white dark:text-black" : "text-black dark:text-white")}
                      components={{
                        p: ({ node, children, ...props }) => {
                          const hasPre = (Array.isArray(children) 
                            ? children.some((child: any) => child?.type === 'pre')
                            : false);
                          
                          return hasPre ? <>{children}</> : <div {...props}>{children}</div>;
                        },
                        pre: ({ node, ...props }) => <pre className="whitespace-pre-wrap" {...props} />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className={cn(
                    "flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 text-xs font-normal px-1 sm:px-3"
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                        toast.success("Copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-normal px-1 sm:px-3"
                      onClick={() => {
                        const dialogTrigger = document.getElementById(`note-dialog-${index}`);
                        if (dialogTrigger) {
                          (dialogTrigger as HTMLButtonElement).click();
                        }
                      }}
                    >
                      <BookmarkPlus className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">Add to Notes</span>
                    </Button>
                    <div className="hidden">
                      <AddToNotesDialog message={message} postId={postId} triggerId={`note-dialog-${index}`} post={post} setPost={setPost} />
                    </div>
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
