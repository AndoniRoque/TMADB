"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { Providers } from "./providers";
import { Special_Elite } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import customTheme from "./theme";
import { ReactFlowProvider } from "reactflow";

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={typewriter.className}>
      <body style={{ margin: "0", backgroundColor: "rgba(24,57,43, 1)" }}>
        <ChakraProvider theme={customTheme}>
          <Providers>
            <ReactFlowProvider>
              <Header />
              <main>{children}</main>
            </ReactFlowProvider>
          </Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}

// TODO: Todo tiene que ser responsive.
