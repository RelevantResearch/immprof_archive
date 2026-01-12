import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Immigration Professors Blog Archive, 2005 - 2025",
  description: "Professional news and insights on immigration law and policy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">
                  Immigration Professors Blog Archive, 2005 - 2025
                </h1>
              </a>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-slate-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} Immigration Professors Blog Archive,
              2005 - 2025, 2005 - 2025. All rights reserved.
            </p>
            <p className="text-center text-gray-400 mt-2">
              Developed by{" "}
              <a
                href="https://relevant-research.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Relevant Research
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
