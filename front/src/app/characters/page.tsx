"use client";
import {
  Box,
  Button,
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
const URL_BACK = "http://localhost:3333/api";

function characters() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [charactersList, setCharactersList] = useState<Character[]>([]);
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);

  const getCharacters = async () => {
    try {
      const characters = await axios.get(`${URL_BACK}/characters`);
      if (characters.data.message) {
        setCharacterMessage(characters.data.message);
      } else {
        setCharactersList(characters.data);
      }
    } catch (err) {
      setCharacterMessage("Characters not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        m={4}
        p={4}
        mt={"8%"} // TODO: Responsive shit here.
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
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <Button onClick={() => setShowTable(!showTable)}>
            {showTable ? "Show Table" : "Show Grid"}
          </Button>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"center"} alignItems="center">
        {loading ? (
          <>
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
            <Skeleton ml={16} height={"20vh"} />
          </>
        ) : characterMessage ? (
          <>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              h={"70vh"}
            >
              <Text color={"whitesmoke"}>{characterMessage}</Text>
            </Box>
          </>
        ) : (
          <>
            {showTable ? (
              <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
                {charactersList.map((char: Character) => (
                  <>
                    <GridItem key={char.id} w={500}>
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
                  data={charactersList}
                  type="character"
                  refreshList={getCharacters}
                />
              </>
            )}
          </>
        )}
      </Box>

      <CharacterModal
        isOpen={isOpen}
        onClose={onClose}
        getEpisode={getCharacters}
        charactersList={charactersList}
      />
    </>
  );
}

export default characters;
