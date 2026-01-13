import { FindClient } from './find-client';

export default function FindPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-2">Find Pet Parents</h1>
      <p className="text-muted-foreground mb-6">
        Search for other pet owners in your area.
      </p>
      <FindClient />
    </div>
  );
}
