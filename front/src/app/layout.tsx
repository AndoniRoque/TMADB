// app/layout.tsx
import { extendTheme } from "@chakra-ui/react";
import { Providers } from "./providers";
import { Special_Elite } from "next/font/google";
import Header from "./components/Header";

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
    <html lang="en" className="typewriter.className" suppressHydrationWarning>
      <Header></Header>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
