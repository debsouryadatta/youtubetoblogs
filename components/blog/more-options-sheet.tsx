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
import { Accordion } from "@/components/ui/accordion"
import { BlogPost } from "@/lib/types"
import { AppearanceAccordion } from "@/components/blog/appearance-accordion"
import { LanguageAccordion } from "@/components/blog/language-accordion"

export function MoreOptionsSheet({
  post,
  setPost,
}: {
  post: BlogPost;
  setPost: (post: BlogPost) => void;
}) {  
  
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
            <AppearanceAccordion post={post} setPost={setPost} />
            <LanguageAccordion post={post} setPost={setPost} />
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
