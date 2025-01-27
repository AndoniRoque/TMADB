"use client";
import InformationCard from "@/app/components/InformationCard";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character, Episode } from "@/app/types/types";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import CharacterModal from "@/app/components/CharacterModal";
import { useAuthStore } from "@/app/store/useAuthStore";
import CustomTable from "@/app/components/CustomTable";
const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

function character() {
  const {
    isOpen: isOpenCharacter,
    onOpen: onOpenCharacter,
    onClose: onCloseCharacter,
  } = useDisclosure();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const characterNumber = params.id;
  const [character, setCharacter] = useState<Character | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [episodesPerCharacter, setEpisodesPerCharacter] = useState<Episode[]>();
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(
    null
  );
  const toast = useToast();

  const getCharacter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL_BACK}/characters/${characterNumber}`,
        {
          withCredentials: true,
        }
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
        `${URL_BACK}/characters/${characterNumber}`,
        {
          withCredentials: true,
        }
      );
      if (delCharacter.status === 200) {
        toast({
          title: "The character was deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      router.push("/characters");
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        toast({
          title: "The character couldn't be deleted. Please try again.",
          description: err.response.data.message,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
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
        character: character,
        heard: false,
        characters: [],
      });
      onOpenCharacter();
    }
  };

  const getEpisodeAppearences = async () => {
    try {
      const episodes = await axios.get(
        `${URL_BACK}/characters/${characterNumber}/episodes`,
        { withCredentials: true }
      );
      setEpisodesPerCharacter(episodes.data.episodes);
    } catch (err) {
      console.error(err);
      setMessage("The episode appearences couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCharacter();
    getEpisodeAppearences();
  }, [characterNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (message) {
    return <div>{message}</div>;
  }

  if (!character) {
    return <div>No character data found</div>;
  }

  return (
    <>
      <Box position="fixed" m={4} top="15%" left="88%" zIndex={1000}>
        {user.role === "ADMIN" && (
          <Flex flexDirection="column" gap={2}>
            <Button onClick={handleEditCharacter} leftIcon={<EditIcon />}>
              Edit
            </Button>
            <Button
              onClick={deleteCharacter}
              leftIcon={<DeleteIcon />}
              color={"red"}
            >
              Delete
            </Button>
          </Flex>
        )}
      </Box>

      <InformationCard {...character} />

      <CharacterModal
        isOpen={isOpenCharacter}
        onClose={onCloseCharacter}
        initialValue={character}
        getEpisode={getCharacter}
      />

      <Box m={4} color={"whitesmoke"}>
        <Text ml={8}>Episodes appearences:</Text>
        <CustomTable
          data={episodesPerCharacter as Episode[]}
          type="episode"
          refreshList={getEpisodeAppearences}
          searchTerm={search}
        />
      </Box>
    </>
  );
}

export default character;
