import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlogPost } from "@/lib/types";
import { PostCard } from "./post-card";

interface CategoryTabsProps {
  blogs: BlogPost[];
}

export function CategoryTabs({ blogs }: CategoryTabsProps) {
  // Get unique categories
  const categories = ["All", ...new Set(blogs.map((blog) => blog.videoType))];

  return (
    <Tabs defaultValue="All" className="w-full">
      <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-lg p-2 rounded-lg">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-primary/10 hover:text-primary rounded-lg"
          >
            {category.toUpperCase() || "Uncategorized"}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category} value={category} className="mt-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {category === "All"
              ? blogs.map((post) => <PostCard key={post.id} post={post} />)
              : blogs
                  .filter((post) => post.videoType === category)
                  .map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
