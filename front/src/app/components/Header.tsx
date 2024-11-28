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
  Icon,
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
const URL_BACK = "http://localhost:3333/auth";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoggedIn, username, logout, checkAuthStatus } = useAuthStore();
  const btnRef = useRef();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    try {
      const out = await axios.get(`${URL_BACK}/logout`);
      if (out.status === 200) {
        logout();
        toast({
          title: "Logout successfull.",
          description: "Goodbye",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      }
    } catch (err) {
      toast({
        title: "Couldn't be logged out.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>The Magnus Archives Database</title>
        <meta name="description" content="The Magnus Archive Database" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/TMA_icon.webp" />
      </Head>

      {/* Desktop Header */}
      <Flex
        w="100%"
        p={4}
        minH="10vh"
        bg={{
          base: "conic-gradient(from 90deg at 25% 50%, #0f1110, #252b26)",
          md: "conic-gradient(from 90deg at 50% 50%, #0f1110, #252b26)",
          lg: "conic-gradient(from 90deg at 75% 50%, #0f1110, #252b26)",
          xl: "conic-gradient(from 90deg at 70% 50%, #0f1110, #252b26)",
        }}
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
        <Flex justifyContent="start" ml={4} alignItems="center" flex={1}>
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
            justifyContent="end"
            color="rgba(236, 223, 204, 0.8)"
            gap={12}
          >
            {["Episodes", "Characters", "Mindmap"].map((link) => (
              <Link key={link.toLowerCase()} href={`/${link.toLowerCase()}`}>
                <Flex
                  justifyContent="start"
                  alignItems="center"
                  h={100}
                  fontSize="xl"
                  _hover={{
                    color: "#ECDFCC",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {link}
                </Flex>
              </Link>
            ))}
          </Flex>
        </Box>
        {isLoggedIn && (
          <Flex justifyContent={"end"} alignItems="center" w={150}>
            <Menu>
              <MenuButton
                as={Button}
                backgroundColor={"transparent"}
                _hover={{
                  backgrdounColor: "transparent",
                  cursor: "pointer",
                }}
                rightIcon={
                  <Icon
                    as={FaUser}
                    boxSize={6}
                    color={"rgba(236, 223, 204, 0.8)"}
                  ></Icon>
                }
              >
                <Text color={"rgba(236, 223, 204, 0.8)"} ml={2}>
                  {username}
                </Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
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
          onClick={onOpen}
          icon={<HamburgerIcon />}
          variant="outline"
          colorScheme="whitesmoke"
          aria-label="Open Menu"
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
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
