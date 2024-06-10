import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explorer.com",
  description: "Created by Nasim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <link rel="icon" href="/favicon.png" sizes="any" />
        <AuthProvider>
        {children}
        </AuthProvider>
          <Toaster position='top-right' toastOptions={{ className: 'react-hot-toast' }} />
      </body>
    </html>
  );
}
