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
import React from "react";
import { Episode, EpisodeCardProps } from "../types/types";
const URL_BACK = "http://localhost:3333/api";

function EpisodeCard({ episode, refreshEpisodes }: EpisodeCardProps) {
  const heardEpisode = async (episode: Episode) => {
    try {
      const { data } = await axios.put(
        `${URL_BACK}/episodes/${episode.id}`,
        {
          heard: !episode.heard,
        },
        {
          withCredentials: true,
        }
      );
      refreshEpisodes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

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
                isChecked={episode.heard}
                onChange={() => heardEpisode(episode)}
              />
            </Flex>
          </Flex>
          <Text
            mt={4}
            overflow={"hidden"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            marginTop={"12%"}
          >
            {episode.heard ? (
              <>
                <strong>#{episode.caseNumber}</strong> - {episode.description}
              </>
            ) : (
              <Text backgroundColor={"black"} textAlign={"center"}>
                [Redacted]
              </Text>
            )}
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
}

export default EpisodeCard;
