// app/providers.tsx
"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({
    fonts: {
      heading: `, sans-serif`,
      body: `$, sans-serif`,
    },
    colors: {
      muni: {
        verde: "#95C840",
        celeste: "#4093C8",
      },
    },
  });
  return (
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
  );
}
