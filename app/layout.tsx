import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["200", "400", "500"],
});

export const metadata: Metadata = {
  title: "Kaheatano",
  description: "An app that says what your next meal is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${geistSans.variable} flex min-h-screen items-center justify-center bg-white antialiased dark:bg-zinc-900`}
      >
        {children}
      </body>
    </html>
  );
}
