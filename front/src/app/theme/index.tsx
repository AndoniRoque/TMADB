"use client";
import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  breakpoints: {
    base: "0em",
    sm: "80em",
    md: "120em",
    ld: "140em",
    xl: "200em",
  },
});

export default customTheme;
