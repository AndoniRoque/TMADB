'use client';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControl, 
  FormLabel, 
  Grid, 
  GridItem, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Select, 
  Text, 
  Textarea, 
  useDisclosure 
} from "@chakra-ui/react";
import axios from "axios";
import dayjs from 'dayjs';
import React, { useEffect, useState } from "react";
const URL_BACK = "http://localhost:3333/api";

interface Episode {
  title: string;
  number: number;
  releaseDate: string;
  description: string;
}

export default function EpisodesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [episodes, setEpisodes ] = useState<Episode[]>([]);
  const [message, setMessage ] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [number, setNumber] = useState<number>(0);
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [characters, setCharacters ] = useState<number>(0);
  const [heard, setHeard] = useState<boolean>(true);
  const [caseNumber, setCaseNumber] = useState<string>("");


  const getEpisodes = async () =>  {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`);
      console.log(response);
      setEpisodes(response.data);
    } catch(err) {
      setMessage('Episodes not found.');
      console.error(err);
    }
  }

  const data = {
    title,
    number,
    releaseDate: dayjs(releaseDate, 'DD-MM-YYYY').toDate(),
    description,
    characterId: 1,
    heard,
    caseNumber
  }

  console.log("Hola");

  
  console.log(data);
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
  }, []);

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"} m={4} p={4} >
        <Text w={"50%"} > T.M.A Episodes</Text>
        <Button onClick={onOpen} > Upload Episode </Button>
      </Box>
      <Grid templateColumns='repeat(5,1fr)' gap={4}>
        {episodes ? (
          episodes?.map((e:Episode, index: number) => (
            <>
              <GridItem w={'100%'} bg={'blue.500'} mx={4}>
                <Box border={"1px solid black"} w={"50vw"} p={4} m={4}>
                  <Checkbox/>
                  <Text key={index}>{e.number} - {e.title} | {e.releaseDate}</Text> 
                  <p> {e.description} </p>
                </Box>
              </GridItem>
            </>
          ))
        ) : (
          <>
            <Text> {message} </Text>
          </>
        )}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Episode</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input placeholder="Episode title..." onChange={(e) => setTitle(e.target.value)}/>
              <FormLabel>Episode Number</FormLabel>
              <Input placeholder="Episode number..." onChange={(e) => setNumber(parseInt(e.target.value))}/>
              <FormLabel>Case #</FormLabel>
              <Input placeholder="Case number... " onChange={(e) => setCaseNumber(e.target.value)}/>
              <FormLabel>Release Date</FormLabel>
              <Input type="date" onChange={(e) => setReleaseDate(e.target.value)}/>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Episode description..." onChange={(e) => setDescription(e.target.value)}/>
              <FormLabel>Characters in Episode</FormLabel>
              <Select> </Select>
              <FormLabel>Heard Episode </FormLabel>
              <Checkbox onChange={(e) => e ? setHeard(true) : setHeard(false)}></Checkbox>
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