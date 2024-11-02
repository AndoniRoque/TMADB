// app/layout.tsx
import { extendTheme } from "@chakra-ui/react";
import { Providers } from "./providers";
import { Special_Elite } from "next/font/google";
import Header from "./components/Header";
import './globals.css'

const typewriter = Special_Elite({
  subsets: ['latin'],
  weight: ['400'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="typewriter.className">
        <body style={{margin: "0px", backgroundColor: "rgba(24,57,43, 1)"}}>
          <Header>{children}</Header>
          <Providers>{children}</Providers>
        </body>
    </html>
  );
}
