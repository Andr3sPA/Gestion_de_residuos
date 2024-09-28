'use client'

import React from "react";
import { SessionProvider } from 'next-auth/react'; // Importa SessionProvider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
