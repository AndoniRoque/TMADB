"use client";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SlideFade,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Character } from "../types/types";
import CharacterCard from "../components/CharacterCard";
import CharacterModal from "../components/CharacterModal";
import CustomTable from "../components/CustomTable";
import { useCharacterStore } from "../store/useCharacterStore";
import { useAuthStore } from "../store/useAuthStore";
const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

function characters() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenSearchBar, onToggle } = useDisclosure();
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);
  const { role } = useAuthStore();
  const {
    characters,
    getCharacters,
    loading: charactersLoading,
  } = useCharacterStore();

  const toggleTable = () => {
    onToggle();
    setShowTable(!showTable);
    setShowSearchBar(!showSearchBar);
  };

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        flexDirection={"row"}
        p={4}
        mt={150}
      >
        <Heading fontSize="4xl" color={"whitesmoke"} flex={1}>
          {" "}
          T.M.A Characters
        </Heading>
        <Flex
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          {role === "ADMIN" && (
            <Button onClick={onOpen} mr={2}>
              {" "}
              Add{" "}
            </Button>
          )}
          <Button onClick={toggleTable}>
            {showTable ? "Show Table" : "Show Grid"}
          </Button>
        </Flex>
      </Flex>
      <Flex justifyContent={"end"}>
        <SlideFade in={isOpenSearchBar} offsetX="500px" hidden={showSearchBar}>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            width={300}
            mr={4}
          >
            <Input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              _focus={{
                backgroundColor: "whitesmoke",
              }}
              maxW={300}
            ></Input>
          </Flex>
        </SlideFade>
      </Flex>
      <Flex display={"flex"} justifyContent={"center"} alignItems="center">
        {charactersLoading ? (
          <>
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
          </>
        ) : characters.length === 0 ? (
          <Flex justifyContent={"center"} alignItems={"center"} h={500}>
            <Text color={"whitesmoke"}>
              There are no characters loaded yet.
            </Text>
          </Flex>
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
                mt={8}
              >
                {characters.map((char: Character) => (
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
                ))}
              </Grid>
            ) : (
              <CustomTable
                data={characters}
                type="character"
                refreshList={getCharacters}
                searchTerm={search}
              />
            )}
          </>
        )}
      </Flex>

      <CharacterModal
        isOpen={isOpen}
        onClose={onClose}
        getEpisode={getCharacters}
      />
    </>
  );
}

export default characters;
