import type { Metadata } from "next";
import { Abril_Fatface, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const abril = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril",
});

export const metadata: Metadata = {
  title: "Project MFS",
  description:
    "Next word prediction with N-gram, Feed Forward Neural Network, and Recursive Neural Network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${abril.variable} ${roboto.variable} h-full antialiased`}>
      <body className={`${roboto.className} min-h-full flex flex-col`}>
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}