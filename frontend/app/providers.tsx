'use client'

import React from "react";
import { SessionProvider } from 'next-auth/react'; // Importa SessionProvider
import AuthProvider from "@/contexts/Auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
