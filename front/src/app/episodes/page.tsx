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
import axios from "axios";
import React, { useEffect, useState } from "react";
import EpisodeCard from "../components/EpisodeCard";
import EpisodeModal from "../components/EpisodeModal";
import { Character, Episode } from "../types/types";
const URL_BACK = "http://localhost:3333/api";

export default function EpisodesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [message, setMessage] = useState<string>("");
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getEpisodes = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`);
      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setEpisodes(response.data);
      }
    } catch (err) {
      setMessage("Episodes not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCharacters = async () => {
    try {
      const characters = await axios.get(`${URL_BACK}/characters`);
      if (characters.data.message) {
        setCharacterMessage(characters.data.message);
      } else {
        setCharacters(characters.data);
      }
    } catch (err) {
      setCharacterMessage("Characters not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEpisodes();
    getCharacters();
  }, []);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-around"}
        flexDirection={"row"}
        m={4}
        p={4}
        mt={"8%"} // TODO: Responsive shit here.
        mb={"3%"}
      >
        <Heading fontSize="4xl" color={"whitesmoke"}>
          {" "}
          T.M.A Episodes
        </Heading>
        <Button onClick={onOpen}> Upload Episode </Button>
      </Box>
      <Box display={"flex"} justifyContent={"center"} alignItems="center">
        {loading ? (
          <>
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
          </>
        ) : message ? (
          <>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              h={"70vh"}
            >
              <Text color={"whitesmoke"}>{message}</Text>
            </Box>
          </>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                // xl: "repeat(5, 1fr)",
              }}
              gap={10}
              mx={10}
            >
              {episodes.map((e: Episode) => (
                <GridItem key={e.id} w={500}>
                  <LinkBox>
                    <LinkOverlay href={`/episode/${e.id}`}>
                      <EpisodeCard episode={e} refreshEpisodes={getEpisodes} />
                    </LinkOverlay>
                  </LinkBox>
                </GridItem>
              ))}
            </Grid>
          </>
        )}
      </Box>
      <EpisodeModal
        isOpen={isOpen}
        onClose={onClose}
        characters={characters}
        initialValue={null}
        getEpisode={getEpisodes}
      />
    </>
  );
}

// TODO: Responsive grid
