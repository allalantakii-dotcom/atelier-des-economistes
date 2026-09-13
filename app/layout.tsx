import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Allal Antaki | L’Atelier des Économistes",
  description: "High-quality academic mentoring in Economics, Management, Marketing, and university success support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#f8f5f0]">{children}</body>
    </html>
  );
}