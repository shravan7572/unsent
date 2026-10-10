import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "अनकहा | Unsent — Letters You Never Sent",
  description: "A sanctuary for words left unsaid. Anonymous letters written from the heart, kept forever in the dark.",
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
