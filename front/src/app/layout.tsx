// app/layout.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { Providers } from "./providers";
import { Special_Elite } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import customTheme from "./theme";

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
      <body style={{ margin: "0px", backgroundColor: "rgba(24,57,43, 1)" }}>
        <ChakraProvider theme={customTheme}>
          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </ChakraProvider>
      </body>
    </html>
  );
}

// TODO: Agregar buscador para poder filtrar los episodios y personajes.
// TODO: Que las cards de episodes y characters ocupen el mismo espacio
// TODO: ensanchar la tabla de personajes para que ocupe (mas o menos) el mismo espacio que la de episodios.
// TODO: Todo tiene que ser responsive.
// TODO: resolver update, le estoy pasando ids que no corresponden con la base de datos o algo asi.
// que se yo. si justamente el numero del episodio es el que quiero editar, al cambiarlo me
// descuaraja la bd
// -------------------------------------------------------------------------------------------------------------------
// TODO: los usuarios van a poder marcar y desmarcar qué episodios vieron
