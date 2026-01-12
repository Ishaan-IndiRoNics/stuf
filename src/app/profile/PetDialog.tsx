'use client';

import { useState, type ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { doc, collection, arrayUnion } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { identifyPetBreedFromImage } from '@/ai/flows/identify-pet-breed-from-image';

const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().min(1, 'Pet breed is required'),
  age: z.string().min(1, 'Pet age is required'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional(),
  imageUrl: z.string().url('Invalid URL').optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

interface PetDialogProps {
  pet?: PetFormValues & { id: string };
  children: ReactNode;
}

const fileToDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function PetDialog({ pet, children }: PetDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);


  const form = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: pet || { name: '', breed: '', age: '', bio: '', imageUrl: '' },
  });
  
  useEffect(() => {
    if (isOpen) {
      form.reset(pet || { name: '', breed: '', age: '', bio: '', imageUrl: '' });
      setImageFile(null);
    }
  }, [isOpen, pet, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsIdentifying(true);
      try {
        const dataUri = await fileToDataUri(file);
        const result = await identifyPetBreedFromImage({ photoDataUri: dataUri });
        if (result.identifiedBreed) {
          form.setValue('breed', result.identifiedBreed);
          toast({ title: 'Breed Identified!', description: `We think it's a ${result.identifiedBreed}.` });
        }
      } catch (error) {
        console.error("Error identifying breed:", error);
        toast({ variant: 'destructive', title: 'Could not identify breed.' });
      } finally {
        setIsIdentifying(false);
      }
    }
  };


  const onSubmit = async (data: PetFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      if (pet) {
        // Update existing pet
        const petRef = doc(firestore, 'pets', pet.id);
        updateDocumentNonBlocking(petRef, data);
        toast({ title: 'Pet Updated!', description: `${data.name}'s profile has been updated.` });
      } else {
        // Add new pet
        const petRef = doc(collection(firestore, 'pets'));
        const newPet = { ...data, id: petRef.id, ownerId: user.uid };
        setDocumentNonBlocking(petRef, newPet, {});

        // Update user's petIds
        const userRef = doc(firestore, 'users', user.uid);
        updateDocumentNonBlocking(userRef, {
            petIds: arrayUnion(petRef.id)
        });

        toast({ title: 'Pet Added!', description: `${data.name} has joined your family.` });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving pet:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save pet details.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pet ? 'Edit Pet' : 'Add a New Pet'}</DialogTitle>
          <DialogDescription>
            {pet ? `Update the details for ${pet.name}.` : 'Enter the details for your new companion.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Buddy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input placeholder="Golden Retriever" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="2 years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Loves long walks..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Photo</FormLabel>
               <FormControl>
                <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isIdentifying} />
              </FormControl>
              {isIdentifying && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Identifying breed...</p>}
            </FormItem>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || isIdentifying}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
