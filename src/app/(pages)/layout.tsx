'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import Header from "@/components/utils/Header";
import Footer from "@/components/utils/Footer";
import { Provider } from "react-redux";
import { store } from "@/store";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Explorer.com",
//   description: "Created by Nasim",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Provider store={store} >
      <Header />
      <main>{ children }</main>
      <Footer />
    </Provider>
    </>

  );
}