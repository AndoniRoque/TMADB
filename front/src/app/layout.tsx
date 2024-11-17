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

// TODO: Cambiar todos los alerts por toasts.
// TODO: agregar los personajes ya creados al modal Add Characters para poder seleccionar los que ya estan creados
// TODO: ensanchar la tabla de personajes para que ocupe (mas o menos) el mismo espacio que la de episodios.
// TODO: Agregar buscador para poder filtrar los episodios y personajes.
// TODO: Cambiar la variable showtable para que inicialice en false.
// TODO: Todo tiene que ser responsive.
// TODO: Agregar botones de ordenamiento, por número de episodio, por fecha de lanzamiento (igual a número de episodio?) y por case number!
// Tener en cuenta que case number es una fecha, los primeros tres digitos son el año, el del medio el día y el ultimo el mes.
//  Por ejemplo el caso 0122204 transcurrió el 22 de Abril del 2012. <- ya está para la tabla, agregar para el grid?
// TODO: verificar que pasa si creo personajes al crear un episodio y enumero otros personajes también, un desastre seguro
// TODO: resolver update, le estoy pasando ids que no corresponden con la base de datos o algo asi.
// que se yo. si justamente el numero del episodio es el que quiero editar, al cambiarlo me
// descuaraja la bd
// TODO: en vez de ser una franja totalmente negra, ver si con un gris no queda mejor el REDACTED
// -------------------------------------------------------------------------------------------------------------------
// TODO: los usuarios van a poder marcar y desmarcar qué episodios vieron
