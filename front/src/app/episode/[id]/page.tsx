"use client";
import {
  Box,
  Button,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EpisodeModal from "@/app/components/EpisodeModal";
import { Character, Episode, EpisodeData } from "@/app/types/types";
import InformationCard from "@/app/components/InformationCard";
import CharacterModal from "@/app/components/CharacterModal";
const URL_BACK = "http://localhost:3333/api";

function Page() {
  const {
    isOpen: isOpenCharacter,
    onOpen: onOpenCharacter,
    onClose: onCloseCharacter,
  } = useDisclosure();
  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode,
  } = useDisclosure();
  const params = useParams();
  const episodeNumber = params.id;
  const router = useRouter();
  const toast = useToast();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [characterName, setCharacterName] = useState<string>("");
  const [characterDescription, setCharacterDescription] = useState<string>("");
  const [episodeToEdit, setEpisodeToEdit] = useState<EpisodeData | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);

  const data = {
    name: characterName,
    description: characterDescription,
    episode: {
      connect: { id: episodeNumber },
    },
  };

  const handleEditEpisode = () => {
    if (episode) {
      setEpisodeToEdit({
        id: episode.id,
        title: episode.title,
        number: Number(episode.number),
        releaseDate: episode.releaseDate,
        description: episode.description,
        heard: episode.heard,
        caseNumber: episode.caseNumber,
        season: Number(episode.season),
        characters: episode.characters,
        characterIds: episode.characters.map((character) => character.id),
      });
      onOpenEpisode();
    }
  };

  const getEpisode = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/episodes/${episodeNumber}`);
      setEpisode(response.data);
    } catch (err) {
      console.error(err);
      setMessage("The episode couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const getCharacters = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/characters/`);
      setCharacters(response.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Characters couldn't be fetched.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteEpisode = async () => {
    try {
      const delEpisode = await axios.delete(
        `${URL_BACK}/episodes/${episodeNumber}`
      );
      if (delEpisode.status === 200) {
        toast({
          title: "Episode deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEpisode(delEpisode.data);
        router.push("/episodes");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        toast({
          title: "Episode doesn't exists.",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setMessage("The episode couldn't be deleted. Please try again.");
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    getEpisode();
    getCharacters();
  }, [episodeNumber]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        h="50vh"
      >
        <Skeleton ml={16} height="100px" width="80%" w="600px" />
      </Box>
    );
  }

  if (!episode) return <Text textAlign="center">{message}</Text>;

  return (
    <>
      <Box position="fixed" m={4} top="15%" left="88%" zIndex={1000}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button onClick={onOpenCharacter} leftIcon={<AddIcon />}>
            Add Characters
          </Button>
          <Button onClick={handleEditEpisode} leftIcon={<EditIcon />}>
            Edit Episode
          </Button>
          <Button
            onClick={deleteEpisode}
            leftIcon={<DeleteIcon />}
            color={"red"}
          >
            Delete Episode
          </Button>
        </Box>
      </Box>

      <InformationCard
        heard={episode.heard}
        id={episode.id}
        title={episode.title}
        number={episode.number}
        season={episode.season}
        caseNumber={episode.caseNumber}
        characters={episode.characters}
        description={episode.description}
        releaseDate={episode.releaseDate}
      />

      <EpisodeModal
        isOpen={isOpenEpisode}
        onClose={onCloseEpisode}
        characters={episode.characters}
        getEpisode={getEpisode}
        initialValue={episodeToEdit}
      />

      <CharacterModal
        isOpen={isOpenCharacter}
        onClose={onCloseCharacter}
        initialValue={null}
        id={episodeNumber.toString()}
        getEpisode={getEpisode}
        charactersList={episode.characters}
        characters={characters}
      />
    </>
  );
}

export default Page;
