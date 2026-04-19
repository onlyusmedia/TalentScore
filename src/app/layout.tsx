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
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#0D0D0D',
            },
          }}
        />
      </body>
    </html>
  );
}
