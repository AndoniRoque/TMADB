"use client";
import CharacterCard from "../../components/CharacterCard";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Image,
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
import { useRouter } from "next/compat/router";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import EpisodeModal from "@/app/components/EpisodeModal";
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
  characters: Character[];
}

function page() {
  const {
    isOpen: isOpenCharacter,
    onOpen: onOpenCharacter,
    onClose: onClosedCharacter,
  } = useDisclosure();
  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode,
  } = useDisclosure();
  const params = useParams();
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
      connect: { id: params.id },
    },
  };

  const handleEditEpisode = () => {
    if (episode) {
      setEpisodeToEdit({
        title: episode.title,
        number: episode.number,
        releaseDate: episode.releaseDate,
        description: episode.description,
        heard: episode.heard,
        caseNumber: episode.caseNumber,
        season: episode.season,
        characters: episode.characters,
        characterIds: episode.characters.map((character) => character.id),
      });
      onOpenEpisode();
    }
  };

  const handleEpisodeSubmit = async (data: EpisodeData) => {
    try {
      await axios.put(`${URL_BACK}/episodes/${episodeNumber}`, data);
      alert("Episode updated successfully.");
      getEpisode(); // Recargar el episodio actualizado
      onCloseEpisode();
    } catch (err) {
      console.error("Error updating episode:", err);
    }
  };

  const getEpisode = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/episodes/${episodeNumber}`);
      console.log(response.data);
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
      const response = await axios.post(`${URL_BACK}/characters`, data);
      alert("The character was uploaded successfully.");
      getEpisode();
      onClosedCharacter();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getEpisode();
  }, [episodeNumber]);

  if (loading)
    return (
      <>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent="center"
          h={"50vh"}
        >
          <Skeleton ml={16} height="100px" width="80%" w="600px" />
        </Box>
      </>
    );
  // TODO: acomodar el Skeleton para que se vea en el lugar donde aparezca el texto.
  // TODO: Agregar las imagenes de The Magnus Archive correspondientes.
  // TODO: Al cargar la página se ve un estilo feo que no es el del sitio.
  if (!episode) return <Text textAlign={"center"}>{message}</Text>;

  return (
    <>
      <Box position={"fixed"} m={4} top={"15%"} left={"88%"} zIndex={1000}>
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <Button onClick={onOpenCharacter} leftIcon={<AddIcon />}>
            Add Characters
          </Button>
          <Button onClick={handleEditEpisode} leftIcon={<EditIcon />}>
            Edit Episode
          </Button>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent="center"
        h={"50vh"}
        color="whitesmoke"
      >
        <Box display={"flex"} justifyContent={"center"}>
          <Text fontSize={"4xl"}>
            MAG {episode.number} - {episode.title}
          </Text>
        </Box>
        <Text textAlign={"right"}>Season: {episode.season}</Text>
        <Text textAlign={"right"}>
          Release Date: {dayjs(episode.releaseDate).format("DD-MM-YYYY")}
        </Text>
        <Box display={"flex"} justifyContent={"center"}>
          <Text fontSize={"2xl"}>
            <Text as="span" fontWeight="bold">
              #{episode.caseNumber} -{" "}
            </Text>
            {episode.description}
          </Text>
        </Box>
      </Box>
      {episode.characters.length === 0 ? null : (
        <>
          <Box display={"flex"} justifyContent={"center"}>
            <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
              {episode.characters.map((character: Character) => (
                <>
                  <GridItem key={character.id} w={500}>
                    <LinkBox>
                      <LinkOverlay href={`/character/${character.id}`}>
                        <CharacterCard
                          key={character.id}
                          character={character}
                        />
                      </LinkOverlay>
                    </LinkBox>
                  </GridItem>
                </>
              ))}
            </Grid>
          </Box>
        </>
      )}

      <Modal isOpen={isOpenCharacter} onClose={onClosedCharacter}>
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
            <Button variant="ghost" mr={3} onClick={onClosedCharacter}>
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
        characters={episode.characters} // Pasas la lista completa de personajes
        onSubmit={handleEpisodeSubmit}
        initialValue={episodeToEdit} // Pasas el episodio a editar si existe
      />
    </>
  );
}

export default page;
