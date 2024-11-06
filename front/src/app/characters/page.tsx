"use client";
import {
  Box,
  Grid,
  GridItem,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Character } from "../types/types";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";
const URL_BACK = "http://localhost:3333/api";

function characters() {
  const [charactersList, setCharactersList] = useState<Character[]>([]);
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const getCharacters = async () => {
    try {
      const characters = await axios.get(`${URL_BACK}/characters`);
      if (characters.data.message) {
        setCharacterMessage(characters.data.message);
      } else {
        console.log(characters.data);
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
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text top={15} mt={"10%"} fontSize={"6xl"} color={"whitesmoke"}>
          Characters
        </Text>
        <Box display={"flex"}>
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
        </Box>
      </Box>
    </>
  );
}

export default characters;
