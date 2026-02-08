import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FestMap 2026 — Tous les festivals de musique",
    template: "%s | FestMap 2026",
  },
  description:
    "Tous les festivals de musique en France et en Europe pour l'été 2026. Trouvez votre prochain festival par genre, date ou localisation.",
  keywords: [
    "festival",
    "musique",
    "2026",
    "france",
    "europe",
    "concerts",
    "lineup",
  ],
  openGraph: {
    title: "FestMap 2026",
    description:
      "Tous les festivals de musique de l'été 2026 en un seul endroit",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen relative">
        <Header />
        <main className="relative z-10 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <footer className="relative z-10 py-4 text-center text-xs text-text-secondary/60 font-mono">
          © {new Date().getFullYear()} Vigimon
        </footer>
      </body>
    </html>
  );
}
