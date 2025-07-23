import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";
import { InputProvider } from "@/hooks/use-generator-input";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const title = "ASCII Maker";
const description = "Transform text and images into ASCII art";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: "https://asciimaker.wtf",
    siteName: "ASCII Maker",
    title,
    description,
    images: [{ url: "/images/am-og.png", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192.png",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512.png",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  metadataBase: new URL("https://asciimaker.wtf"),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={cn(inter.className, "w-screen")}>
        <QueryProvider>
          <InputProvider>{children}</InputProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
