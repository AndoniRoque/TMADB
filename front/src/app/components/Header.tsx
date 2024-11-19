"use client";
import {
  Box,
  Image,
  Text,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactNode, useRef } from "react";
import Link from "next/link";
import { HamburgerIcon } from "@chakra-ui/icons";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Head>
        <title>The Magnus Archives Database</title>
        <meta name="description" content="The Magnus Archive Database" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Desktop Header */}
      <Flex
        w="100%"
        p={4}
        minH="10vh"
        bg="conic-gradient(from 90deg at 77% 50%, #0f1110, #252b26)"
        backgroundColor="black"
        boxShadow="0 4px 15px rgba(0, 0, 0, 0.4)"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        zIndex={2}
        display={{ base: "none", md: "flex" }}
      >
        {/* Logo */}
        <Flex justifyContent="start" alignItems="center">
          <Image
            src="/TMA_icon.webp"
            alt="The Magnus Archive logo"
            h={90}
            zIndex={2}
          />
        </Flex>

        {/* Title */}
        <Flex justifyContent="center" alignItems="center" flex={1}>
          <Text
            color="rgba(236, 223, 204, 0.8)"
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
          >
            The Magnus Archive Database
          </Text>
        </Flex>

        {/* Navigation Links */}
        <Box flex={1}>
          <Flex
            flex={2}
            justifyContent="space-evenly"
            color="rgba(236, 223, 204, 0.8)"
            gap={4}
          >
            {["Episodes", "Characters", "Mindmap"].map((link) => (
              <Link key={link.toLowerCase()} href={`/${link.toLowerCase()}`}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  h="100%"
                  w="15vh"
                  fontSize="xl"
                  _hover={{
                    color: "#ECDFCC",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {link}
                </Box>
              </Link>
            ))}
          </Flex>
        </Box>
      </Flex>

      {/* Mobile Header */}
      <Flex
        w="100%"
        p={4}
        minH="10vh"
        bg="conic-gradient(from 90deg at 77% 50%, #0f1110, #252b26)"
        backgroundColor="black"
        boxShadow="0 4px 15px rgba(0, 0, 0, 0.4)"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        zIndex={2}
        display={{ base: "flex", md: "none" }}
      >
        <Image
          src="/TMA_icon.webp"
          alt="The Magnus Archive logo"
          h={50}
          zIndex={2}
        />

        <Text
          color="rgba(236, 223, 204, 0.8)"
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
        >
          TMA Database
        </Text>

        <IconButton
          ref={btnRef}
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
          colorScheme="whiteAlpha"
          aria-label="Open Menu"
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="black" color="rgba(236, 223, 204, 0.8)">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Flex flexDirection="column" gap={4}>
              {["Episodes", "Characters", "Mindmap"].map((link) => (
                <Link
                  key={link.toLowerCase()}
                  href={`/${link.toLowerCase()}`}
                  onClick={onClose}
                >
                  <Box
                    p={3}
                    textAlign="center"
                    fontSize="xl"
                    _hover={{
                      bg: "rgba(236, 223, 204, 0.2)",
                      color: "#ECDFCC",
                    }}
                  >
                    {link}
                  </Box>
                </Link>
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;
