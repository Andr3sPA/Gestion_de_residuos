'user client'

import React from "react";

import AuthProvider from "@/contexts/Auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
    {children}
  </AuthProvider>
}
