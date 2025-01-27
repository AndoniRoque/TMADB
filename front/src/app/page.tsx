"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
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
import { useState } from "react";
import { useAuthStore } from "./store/useAuthStore";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const router = useRouter();
  const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";
  const { checkAuthStatus } = useAuthStore();

  const iniciarSesion = async (event: any) => {
    event.preventDefault();
    try {
      const data = {
        username: user,
        password: password,
        mail: email,
      };
      const response = await axios.post(`${URL_BACK}/login/`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user.username);
        toast({
          title: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        checkAuthStatus();
        router.push("/episodes");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Login failed.",
        description: "Please check your credentials and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      justifyContent={"space-evenly"}
      flexDirection={"row"}
      color={"whitesmoke"}
      w={"full"}
    >
      <Flex w={1000} backgroundColor={"black"} mt={10}>
        <Image
          src="TMA_Logo.webp"
          alt="The Magnus Archive logo"
          h={1000}
          fit="contain"
        />
      </Flex>
      <Flex
        fontFamily={"typewriter"}
        justifyContent={"center"}
        alignItems={"center"}
        minW={1000}
        p={20}
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
          <Button mt={4} onClick={iniciarSesion}>
            {" "}
            Log in
          </Button>
        </FormControl>
      </Flex>
    </Flex>
  );
}

export default Login;
