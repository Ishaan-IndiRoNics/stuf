'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Loader2, Calendar, MapPin, Users, Dog, Cat, Bird, Rabbit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function EventCard({ event }: { event: any }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const authorRef = useMemoFirebase(
        () => (event.authorId ? doc(firestore, 'users', event.authorId) : null),
        [event.authorId, firestore]
    );
    const { data: author } = useDoc(authorRef);

    const isAttending = user && event.attendees?.includes(user.uid);
    const isOwner = user && event.authorId === user.uid;

    const handleRsvp = () => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Not logged in',
                description: 'You need to be logged in to RSVP.',
            });
            return;
        }

        const eventRef = doc(firestore, 'events', event.id);
        updateDocumentNonBlocking(eventRef, {
            attendees: isAttending ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });

        toast({
            title: isAttending ? 'RSVP Canceled' : 'RSVP Successful!',
            description: isAttending ? "We've removed you from the guest list." : "You are now on the guest list.",
        });
    };

    const PetTypeIcons: { [key: string]: React.ReactNode } = {
        Dog: <Dog className="h-4 w-4" />,
        Cat: <Cat className="h-4 w-4" />,
        Bird: <Bird className="h-4 w-4" />,
        Rabbit: <Rabbit className="h-4 w-4" />,
        All: <Users className="h-4 w-4" />
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{event.title}</CardTitle>
                <CardDescription>
                    Organized by <Link href={`/profile/${author?.id}`} className="text-primary hover:underline">{author?.userName || 'a user'}</Link>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm">{event.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(event.date.toDate(), 'PPP @ p')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                     <div className="flex items-center gap-2" title={`For ${event.petType}`}>
                        {PetTypeIcons[event.petType] || PetTypeIcons['All']}
                        <span>{event.petType}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <div className="flex items-center -space-x-2">
                    {event.attendees?.slice(0, 5).map((attendeeId: string) => (
                        <AttendeeAvatar key={attendeeId} userId={attendeeId} />
                    ))}
                     {event.attendees?.length > 5 && (
                        <Avatar className="h-8 w-8 border-2 border-background">
                            <AvatarFallback>+{event.attendees.length - 5}</AvatarFallback>
                        </Avatar>
                    )}
                </div>

                {!isOwner && (
                    <Button variant={isAttending ? 'secondary' : 'default'} onClick={handleRsvp}>
                        {isAttending ? 'Cancel RSVP' : 'RSVP'}
                    </Button>
                )}
                 {isOwner && <Button variant="outline" disabled>You are the organizer</Button>}
            </CardFooter>
        </Card>
    )
}

function AttendeeAvatar({ userId }: { userId: string }) {
    const firestore = useFirestore();
     const userRef = useMemoFirebase(
        () => doc(firestore, 'users', userId),
        [userId, firestore]
    );
    const { data: userProfile } = useDoc(userRef);

    return (
        <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarImage src={userProfile?.profilePicture} alt={userProfile?.userName}/>
            <AvatarFallback>{userProfile?.userName?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
    )
}

export function EventsClient() {
  const { user } = useUser();
  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, 'events'), orderBy('date', 'asc')) : null),
    [firestore, user]
  );
  
  const { data: events, isLoading } = useCollection(eventsQuery);
  
  return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Community Events</h1>
            <p className="text-muted-foreground">Find and join pet-friendly events near you.</p>
          </div>
          <Button asChild>
            <Link href="/create-event">Create Event</Link>
          </Button>
        </div>

        {isLoading && (
            <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        )}

        {!isLoading && events?.length === 0 && (
            <div className="text-center p-12 border border-dashed rounded-lg">
                 <p className="text-muted-foreground">No events found. Why not create one?</p>
             </div>
        )}

        <div className="space-y-6">
            {events?.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
      </div>
  )
}
