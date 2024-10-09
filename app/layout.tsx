import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Quicksand } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "auto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={quicksand.className}>
      <Providers>
        <body className="flex flex-col gap-8 min-h-screen items-center">
          <Header />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
