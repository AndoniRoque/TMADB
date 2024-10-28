'use client';
import { Box, Checkbox, Text } from "@chakra-ui/react";
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

  const getEpisodes = async () =>  {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`);
      console.log(response);
      setEpisodes(response.data);
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getEpisodes();
  }, []);

  return (
    <>
      <Text> T.M.A Episodes</Text>
      {episodes.map((e:Episode, index: number) => (
        <>
          <Box border={"1px solid black"} w={"50vw"} p={4} m={4}>
            <Checkbox/>
            <Text key={index}>{e.number} - {e.title} | {e.releaseDate}</Text> 
            <p> {e.description}</p>
          </Box>
        </>
      ))}
    </>
  )
}