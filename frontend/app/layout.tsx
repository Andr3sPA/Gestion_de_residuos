'use client'

import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <Providers>
        <body>
          <Header />
          {children}
        </body>
      </Providers>
    </html >
  );
}
