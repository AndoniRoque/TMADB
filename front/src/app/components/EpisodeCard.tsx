import { Avatar, Box, Button, Checkbox, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { Episode, EpisodeCardProps } from "../types/types";
const URL_BACK = "http://localhost:3333/api";

function EpisodeCard({ episode, refreshEpisodes }: EpisodeCardProps) {
  const heardEpisode = async (episode: Episode) => {
    try {
      const { data } = await axios.put(`${URL_BACK}/episodes/${episode.id}`, {
        heard: !episode.heard,
      });
      refreshEpisodes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <Stack
      gap="14"
      direction="row"
      wrap="wrap"
      minH={"200px"}
      h={"300px"}
      w={"100%"}
    >
      <Box
        p={16}
        border={"1px solid gray"}
        borderRadius={8}
        color={"white"}
        fontWeight={400}
        w={"100%"}
        _hover={{
          transform: "scale(1.01)",
          transition: "transform 0.2s",
          boxShadow: "2px 0px 10px rgba(0,0,0,0.5)",
        }}
      >
        <Stack spacing={2}>
          <Box
            display={"flex"}
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
            <Box display={"flex"} w={"100%"} justifyContent={"flex-end"}>
              <Checkbox
                isChecked={episode.heard}
                onChange={() => heardEpisode(episode)}
              />
            </Box>
          </Box>
          <Text mt={4}>
            {episode.heard ? (
              <>
                <strong>#{episode.caseNumber}</strong> - {episode.description}
              </>
            ) : (
              <>
                <Text backgroundColor={"black"} textAlign={"center"}>
                  [Redacted]
                </Text>
              </>
            )}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

export default EpisodeCard;
