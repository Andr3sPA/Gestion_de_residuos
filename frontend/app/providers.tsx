'user client'

import React from "react";

import { ChakraProvider } from '@chakra-ui/react'
import { prosectoTheme } from "@/theme";
import AuthProvider from "@/contexts/Auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={prosectoTheme}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ChakraProvider >
}
