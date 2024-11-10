import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import CharacterCard from "./CharacterCard";
import dayjs from "dayjs";
import { Character, Episode } from "../types/types";

type Props = Character | Episode;

const InformationCard: React.FC<Props> = (info) => {
  const [isInfoEpisode, setIsInfoEpisode] = useState<boolean>(true);
  useEffect(() => {
    if ("name" in info) {
      setIsInfoEpisode(false);
    }
  }, [info]);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        h={"auto"}
        mt={"8%"}
      >
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center"
          w={"50%"}
          h="50%"
          p={16}
          border={"1px solid gray"}
          borderRadius={8}
          color={"whitesmoke"}
          boxShadow={"2px 0px 10px rgba(0,0,0,0.5)"}
          mb={"8%"}
        >
          <Text fontSize="4xl">
            {isInfoEpisode
              ? // @ts-ignore
                `MAG ${info.number} - ${info.title}`
              : // @ts-ignore
                `Name: ${info.name}`}
          </Text>
          {isInfoEpisode && (
            <>
              {/* @ts-ignore  */}
              <Text textAlign="right">Season: {info.season}</Text>
              <Text textAlign="right">
                {/* @ts-ignore  */}
                Release Date: {dayjs(info.releaseDate).format("DD-MM-YYYY")}
              </Text>
              {/* @ts-ignore  */}
              <Text as="span">Case Number: #{info.caseNumber}</Text>
            </>
          )}
          <Text fontSize="2xl">{info.description}</Text>
        </Box>

        <Box>
          {isInfoEpisode && info.characters.length > 0 && (
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
              <Text fontSize={"2xl"} color={"whitesmoke"} mb={5} textAlign={"center"}>
                Characters appearances:
              </Text>
              <Box display="flex" justifyContent="center">
                <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
                  {info.characters.map((character: Character) => (
                    <GridItem key={character.id} w={500}>
                      <LinkBox>
                        <LinkOverlay href={`/character/${character.id}`}>
                          <CharacterCard character={character} />
                        </LinkOverlay>
                      </LinkBox>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default InformationCard;
