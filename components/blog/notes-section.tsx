"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenLine, Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGlobalStore } from "@/store/store";
import { BlogPost } from "@/lib/types";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.css';
import { CodeBlock } from "@/components/ui/code-block";

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
}

const demoNotes: Note[] = [
  {
    id: "1",
    title: "Array Operations",
    date: "2023-12-24",
    content: `"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam re`
  },
  {
    id: "2",
    title: "Dynamic Programming",
    date: "2023-12-23",
    content: "Notes on DP concepts including memoization and tabulation..."
  },
  {
    id: "3",
    title: "Hash Tables",
    date: "2023-12-22",
    content: "Implementation details of hash tables and collision resolution..."
  }
];

export function NotesSection({post, setPost}: {post: BlogPost, setPost: (post: BlogPost) => void}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const {blogs, setBlogs} = useGlobalStore();

  useEffect(() => {
    setNotes(post?.notes || []);
  }, [post])

  useEffect(() => {
    if(post && !post?.notes) {
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            notes: [],
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
  

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      date: format(new Date(), "yyyy-MM-dd"),
      content: newNote.content
    };

    const updatedBlogs = blogs.map((blog) => {
      if(blog.id === post?.id) {
        return {
          ...blog,
          notes: [...blog.notes!, note],
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

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: "", content: "" });
    setIsCreateDialogOpen(false);
  };

  const handleEditNote = () => {
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) return;

    try {
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            notes: blog.notes?.map(note => 
              note.id === editingNote.id 
                ? { ...editingNote, date: format(new Date(), "yyyy-MM-dd") }
                : note
            ),
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
  
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...editingNote, date: format(new Date(), "yyyy-MM-dd") }
          : note
      ));
      setEditingNote(null);
      setIsEditDialogOpen(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = () => {
    if (!deletingNoteId) return;

    try {
      const updatedBlogs = blogs.map((blog) => {
        if(blog.id === post?.id) {
          return {
            ...blog,
            notes: blog.notes?.filter(note => note.id !== deletingNoteId),
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
  
      setNotes(prev => prev.filter(note => note.id !== deletingNoteId));
      setDeletingNoteId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete note");
    }
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (noteId: string) => {
    setDeletingNoteId(noteId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="w-full space-y-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Added Notes
          </h2>
          <p className="text-sm text-muted-foreground">
            Capture and organize your thoughts
          </p>
        </div>
        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/20 shadow-sm">
          {notes.length} Notes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => (
          <Dialog key={note.id}>
            <div
              className={cn(
                "group relative cursor-pointer space-y-4 rounded-xl border bg-card/50 backdrop-blur-sm p-6",
                "transition-all duration-300 ease-in-out",
                "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                "dark:hover:shadow-primary/10 hover:-translate-y-1",
                "animate-fade-up",
                "hover:bg-accent/50"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(note)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => openDeleteDialog(note.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DialogTrigger asChild>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-primary">
                    {note.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{note.date}</span>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogTrigger asChild>
                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80">
                  {note.content}
                </p>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[625px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">{note.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{note.date}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      p: ({ node, children, ...props }) => {
                        const hasPre = (Array.isArray(children) 
                          ? children.some((child: any) => child?.type === 'pre')
                          : false);
                        
                        return hasPre ? <>{children}</> : <div {...props}>{children}</div>;
                      },
                      pre: ({ node, children, ...props }) => (
                        <CodeBlock node={node} {...props}>{children}</CodeBlock>
                      )
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <div
              className={cn(
                "group relative cursor-pointer rounded-xl border-2 border-dashed",
                "transition-all duration-300 ease-in-out animate-fade-up",
                "hover:border-primary hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/5",
                "dark:hover:shadow-primary/10 hover:-translate-y-1",
                "flex flex-col items-center justify-center min-h-[220px] gap-3",
                "backdrop-blur-sm"
              )}
              style={{ animationDelay: `${notes.length * 100}ms` }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-all duration-300 group-hover:bg-primary/30" />
                <div className="relative rounded-full bg-primary/10 p-4 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
                  <PenLine className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary">
                  Create New Note
                </p>
                <p className="text-xs text-muted-foreground px-4">
                  Add your thoughts and ideas
                </p>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your note content..."
                  className="min-h-[200px] resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewNote({ title: "", content: "" });
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  className="bg-primary/90 hover:bg-primary"
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                >
                  Create Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Edit Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNote?.title || ""}
                  onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Enter note title..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingNote?.content || ""}
                  onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                  placeholder="Write your note content..."
                  className="min-h-[200px] resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingNote(null);
                    setIsEditDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditNote}
                  className="bg-primary/90 hover:bg-primary"
                  disabled={!editingNote?.title.trim() || !editingNote?.content.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingNoteId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteNote}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
