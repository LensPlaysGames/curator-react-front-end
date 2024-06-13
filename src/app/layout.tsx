import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./clientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curator, vsp.",
  description: "Curator, a video sharing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center p-4">
          <ClientWrapper>
            {// Navbar
            }
            <div className="flex justify-between align-center w-full mb-2">
              <div id="navbar-left">
                <h1>Curator</h1>
              </div>
              <div id="navbar-right">
                <h1>Welcome</h1>
              </div>
            </div>

            {children}
          </ClientWrapper>
        </main>
      </body>
    </html>
  );
}
