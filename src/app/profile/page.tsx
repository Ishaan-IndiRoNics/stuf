import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { currentUser } from '@/lib/data';
import { Edit } from 'lucide-react';

export default function ProfilePage() {
  const user = currentUser;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-6">Profile</h1>
      </div>
      <Card className="overflow-hidden">
        <div className="h-32 bg-secondary" />
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 -mt-16 p-6">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
            <CardDescription>{user.handle}</CardDescription>
            <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
          </div>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">My Pets</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {user.pets.map((pet) => (
            <Card key={pet.name}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                  <Image
                    src={pet.imageUrl}
                    alt={pet.name}
                    data-ai-hint={pet.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="font-headline">{pet.name}</CardTitle>
                  <CardDescription>
                    {pet.breed} &bull; {pet.age}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{pet.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
