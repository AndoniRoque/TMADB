import { Box, Image, Text } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode } from "react";
import Link from "next/link";

function Header({
  children,
  isOpen,
  onClose,
  onOpen,
}: {
  children: ReactNode;
  isOpen?: any;
  onClose?: any;
  onOpen?: any;
}) {
  return (
    <>
      <Head>
        <title>The Magnus Archives Database</title>
        <meta name="description" content="The Magnus Archive Database" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box
        w={"100%"}
        p={4}
        m={0}
        minH={"10vh"}
        bg="conic-gradient(from 90deg at 77% 50%, #0f1110, #252b26)"
        backgroundColor={"black"}
        boxShadow={"0 4px 15px rgba(0, 0, 0, 0.4)"}
        display={"flex"}
        justifyContent={"space-between"}
        position={"fixed"}
        top={0}
        zIndex={2}
      >
        <Box display={"flex"} justifyContent={"start"} alignItems={"center"}>
          <Image
            src="/TMA_icon.webp"
            alt="The Magnus Archive logo"
            h={90}
            zIndex={2}
          />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          h={90}
          flex={1}
        >
          <Text
            color={"rgba(236, 223, 204, 0.8)"}
            fontSize={"4xl"}
            fontWeight={"bold"}
          >
            The Magnus Archive Database
          </Text>
        </Box>
        <Box
          display={"flex"}
          flex={2}
          justifyContent={"end"}
          color={"rgba(236, 223, 204, 0.8)"}
        >
          <Link href={"/episodes"}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              h={"100%"}
              w={"15vh"}
              fontSize={"xl"}
              _hover={{
                color: "#ECDFCC",
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              Episodes
            </Box>
          </Link>
          <Link href="/characters">
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              h={"100%"}
              w={"15vh"}
              fontSize={"xl"}
              _hover={{
                color: "#ECDFCC",
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              Characters
            </Box>
          </Link>
          <Link href="/mindmap">
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              fontSize={"xl"}
              h={"100%"}
              w={"15vh"}
              _hover={{
                color: "#ECDFCC",
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              }}
            >
              Mindmap
            </Box>
          </Link>
        </Box>
      </Box>
    </>
  );
}

export default Header;

// TODO: si creo personajes se van a agregar al endpoint de personajes y si entro a la pantalla de el episodio, obviamente los personajes no van a estar agregador ahi, pero tendría que poder hacer un Edit Episode para agregar los personajes faltantes.
