"use client";
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import EpisodeModal from "@/app/components/EpisodeModal";
import { Character, Episode, EpisodeData } from "@/app/types/types";
import InformationCard from "@/app/components/InformationCard";
import { useCharacterStore } from "@/app/store/useCharacterStore";
import { useAuthStore } from "@/app/store/useAuthStore";
const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

function Page() {
  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode,
  } = useDisclosure();
  const params = useParams();
  const episodeNumber = params.number;
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuthStore();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [episodeToEdit, setEpisodeToEdit] = useState<EpisodeData | null>(null);
  const {
    characters,
    getCharacters,
    loading: charactersLoading,
  } = useCharacterStore();

  const handleEditEpisode = () => {
    if (episode) {
      setEpisodeToEdit({
        id: episode.id,
        title: episode.title,
        number: Number(episode.number),
        releaseDate: episode.releaseDate,
        description: episode.description,
        caseNumber: episode.caseNumber,
        season: Number(episode.season),
        characters: episode.characters,
        characterIds: episode.characters.map((character) => character.id),
        entity: episode.entity,
      });
      onOpenEpisode();
    }
  };

  const getEpisode = async () => {
    try {
      const response = await axios.get(
        `${URL_BACK}/episodes/${episodeNumber}`,
        {
          withCredentials: true,
        }
      );
      console.log(
        ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        response.data
      );
      setEpisode(response.data);
    } catch (err) {
      console.error(err);
      setMessage("The episode couldn't be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEpisode = async () => {
    try {
      const delEpisode = await axios.delete(
        `${URL_BACK}/episodes/${episodeNumber}`,
        {
          withCredentials: true,
        }
      );
      if (delEpisode.status === 200) {
        toast({
          title: "Episode deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEpisode(delEpisode.data);
        router.push("/episodes");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        toast({
          title: "Episode doesn't exists.",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setMessage("The episode couldn't be deleted. Please try again.");
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    getEpisode();
    getCharacters();
  }, [episodeNumber]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        h={100}
      >
        <Skeleton ml={16} height="100px" width="80%" w="600px" />
      </Box>
    );
  }

  if (!episode) return <Text textAlign="center">{message}</Text>;

  return (
    <>
      <Box position="fixed" m={4} top="15%" left="88%" zIndex={1000}>
        {user.role === "ADMIN" && (
          <Flex flexDirection="column" gap={2}>
            <Button
              onClick={handleEditEpisode}
              justifyContent="center"
              alignItems="center"
            >
              <EditIcon />
            </Button>
            <Button
              onClick={deleteEpisode}
              color={"red"}
              justifyContent="center"
              alignItems="center"
            >
              <DeleteIcon />
            </Button>
          </Flex>
        )}
      </Box>

      <InformationCard {...episode} />

      <EpisodeModal
        isOpen={isOpenEpisode}
        onClose={onCloseEpisode}
        getEpisode={getEpisode}
        initialValue={episodeToEdit}
      />
    </>
  );
}

export default Page;
