import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import type { BlogPost } from '@/lib/types';

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:bg-accent transition-colors h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
            {post.content.split('\n').slice(2, 5).join(' ').replace(/[#\-*]/g, '')}
          </p>
          <div className="mt-4">
            <Badge variant="secondary">YouTube Blog</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}