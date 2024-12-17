import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Episode, EpisodeCardProps } from "../types/types";
import { useAuthStore } from "../store/useAuthStore";
const URL_BACK = "http://localhost:3333/api";

function EpisodeCard({ episode, refreshEpisodes }: EpisodeCardProps) {
  const { username } = useAuthStore();
  const [listOfEpisodesHeard, setListOfEpisodesHeard] = useState<Episode[]>([]);

  const heardEpisode = async (episode: Episode) => {
    try {
      const { data } = await axios.post(
        `${URL_BACK}/episodesHeard/`,
        {
          userId: username,
          episodeId: episode.id,
        },
        {
          withCredentials: true,
        }
      );
      heardEpisodes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const heardEpisodes = async () => {
    try {
      const getEpisodesbyUser = await axios.post(
        `${URL_BACK}/episodesByUser/`,
        { username: username },
        {
          withCredentials: true,
        }
      );
      setListOfEpisodesHeard(getEpisodesbyUser.data.episodesHeard);
    } catch {
      console.error;
    }
  };

  useEffect(() => {
    heardEpisodes();
  }, []);

  return (
    <Stack direction="row" wrap="wrap" h={"320px"} minH={"200px"} w={"100%"}>
      <Box
        border={"1px solid gray"}
        borderRadius={8}
        p={16}
        color={"whitesmoke"}
        fontWeight={400}
        w={"100%"}
        _hover={{
          transform: "scale(1.01)",
          transition: "transform 0.2s",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Stack spacing={2}>
          <Flex
            justifyContent={"start"}
            flexDirection={"row"}
            alignItems={"center"}
            w={"500"}
          >
            <Avatar
              src="/TMA_icon.webp"
              name={episode.title}
              size="lg"
              borderRadius="full"
              mr={8}
            />
            <Text textStyle="6xl" fontWeight={600} w={"full"}>
              MAG {episode.season < 10 ? `0${episode.season}` : episode.season}.
              {episode.number < 10 ? `0${episode.number}` : episode.number}:{" "}
              {episode.title}
            </Text>
            <Flex w={"100%"} justifyContent={"flex-end"}>
              <Checkbox
                isChecked={listOfEpisodesHeard.some(
                  (heardEpisode) => heardEpisode.id === episode.id
                )}
                onChange={() => heardEpisode(episode)}
              />
            </Flex>
          </Flex>
          <Flex marginTop={"12%"}>
            {listOfEpisodesHeard.some(
              (heardEpisode) => heardEpisode.id === episode.id
            ) ? (
              <Text
                mt={4}
                overflow={"hidden"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
              >
                <strong>#{episode.caseNumber}</strong> - {episode.description}
              </Text>
            ) : (
              <Text backgroundColor={"black"} textAlign={"center"} minW={400}>
                [Redacted]
              </Text>
            )}
          </Flex>
        </Stack>
      </Box>
    </Stack>
  );
}

export default EpisodeCard;
