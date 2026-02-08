"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <p className="text-6xl mb-4">{"⚠️"}</p>
      <h1 className="font-heading text-xl tracking-wider text-text-primary mb-2">
        Oops, une erreur est survenue
      </h1>
      <p className="text-text-secondary font-mono text-sm mb-8">
        Quelque chose s&apos;est mal passé. Réessayez dans un instant.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neon-pink text-neon-pink font-heading text-sm uppercase tracking-wider glow-pink hover:bg-neon-pink/10 transition-all duration-200"
      >
        Réessayer
      </button>
    </div>
  );
}
