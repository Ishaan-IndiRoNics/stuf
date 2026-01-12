import { BreedIdentifierClient } from './breed-identifier-client';

export default function BreedIdentifierPage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-2">
        Pet Breed Identifier
      </h1>
      <p className="text-muted-foreground mb-6">
        Upload a photo of a pet to identify its breed using AI.
      </p>
      <BreedIdentifierClient />
    </div>
  );
}
