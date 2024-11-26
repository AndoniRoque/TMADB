"use client";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Character } from "../types/types";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";
import CharacterModal from "../components/CharacterModal";
import CustomTable from "../components/CustomTable";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "../store/useCharacterStore";
const URL_BACK = "http://localhost:3333/api";

function characters() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(true);
  const {
    characters,
    getCharacters,
    loading: charactersLoading,
  } = useCharacterStore();

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        m={4}
        p={4}
        mt={"8%"}
        mb={"3%"}
      >
        <Heading fontSize="4xl" color={"whitesmoke"} flex={1}>
          {" "}
          T.M.A Characters
        </Heading>
        <Button onClick={onOpen} mr={2}>
          {" "}
          Upload Character{" "}
        </Button>
        <Flex
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <Button onClick={() => setShowTable(!showTable)}>
            {showTable ? "Show Table" : "Show Grid"}
          </Button>
        </Flex>
      </Flex>
      <Flex display={"flex"} justifyContent={"center"} alignItems="center">
        {charactersLoading ? (
          <>
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
          </>
        ) : characterMessage ? (
          <>
            <Flex justifyContent={"center"} alignItems={"center"} h={"70vh"}>
              <Text color={"whitesmoke"}>{characterMessage}</Text>
            </Flex>
          </>
        ) : (
          <>
            {showTable ? (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gap={{ base: 2, md: 4, lg: 6, xl: 8 }}
                mx={{ base: 2, md: 4, lg: 6, xl: 8 }}
              >
                {characters.map((char: Character) => (
                  <>
                    <GridItem
                      key={char.id}
                      minW={{ base: 300, md: 500, lg: 500, xl: 500 }}
                    >
                      <LinkBox>
                        <LinkOverlay href={`/character/${char.id}`}>
                          <CharacterCard character={char} />
                        </LinkOverlay>
                      </LinkBox>
                    </GridItem>
                  </>
                ))}
              </Grid>
            ) : (
              <>
                <CustomTable
                  data={characters}
                  type="character"
                  refreshList={getCharacters}
                />
              </>
            )}
          </>
        )}
      </Flex>

      <CharacterModal
        isOpen={isOpen}
        onClose={onClose}
        getEpisode={getCharacters}
        charactersList={characters}
        characters={characters}
      />
    </>
  );
}

export default characters;
