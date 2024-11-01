'use client';
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
  useDisclosure 
} from "@chakra-ui/react";
import axios from "axios";
import dayjs from 'dayjs';
import React, { useEffect, useState } from "react";
import EpisodeCard from "../components/EpisodeCard";
import ReactSelect from 'react-select';
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [message, setMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [number, setNumber] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [characters, setCharacters ] = useState<Character[]>([]);
  const [heard, setHeard] = useState<boolean>(false);
  const [caseNumber, setCaseNumber] = useState<string>("");
  const [season, setSeason] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true); 
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const data = {
    title,
    number,
    releaseDate: dayjs(releaseDate, 'DD-MM-YYYY').toDate(),
    description,
    heard,
    caseNumber,
    season
  }

  const characterOptions = characters.map((character: Character) => ({
    value: character.id,
    label: character.name,
  }));

  const handleCharacterChange = (selectedOption: any) => {
    setSelectedCharacter(selectedOption ? selectedOption.value : null);
  };

  const getEpisodes = async () =>  {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`);
      // console.log(response);
      if(response.data.message) {
        setMessage(response.data.message);
      } else {
        setEpisodes(response.data);
      }
    } catch(err) {
      setMessage('Episodes not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getCharacters = async () => {
    try{
      const characters = await axios.get(`${URL_BACK}/characters`);
      if(characters.data.message) {
        setMessage(characters.data.message);
      } else {
        setCharacters(characters.data);
      }
    } catch(err) {
      setMessage('Characters not found.')
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const uploadEpisode = async () => {
    try {
      const upload = await axios.post(`${URL_BACK}/episodes`, data);
      console.log(upload);
      alert("El episodio fue cargado exitosamente.")
      onClose();
      getEpisodes();
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEpisodes();
    getCharacters();
  }, []);

  return (
    <>
      <Box display={"flex"} justifyContent={"space-around"} flexDirection={"row"} m={4} p={4} >
        <Heading fontSize="4xl" color={"whitesmoke"} > T.M.A Episodes</Heading>
        <Button onClick={onOpen} > Upload Episode </Button>
      </Box>
      <Box display={"flex"} justifyContent={"center"} alignItems="center" w="100%">
        <Grid templateColumns='repeat(3, 1fr)' gap={10} mx="auto" >
          {loading ? (
            <>
              <Skeleton ml={16} height="200px" />
              <Skeleton ml={16} height="200px" />
              <Skeleton ml={16} height="200px" />
            </>
          ) : message ? ( // Mostrar mensaje de error si existe
            <Text color={"whitesmoke"}>{message}</Text>
          ) : (
              episodes.map((e: Episode) => (
                <GridItem key={e.id} w={500}>
                  <LinkBox>
                    <LinkOverlay href={`/episode/${e.number}`}>
                      <EpisodeCard episode={e} refreshEpisodes={getEpisodes}/>
                    </LinkOverlay>
                  </LinkBox>
                </GridItem>
              ))
            )}
          </Grid>
        </Box>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input placeholder="Episode title..." onChange={(e) => setTitle(e.target.value)}/>
              <FormLabel>Season</FormLabel>
              <Input placeholder="Season..." onChange={(e) => setSeason(parseInt(e.target.value))}/>
              <FormLabel>Episode Number</FormLabel>
              <Input placeholder="Episode number..." onChange={(e) => setNumber(parseInt(e.target.value))}/>
              <FormLabel>Case #</FormLabel>
              <Input placeholder="Case number... " onChange={(e) => setCaseNumber(e.target.value)}/>
              <FormLabel>Release Date</FormLabel>
              <Input type="date" onChange={(e) => setReleaseDate(e.target.value)}/>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Episode description..." onChange={(e) => setDescription(e.target.value)}/>
              <FormLabel>Characters in Episode</FormLabel>
              <ReactSelect
                options={characterOptions}
                placeholder="Select..."
                isClearable
                onChange={handleCharacterChange}
                value={characterOptions.find((option) => option.value === selectedCharacter)}
              />
              <FormLabel>Heard Episode </FormLabel>
              <Checkbox onChange={(e) => setHeard(e.target.checked)}></Checkbox>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={uploadEpisode}>Upload</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}