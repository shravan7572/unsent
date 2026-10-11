import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0d0a08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "अनकहा | Unsent — Say What You Never Could",
  description:
    "An anonymous sanctuary for heartbreaks, unsaid apologies, and the words that were never meant to arrive.",
  keywords: [
    "unsent",
    "letters",
    "anonymous letters",
    "unsaid",
    "अनकहा",
    "heartbreak",
    "confessions",
  ],
  authors: [{ name: "Unsent" }],
  openGraph: {
    title: "अनकहा | Unsent — Say What You Never Could",
    description:
      "An anonymous sanctuary for heartbreaks, unsaid apologies, and the words that were never meant to arrive.",
    type: "website",
    siteName: "Unsent",
  },
  twitter: {
    card: "summary_large_image",
    title: "अनकहा | Unsent — Say What You Never Could",
    description:
      "An anonymous sanctuary for heartbreaks, unsaid apologies, and the words that were never meant to arrive.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0d0a08] text-[#f4efe6]">
        {children}
      </body>
    </html>
  );
}
