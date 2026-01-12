import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { posts } from '@/lib/data';

export default function SocialFeedPage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-6">Feed</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar>
                <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {post.imageUrl && (
                <div className="aspect-square relative w-full">
                  <Image
                    src={post.imageUrl}
                    alt="Pet post"
                    fill
                    data-ai-hint={post.imageHint}
                    className="object-cover"
                  />
                </div>
              )}
              <p className="p-4 text-sm">{post.content}</p>
            </CardContent>
            <CardFooter className="p-4 border-t flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="mr-2" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="mr-2" />
                <span>{post.comments}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
