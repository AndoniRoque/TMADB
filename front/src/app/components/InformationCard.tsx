import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import CharacterCard from "./CharacterCard";
import dayjs from "dayjs";
import { Character, Episode } from "../types/types";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
const URL_BACK = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:3333/api";

type Props = Character | Episode;

const InformationCard: React.FC<Props> = (info) => {
  const isEpisode = (info: Props): info is Episode => "title" in info;
  const { username } = useAuthStore();
  const [listOfEpisodesHeard, setListOfEpisodesHeard] = useState<Episode[]>([]);

  const matchedEpisode = listOfEpisodesHeard?.find(
    (heardEpisode) => heardEpisode.id === info.id
  );

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
  }, [username, info]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      h={"auto"}
      mt={40}
    >
      <Flex
        flexDirection={"column"}
        w={"50%"}
        h="50%"
        p={16}
        border={"1px solid gray"}
        borderRadius={8}
        color={"whitesmoke"}
        boxShadow={"2px 0px 10px rgba(0,0,0,0.5)"}
        mb={16}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <Text fontSize="4xl" textAlign={"left"}>
            {isEpisode(info)
              ? `MAG ${info.number} - ${info.title}`
              : `Name: ${info.name}`}
          </Text>
          {matchedEpisode && (
            <Image
              src={`/${matchedEpisode.entity.toLowerCase()}.png`}
              alt={`${matchedEpisode.entity.toLowerCase()}`}
              ml={2}
              w={10}
            />
          )}
        </Flex>
        {isEpisode(info) && (
          <Flex flexDirection={"column"} alignItems={"start"} w={"43%"}>
            <Text textAlign="right">Season: {info.season}</Text>
            <Text textAlign="right">
              Release Date: {dayjs(info.releaseDate).format("DD-MM-YYYY")}
            </Text>
            <Text as="span">Case Number: #{info.caseNumber}</Text>
          </Flex>
        )}
        {isEpisode(info) ? (
          listOfEpisodesHeard?.some(
            (heardEpisode) => heardEpisode.id === info.id
          ) ? (
            <>
              <Text
                fontSize="2xl"
                mt={8}
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                {info.description}
              </Text>
            </>
          ) : (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              minH={20}
            >
              <Text bg={"black"} fontSize={"xl"} textAlign={"center"}>
                [Redacted]
              </Text>
            </Box>
          )
        ) : (
          <Text fontSize="2xl" whiteSpace="pre-wrap" wordBreak="break-word">
            {info.description}
          </Text>
        )}
      </Flex>

      <Box>
        {isEpisode(info) && info.characters?.length > 0 && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Text
              fontSize={"2xl"}
              color={"whitesmoke"}
              mb={5}
              textAlign={"center"}
            >
              Characters appearances:
            </Text>
            <Box display="flex" justifyContent="center">
              <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
                {info.characters.map((character: Character) => (
                  <GridItem key={character.character.id} w={500}>
                    <LinkBox key={character.character.id}>
                      <LinkOverlay
                        key={character.character.id}
                        href={`/character/${character.character.id}`}
                      >
                        <CharacterCard
                          key={character.character.id}
                          character={character.character}
                        />
                      </LinkOverlay>
                    </LinkBox>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default InformationCard;
