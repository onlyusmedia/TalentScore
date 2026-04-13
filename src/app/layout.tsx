import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TalentScore — AI-Powered Hiring Intelligence",
  description: "Transform hiring from guesswork into structured, data-driven decisions. Upload job posts, analyze resumes, score interviews, and rank candidates automatically.",
  keywords: "hiring, recruitment, AI, candidate scoring, interview analysis, resume screening",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            },
          }}
        />
      </body>
    </html>
  );
}
