"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesSection } from "@/components/blog/notes-section";
import { BlogPost } from "@/lib/types";

export function TabsSection({post, setPost}: {post: BlogPost, setPost: (post: BlogPost) => void}) {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="concept-check">Concept Check</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="mt-6">
        <NotesSection post={post!} setPost={setPost} />
      </TabsContent>
      <TabsContent value="concept-check" className="mt-6">
        <div className="w-48 h-48">Coming Soon!</div>
      </TabsContent>
      <TabsContent value="flashcards" className="mt-6">
        <div className="w-48 h-48">Coming Soon!</div>
      </TabsContent>
    </Tabs>
  );
}
