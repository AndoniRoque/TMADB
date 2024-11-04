"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import EpisodeCard from "../components/EpisodeCard";
import ReactSelect from "react-select";
import EpisodeModal from "../components/EpisodeModal";
const URL_BACK = "http://localhost:3333/api";

interface Character {
  id: number;
  name: string;
  description: string;
}

interface Episode {
  id: number;
  title: string;
  number: number;
  releaseDate: string;
  description: string;
  caseNumber: string;
  heard: boolean;
  season: number;
  message: string;
}

export default function EpisodesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [message, setMessage] = useState<string>("");
  const [characterMessage, setCharacterMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [number, setNumber] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [heard, setHeard] = useState<boolean>(false);
  const [caseNumber, setCaseNumber] = useState<string>("");
  const [season, setSeason] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const data = {
    title,
    number,
    releaseDate: dayjs(releaseDate, "DD-MM-YYYY").toDate(),
    description,
    heard,
    caseNumber,
    season,
    characterIds: selectedCharacter,
  };

  const characterOptions = characters.map((character: Character) => ({
    value: character.id,
    label: character.name,
  }));

  const handleCharacterChange = (selectedOptions: any) => {
    setSelectedCharacter(
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

  const getEpisodes = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`);
      // console.log(response);
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

  const uploadEpisode = async () => {
    try {
      const upload = await axios.post(`${URL_BACK}/episodes`, data);
      console.log(upload);
      alert("El episodio fue cargado exitosamente.");
      getEpisodes();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEpisodes();
    getCharacters();
  }, []);

  // TODO: El header quedó raro luego de agrgarle la posición fixed. Acomodar.

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-around"}
        flexDirection={"row"}
        m={4}
        p={4}
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
            <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
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
        onSubmit={uploadEpisode}
        initialValue={null}
      />
    </>
  );
}

// TODO: Responsive grid
