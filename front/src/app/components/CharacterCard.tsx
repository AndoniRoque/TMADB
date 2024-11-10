import { Avatar, Box, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { CharacterCardProps } from "@/app/types/types";

function CharacterCard({ character }: CharacterCardProps) {
  console.log("character prop>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><", character);
  return (
    <Stack direction="row" wrap="wrap" minH={"200px"} h={"320px"} w={"100%"}>
      <Box
        display={"flex"}
        justifyContent={"start"}
        minW={"100%"}
        maxH={"90%"}
        p={16}
        border={"1px solid gray"}
        borderRadius={8}
        color={"whitesmoke"}
        fontWeight={400}
        _hover={{
          transform: "scale(1.01)",
          transition: "transform 0.2s",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Stack spacing={2} w={"full"}>
          <Box
            display={"flex"}
            justifyContent={"start"}
            flexDirection={"row"}
            alignItems={"center"}
            w={"500"}
          >
            <Avatar
              src="/TMA_icon.webp"
              name={character.character.name}
              size="lg"
              borderRadius="full"
              mr={8}
            />
            <Text textStyle="6xl" fontWeight={600} w={"full"}>
              {character.character.name}
            </Text>
          </Box>
          <Text mt={4} noOfLines={3}>
            {character.character.description}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

export default CharacterCard;
