import { Avatar, Box, Stack, Text } from '@chakra-ui/react';
import React from 'react'

interface Character {
  id: number;
  name: string;
  description: string;
}

interface CharacterCardProps {
  character: Character;
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Stack direction="row" wrap="wrap" minH={"200px"} h={"320px"} w={"100%"}>
      <Box 
        minW={"100%"}
        p={16}
        border={"1px solid gray"}
        borderRadius={8}
        color={"white"}
        fontWeight={400}
        mb={5}
        _hover={{
          transform: 'scale(1.01)', 
          transition: 'transform 0.2s', 
          boxShadow: '2px 0px 10px rgba(0,0,0,0.5)' 
        }}
      >
        <Stack spacing={2}>
          <Box display={"flex"} justifyContent={"start"} flexDirection={"row"} alignItems={"center"} w={"500"}>
            <Avatar
              src="/TMA_icon.webp"
              name={character.name}
              size="lg"
              borderRadius="full"
              mr={8}
            />
            <Text textStyle="6xl" fontWeight={600} w={"full"}>{character.name}</Text>
          </Box>
          <Text mt={4}>{character.description}</Text>
        </Stack>
      </Box>
    </Stack>
  );
}

export default CharacterCard