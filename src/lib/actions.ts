'use server';

import {
  identifyPetBreedFromImage,
  type IdentifyPetBreedFromImageOutput,
} from '@/ai/flows/identify-pet-breed-from-image';
import { z } from 'zod';

const IdentifyPetBreedSchema = z.object({
  photoDataUri: z.string().startsWith('data:image/'),
});

type ActionState = {
  success: boolean;
  data?: IdentifyPetBreedFromImageOutput | null;
  error?: string | null;
};

export async function identifyBreedAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const photoDataUri = formData.get('photoDataUri') as string;
    const validation = IdentifyPetBreedSchema.safeParse({ photoDataUri });

    if (!validation.success) {
      console.error('Validation Error:', validation.error.flatten());
      return {
        success: false,
        error: 'Invalid image format. Please upload a valid image.',
      };
    }

    const result = await identifyPetBreedFromImage({
      photoDataUri: validation.data.photoDataUri,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Action Error:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
