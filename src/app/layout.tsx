import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./clientWrapper";
import { HOSTNAME } from "@/constants";

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
        <main className="flex flex-col min-h-screen items-center p-4">
          <ClientWrapper>
            {// Navbar
            }
            <div className="flex justify-between align-center w-full mb-2">
              <div id="navbar-left">
                <a href={`${HOSTNAME}`}>
                  <h1>Curator</h1>
                </a>
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
