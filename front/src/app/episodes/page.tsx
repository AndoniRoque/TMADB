'use client';
import { Box, Button, Checkbox, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
const URL_BACK = "http://localhost:3333/api";

interface Episode {
  title: string;
  number: number;
  releaseDate: string;
  description: string;
}

export default function EpisodesPage() {
  const [episodes, setEpisodes ] = useState<Episode[]>([]);
  const [message, setMessage ] = useState<string>("");

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

  const data = {}

  const uploadEpisode = async () => {
    try {
      const upload = await axios.post(`${URL_BACK}/episodes`, data);
      console.log(upload);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEpisodes();
  }, []);

  return (
    <>
      <Box display={"flex"} justifyContent={"space-around"}>
        <Text mt={40}> T.M.A Episodes</Text>
        <Button onClick={uploadEpisode}> Upload Episode </Button>
      </Box>
      {episodes ? (
        episodes?.map((e:Episode, index: number) => (
          <>
            <Box border={"1px solid black"} w={"50vw"} p={4} m={4}>
              <Checkbox/>
              <Text key={index}>{e.number} - {e.title} | {e.releaseDate}</Text> 
              <p> {e.description}</p>
            </Box>
          </>
        ))
      ) : (
        <>
          <Text> {message} </Text>
        </>
      )}
    </>
  )
}