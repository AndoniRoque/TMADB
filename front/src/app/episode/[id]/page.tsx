"use client";
import CharacterCard from "../../components/CharacterCard";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
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
  Skeleton,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EpisodeModal from "@/app/components/EpisodeModal";
import { Episode, EpisodeData, Character } from "@/app/types/types";
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
  const router = useRouter();
  const episodeNumber = params.id;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [characterName, setCharacterName] = useState<string>("");
  const [characterDescription, setCharacterDescription] = useState<string>("");
  const [episodeToEdit, setEpisodeToEdit] = useState<EpisodeData | null>(null);

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

  const uploadCharacter = async () => {
    try {
      await axios.post(`${URL_BACK}/characters`, data);
      alert("The character was uploaded successfully.");
      getEpisode();
      onCloseCharacter();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEpisode = async () => {
    try {
      const delEpisode = await axios.delete(
        `${URL_BACK}/episodes/${episodeNumber}`
      );
      setEpisode(delEpisode.data);
      alert("The episode was deleted successfully");
      router.push("/episodes");
    } catch (err) {
      console.error(err);
      setMessage("The episode couldn't be deleted. Please try again.");
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    getEpisode();
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

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        h="50vh"
        color="whitesmoke"
      >
        <Text fontSize="4xl">
          MAG {episode.number} - {episode.title}
        </Text>
        <Text textAlign="right">Season: {episode.season}</Text>
        <Text textAlign="right">
          Release Date: {dayjs(episode.releaseDate).format("DD-MM-YYYY")}
        </Text>
        <Text as="span">Case Number: #{episode.caseNumber}</Text>
        <Text fontSize="2xl">{episode.description}</Text>
      </Box>

      {episode.characters.length > 0 && (
        <Box display="flex" justifyContent="center">
          <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
            {episode.characters.map((character) => (
              <GridItem key={character.id} w={500}>
                <LinkBox>
                  <LinkOverlay href={`/character/${character.id}`}>
                    <CharacterCard character={character} />
                  </LinkOverlay>
                </LinkBox>
              </GridItem>
            ))}
          </Grid>
        </Box>
      )}

      <Modal isOpen={isOpenCharacter} onClose={onCloseCharacter}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Character name..."
                onChange={(e) => setCharacterName(e.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Character description..."
                onChange={(e) => setCharacterDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseCharacter}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={uploadCharacter}>
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <EpisodeModal
        isOpen={isOpenEpisode}
        onClose={onCloseEpisode}
        characters={episode.characters}
        getEpisode={getEpisode}
        initialValue={episodeToEdit}
      />
    </>
  );
}

export default Page;
