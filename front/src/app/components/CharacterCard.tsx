import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { CharacterCardProps } from "@/app/types/types";

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Stack direction="row" wrap="wrap" minH={"200px"} h={"320px"} w={"100%"}>
      <Box
        border={"1px solid gray"}
        borderRadius={8}
        p={16}
        color={"whitesmoke"}
        fontWeight={400}
        w={"100%"}
        _hover={{
          transform: "scale(1.01)",
          transition: "transform 0.2s",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Stack spacing={2}>
          <Flex
            justifyContent={"start"}
            flexDirection={"row"}
            alignItems={"center"}
            w={"500"}
          >
            <Avatar
              src="/TMA_icon.webp"
              name={character.name}
              size="lg"
              borderRadius="full"
              mr={8}
            />
            <Text textStyle="6xl" fontWeight={600} w={"full"}>
              {character.name}
            </Text>
          </Flex>
          <Text
            mt={4}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            marginTop={"12%"}
          >
            {character.description}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

export default CharacterCard;
