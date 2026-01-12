'use client';

import { useState, useRef, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { identifyBreedAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, X, Loader2, Dog } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialState = {
  success: false,
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Identifying...
        </>
      ) : (
        'Identify Breed'
      )}
    </Button>
  );
}

const fileToDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function BreedIdentifierClient() {
  const [formState, formAction] = useFormState(identifyBreedAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const dataUri = await fileToDataUri(file);
    const formData = new FormData();
    formData.append('photoDataUri', dataUri);
    formAction(formData);
  };
  
  useEffect(() => {
    if (formState.success) {
      handleRemoveImage();
    }
  }, [formState.success])


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="space-y-4"
          >
            {imagePreview ? (
              <div className="relative group w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                <Image
                  src={imagePreview}
                  alt="Pet preview"
                  fill
                  className="object-contain rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="pet-image"
                className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or WEBP
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id="pet-image"
                  name="image"
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {file && <SubmitButton />}
          </form>
        </CardContent>
      </Card>

      {formState.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}

      {formState.success && formState.data && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dog />
              Identification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Identified Breed</p>
              <p className="text-2xl font-bold font-headline">
                {formState.data.identifiedBreed}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <div className="flex items-center gap-2">
                <Progress
                  value={formState.data.confidence * 100}
                  className="w-full"
                />
                <span className="font-mono text-sm font-semibold">
                  {Math.round(formState.data.confidence * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
