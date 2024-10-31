'use client';
import EpisodeCard from '@/app/components/Card';
import { Box, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/compat/router';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
const URL_BACK = "http://localhost:3333/api";

interface Episode {
  id: number;
  title: string;
  number: number;
  releaseDate: string;
  description: string;
  caseNumber: string;
  heard: boolean;
  season: number;
}

function page() {
  const params = useParams();
  const episodeNumber = params.id;
  const [ episode, setEpisode ] = useState<Episode[]>([]);
  const [ message, setMessage ] = useState<string>("");
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    const getEpisode = async () => {
      try {
        const response = await axios.get(`${URL_BACK}/episodes/${episodeNumber}`);
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

  return (
    <Box 
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent="center"
      h={"90vh"}
      background="linear-gradient(282deg, rgba(2, 0, 36, 1) 0%, rgba(26, 83, 25, 1) 35%, rgba(80, 141, 78, 1) 100%)"
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
  )
}

export default page