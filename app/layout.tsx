import type { Metadata } from "next";
import ThemeController from "@/components/ThemeController";
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
    icon: "/icon.svg"
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#0A1F44"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeController />
        {children}
      </body>
    </html>
  );
}
