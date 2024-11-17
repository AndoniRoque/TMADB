"use client";
import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "96em",
  },
  colors: {
    customGreen: {
      50: "#e6f9e6", // Verde muy claro
      100: "#c2eac2", // Verde pastel claro
      200: "#99da99", // Verde suave
      300: "#70ca70", // Verde intermedio
      400: "#47ba47", // Verde base brillante
      500: "#28a828", // Verde base
      600: "#208720", // Verde más oscuro
      700: "#186618", // Verde profundo
      800: "#104410", // Verde oscuro intenso
      900: "#082208", // Verde casi negro
    },
  },
});

export default customTheme;
