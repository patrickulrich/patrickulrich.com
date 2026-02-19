import { useSeoMeta } from '@unhead/react';

export default function Canary() {
  useSeoMeta({
    title: 'Canary | Patrick Ulrich',
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Canary</h1>
        <p className="text-lg text-muted-foreground">
          If this page disappears then something is wrong that I cannot disclose.
        </p>
      </div>
    </div>
  );
}
