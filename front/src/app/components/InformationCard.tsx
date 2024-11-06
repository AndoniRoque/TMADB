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
        h={"50vh"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          w={"50%"}
          h="50%"
          p={16}
          border={"1px solid gray"}
          borderRadius={8}
          color={"whitesmoke"}
          boxShadow={"2px 0px 10px rgba(0,0,0,0.5)"}
        >
          <Text fontSize="4xl">
            {isInfoEpisode
              ? `MAG ${info.number} - ${info.title}`
              : `Name: ${info.name}`}
          </Text>
          {isInfoEpisode && (
            <>
              <Text textAlign="right">Season: {info.season}</Text>
              <Text textAlign="right">
                Release Date: {dayjs(info.releaseDate).format("DD-MM-YYYY")}
              </Text>
              <Text as="span">Case Number: #{info.caseNumber}</Text>
            </>
          )}
          <Text fontSize="2xl">{info.description}</Text>
        </Box>

        {isInfoEpisode && (
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
              Characters appearences:
            </Text>
            {info.characters != undefined && info.characters.length > 0 && (
              <Box display="flex" justifyContent="center">
                <Grid templateColumns="repeat(3, 1fr)" gap={10} mx="auto">
                  {info.characters?.map((character: Character) => (
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
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default InformationCard;
