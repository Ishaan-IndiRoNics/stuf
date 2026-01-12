'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

// A component to render a single post, fetching author details separately
function PostCard({ post }: { post: any }) {
  const firestore = useFirestore();

  // Memoize the document reference for the post's author
  const authorRef = useMemoFirebase(
    () => (post.authorId ? doc(firestore, 'users', post.authorId) : null),
    [post.authorId, firestore]
  );
  
  // Fetch the author's profile
  const { data: author, isLoading: isAuthorLoading } = useDoc(authorRef);

  if (isAuthorLoading) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarFallback><Loader2 className="animate-spin" /></AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
           <div className="h-4 bg-muted rounded w-full" />
           <div className="h-4 bg-muted rounded w-3/4" />
        </CardContent>
      </Card>
    );
  }

  // Format the timestamp
  const timeAgo = post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now';

  return (
    <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={author?.profilePicture} alt={author?.userName} />
          <AvatarFallback>{author?.userName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{author?.userName}</p>
          <p className="text-sm text-muted-foreground">{timeAgo}</p>
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
              className="object-cover"
            />
          </div>
        )}
        <p className="p-4 text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2" />
          <span>{post.likes || 0}</span>
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2" />
          <span>{post.comments || 0}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function SocialFeedPage() {
  const firestore = useFirestore();

  // Memoize the query to fetch posts, ordered by creation date
  const postsQuery = useMemoFirebase(
    () => query(collection(firestore, 'posts'), orderBy('createdAt', 'desc')),
    [firestore]
  );
  
  // Fetch the posts collection
  const { data: posts, isLoading } = useCollection(postsQuery);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-6">Feed</h1>
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
