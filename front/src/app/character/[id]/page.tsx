"use client";
import InformationCard from "@/app/components/InformationCard";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character } from "@/app/types/types";
import axios from "axios";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CharacterModal from "@/app/components/CharacterModal";
const URL_BACK = "http://localhost:3333/api";

function character() {
  const {
    isOpen: isOpenCharacter,
    onOpen: onOpenCharacter,
    onClose: onCloseCharacter,
  } = useDisclosure();
  const router = useRouter();
  const params = useParams();
  const characterNumber = params.id;
  const [character, setCharacter] = useState<Character | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(
    null
  );

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

  const deleteCharacter = async () => {
    try {
      const delCharacter = await axios.delete(
        `${URL_BACK}/characters/${characterNumber}`
      );
      setCharacter(delCharacter.data);
      alert("The character was deleted successfully");
      router.push("/characters");
    } catch (err) {
      console.error(err);
      setMessage("The character couldn't be deleted. Please try again.");
    } finally {
      setLoading(true);
    }
  };

  const handleEditCharacter = () => {
    if (character) {
      setCharacterToEdit({
        id: character.id,
        name: character.name,
        description: character.description,
      });
      onOpenCharacter();
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
    <>
      <Box position="fixed" m={4} top="15%" left="88%" zIndex={1000}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button onClick={handleEditCharacter} leftIcon={<EditIcon />}>
            Edit Character
          </Button>
          <Button
            onClick={deleteCharacter}
            leftIcon={<DeleteIcon />}
            color={"red"}
          >
            Delete Character
          </Button>
        </Box>
      </Box>

      <InformationCard
        description={character.description}
        id={character.id}
        name={character.name}
      />

      <CharacterModal
        isOpen={isOpenCharacter}
        onClose={onCloseCharacter}
        initialValue={character}
        getEpisode={getEpisode}
      />
    </>
  );
}

export default character;
