import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { IconType } from "react-icons";
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
        bg={"black"}
        display={"flex"}
        justifyContent={"space-between"}
        position={"fixed"}
      >
        <Box flex={1}>
          <Image src="TMA_icon.webp" alt="The Magnus Archive logo" h={70} />
        </Box>
        <Box
          display={"flex"}
          flex={2}
          justifyContent={"space-around"}
          color={"white"}
        >
          <Link href={"/episodes"}> Episodes </Link>
          <Link href={"/characters"}> Characters </Link>
          <Link href={"/mindmap"}> Mindmap </Link>
        </Box>
      </Box>
    </>
  );
}

export default Header;
