'use client';
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
    <div>
      <h1>{episode.title}</h1>
      <p>{episode.description}</p>
      <p>Número de caso: {episode.caseNumber}</p>
      <p>Fecha de lanzamiento: {dayjs(episode.releaseDate).format('DD-MM-YYYY')}</p>
      <p>Temporada: {episode.season}</p>
    </div>
  )
}

export default page