import { OnboardingClient } from './onboarding-client';

export default function OnboardingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline">
          Welcome to PetConnect
        </h1>
        <p className="text-muted-foreground mt-2">
          Let&apos;s set up your profile and add your pets.
        </p>
      </div>
      <OnboardingClient />
    </div>
  );
}
