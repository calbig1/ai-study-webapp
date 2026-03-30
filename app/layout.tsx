import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudySmarter AI",
  description: "Upload notes. Study smarter. Ace your test."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
