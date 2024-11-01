'use client';
import CharacterCard from "../../components/CharacterCard";
import { Box, Button, Checkbox, FormControl, FormLabel, Grid, GridItem, Image, Input, LinkBox, LinkOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Text, Textarea, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/compat/router';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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
  const { isOpen: isOpenCharacter, onOpen: onOpenCharacter, onClose: onClosedCharacter } = useDisclosure()
  const params = useParams();
  const episodeNumber = params.id;
  const [ episode, setEpisode ] = useState<Episode | null>(null);
  const [ message, setMessage ] = useState<string>("");
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ characterName, setCharacterName ] = useState<string>("");
  const [ characterDescription, setCharacterDescription ] = useState<string>("");

  const data = {
    name: characterName,
    description: characterDescription,
    episode: {
      connect: { id: params.id }
    }
  }

  useEffect(() => {
    const getEpisode = async () => {
      try {
        const response = await axios.get(`${URL_BACK}/episodes/${episodeNumber}`);
        console.log(response.data);
        setEpisode(response.data);
      } catch (err) {
        console.error(err);
        setMessage("The episode couldn't be loaded.")
      } finally {
        setLoading(false);
      }
    };

    getEpisode();
  }, [episodeNumber])
  
  const uploadCharacter = async () => {
    try {
      const response = await axios.post(`${URL_BACK}/characters`, data);
      alert("The character was uploaded successfully.");
      onClosedCharacter();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return (
    <>
      <Box
        h={"90vh"}
        alignItems="center"
        justifyContent="center"
        background="linear-gradient(282deg, rgba(2, 0, 36, 1) 0%, rgba(26, 83, 25, 1) 35%, rgba(80, 141, 78, 1) 100%)"
      >
        <Skeleton ml={16} height="100px" />
      </Box>
    </>
  ) 
  // TODO: acomodar el Skeleton para que se vea en el lugar donde aparezca el texto.
  // TODO: Agregar las imagenes de The Magnus Archive correspondientes. 
  if (!episode) return <Text>{message}</Text>;

  return (
    <>
      <Box display={"flex"} justifyContent={"flex-end"} m={4}>
        <Button onClick={onOpenCharacter} >Add Characters</Button>
      </Box>
      <Box 
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent="center"
        h={"50vh"}
        color="white"
      >
        <Box display={"flex"} justifyContent={"center"}>
          <Text fontSize={"4xl"}>MAG {episode.number} - {episode.title}</Text>
        </Box>
        <Text textAlign={"right"}>Season: {episode.season}</Text>
        <Text textAlign={"right"}>Release Date: {dayjs(episode.releaseDate).format('DD-MM-YYYY')}</Text>
        <Box display={"flex"} justifyContent={"center"}>
          <Text fontSize={"2xl"}>
            <Text as="span" fontWeight="bold">#{episode.caseNumber} - </Text>
            {episode.description}
          </Text>
        </Box>
      </Box>
      {episode.characters.length === 0 ? (null) : 
      ( 
        <>
          <Box display={"flex"} justifyContent={"center"}>
            <Grid templateColumns='repeat(3, 1fr)' gap={10} mx="auto" >
              {episode.characters.map((character: Character) => (
                <>
                  <GridItem key={character.id} w={500}>
                    <LinkBox>
                      <LinkOverlay href={`/character/${character.id}`}>
                        <CharacterCard key={character.id} character={character} />
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
              <Input placeholder="Character name..." onChange={(e) => setCharacterName(e.target.value)}/>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Character description..." onChange={(e) => setCharacterDescription(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClosedCharacter}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={uploadCharacter}>Upload</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default page