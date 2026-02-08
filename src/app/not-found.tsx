import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <p className="font-heading text-8xl text-neon-pink text-glow-pink mb-4 animate-neon-flicker">
        404
      </p>
      <h1 className="font-heading text-xl tracking-wider text-text-primary mb-2">
        Festival non trouvé
      </h1>
      <p className="text-text-secondary font-mono text-sm mb-8">
        Ce festival n&apos;existe pas ou a été déplacé.
      </p>
      <Link
        href="/festivals"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neon-cyan text-neon-cyan font-heading text-sm uppercase tracking-wider glow-cyan hover:bg-neon-cyan/10 transition-all duration-200"
      >
        Voir tous les festivals
      </Link>
    </div>
  );
}
