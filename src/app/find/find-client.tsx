'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Search, Dog, Cat, Bird, Rabbit } from 'lucide-react';

const PetTypeIcons = {
  Dog: <Dog className="h-4 w-4" />,
  Cat: <Cat className="h-4 w-4" />,
  Bird: <Bird className="h-4 w-4" />,
  Rabbit: <Rabbit className="h-4 w-4" />,
};

// Mock search results for now
const mockUsers = [
  { id: '1', userName: 'Alex', profilePicture: 'https://picsum.photos/seed/user1/100', bio: 'Loves long walks with my golden retriever.', pets: [{ name: 'Buddy', type: 'Dog', breed: 'Golden Retriever', imageUrl: 'https://picsum.photos/seed/pet1/200' }] },
  { id: '2', userName: 'Maria', profilePicture: 'https://picsum.photos/seed/user2/100', bio: 'Cat mom of two, obsessed with their fluffiness.', pets: [{ name: 'Luna', type: 'Cat', breed: 'Siamese', imageUrl: 'https://picsum.photos/seed/pet2/200' }, { name: 'Milo', type: 'Cat', breed: 'Tabby', imageUrl: 'https://picsum.photos/seed/pet3/200' }] },
  { id: '3', userName: 'David', profilePicture: 'https://picsum.photos/seed/user3/100', bio: 'Just a guy and his rabbit.', pets: [{ name: 'Thumper', type: 'Rabbit', breed: 'Holland Lop', imageUrl: 'https://picsum.photos/seed/pet4/200' }] },
];


export function FindClient() {
  const [distance, setDistance] = useState([25]);
  const [petType, setPetType] = useState('all');
  const [breed, setBreed] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // In a real app, you would perform a Firestore query here based on the filters.
    // For now, we'll just simulate a search and return mock data.
    setTimeout(() => {
      setResults(mockUsers);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label htmlFor="distance" className="text-sm font-medium">Distance ({distance[0]} miles)</label>
              <Slider
                id="distance"
                min={1}
                max={100}
                step={1}
                value={distance}
                onValueChange={setDistance}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pet-type" className="text-sm font-medium">Pet Type</label>
              <Select value={petType} onValueChange={setPetType}>
                <SelectTrigger id="pet-type">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Type</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <label htmlFor="breed" className="text-sm font-medium">Breed</label>
              <Input id="breed" placeholder="e.g., Golden Retriever" value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
            <Button type="submit" className="md:col-start-4 w-full" disabled={isSearching}>
              {isSearching ? <Loader2 className="animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
         <h2 className="text-2xl font-bold font-headline">Results</h2>
         {isSearching ? (
             <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
         ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(user => (
                    <Card key={user.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user.profilePicture} alt={user.userName} />
                                    <AvatarFallback>{user.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/profile/${user.id}`} className="hover:underline">
                                        <h3 className="text-lg font-bold font-headline">{user.userName}</h3>
                                    </Link>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                               <h4 className="text-sm font-semibold">Pets</h4>
                               {user.pets.map((pet: any) => (
                                   <div key={pet.name} className="flex items-center gap-3 text-sm">
                                       <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                           <Image src={pet.imageUrl} alt={pet.name} fill className="object-cover" />
                                       </div>
                                       <div>
                                           <p className="font-medium">{pet.name}</p>
                                           <p className="text-muted-foreground text-xs">{pet.breed}</p>
                                       </div>
                                   </div>
                               ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
         ) : (
             <div className="text-center p-12 border border-dashed rounded-lg">
                 <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
             </div>
         )}
      </div>
    </div>
  );
}
