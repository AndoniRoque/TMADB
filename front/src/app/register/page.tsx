"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const router = useRouter();
  const URL_BACK = "http://localhost:3333/api";

  const register = async (event: any) => {
    event.preventDefault();
    try {
      const data = {
        username: user,
        password: password,
        mail: email,
      };
      const response = await axios.post(`${URL_BACK}/register/`, data);
      if (response.status === 200) {
        toast({
          title: "Sign in successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error(">", error);
      if (error.response.status === 409) {
        toast({
          title: "Register failed.",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Flex
        justifyContent={"space-evenly"}
        flexDirection={"row"}
        w={"full"}
        color={"whitesmoke"}
      >
        <Box display={"flex"} w={"50%"} backgroundColor={"black"}>
          <Image
            src="TMA_Logo.webp"
            alt="The Magnus Archive logo"
            h={"100vh"}
            fit="contain"
          />
        </Box>
        <Box
          display={"flex"}
          minW={"50%"}
          h={"75vh"}
          p={16}
          m={20}
          justifyContent={"center"}
          alignItems={"center"}
          fontFamily={"typewriter"}
        >
          <FormControl
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Flex justifyContent={"space-between"}>
              <Text fontWeight={"bold"}> The Magnus Archive Database </Text>
              <Text>
                If you don't have an account yet{" "}
                <Link href="/register" color={"green"}>
                  Click here
                </Link>
              </Text>
            </Flex>

            <FormLabel mb={0} mt={4}>
              {" "}
              User{" "}
            </FormLabel>
            <Input value={user} onChange={(e) => setUser(e.target.value)} />
            <FormLabel mb={0} mt={4}>
              {" "}
              Password{" "}
            </FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <FormLabel mb={0} mt={4}>
              {" "}
              Email{" "}
            </FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button mt={4} onClick={register}>
              {" "}
              Sign in
            </Button>
          </FormControl>
        </Box>
      </Flex>
    </>
  );
}

export default Register;
