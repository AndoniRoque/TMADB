"use client";
import InformationCard from "@/app/components/InformationCard";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character } from "@/app/types/types";
import axios from "axios";
const URL_BACK = "http://localhost:3333/api";

function character() {
  const params = useParams();
  const characterNumber = params.id;
  console.log(characterNumber);
  const [character, setCharacter] = useState<Character | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  console.log(`${URL_BACK}/characters/${characterNumber}`);

  const getEpisode = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL_BACK}/characters/${characterNumber}`
      );
      setCharacter(response.data);
    } catch (err) {
      console.error(err);
      setMessage("The episode couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEpisode();
  }, [characterNumber]);

  if (loading) {
    return <div>Loading...</div>; // Mostrar algo mientras se carga
  }

  if (message) {
    return <div>{message}</div>; // Mostrar mensaje de error si es necesario
  }

  // Asegurarte de que `character` está cargado antes de pasar las props
  if (!character) {
    return <div>No character data found</div>; // Mensaje de no encontrado si no hay datos
  }

  return (
    <InformationCard
      description={character.description}
      id={character.id}
      name={character.name}
    />
  );
}

export default character;
