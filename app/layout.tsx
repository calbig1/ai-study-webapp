import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherStudy",
  description: "Premium AI study platform for focused prep.",
  applicationName: "AetherStudy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AetherStudy"
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#0A1F44"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
