"use client";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SlideFade,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EpisodeCard from "../components/EpisodeCard";
import EpisodeModal from "../components/EpisodeModal";
import { Episode } from "../types/types";
import CustomTable from "../components/CustomTable";
import { useAuthStore } from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "../store/useCharacterStore";
const URL_BACK = "http://localhost:3333/api";

export default function EpisodesPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenSearchBar, onToggle } = useDisclosure();
  const { role } = useAuthStore();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(true);

  const {
    characters,
    getCharacters,
    loading: charactersLoading,
  } = useCharacterStore();

  const getEpisodes = async () => {
    try {
      const response = await axios.get(`${URL_BACK}/episodes`, {
        withCredentials: true,
      });
      if (response.data.message) {
        setMessage(response.data.message);
      } else {
        setEpisodes(response.data);
      }
    } catch (err) {
      setMessage("Episodes not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = () => {
    onToggle();
    setShowTable(!showTable);
    setShowSearchBar(!showSearchBar);
  };

  useEffect(() => {
    getEpisodes();
    getCharacters();
  }, []);

  return (
    <>
      <Flex
        justifyContent={"space-between"}
        flexDirection={"row"}
        p={4}
        mt={150}
      >
        <Heading fontSize="4xl" color={"whitesmoke"} flex={1}>
          T.M.A Episodes
        </Heading>
        {role === "ADMIN" && (
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"row"}
          >
            <Button onClick={onOpen} mr={2}>
              Add
            </Button>
          </Flex>
        )}
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
        >
          <Button onClick={toggleTable}>
            {showTable ? "Show Table" : "Show Grid"}
          </Button>
        </Flex>
      </Flex>
      <Flex justifyContent={"end"} mr={4}>
        <SlideFade in={isOpenSearchBar} offsetX="500px" hidden={showSearchBar}>
          <Flex justifyContent={"end"} alignItems={"center"} width={290}>
            <Input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              _focus={{
                backgroundColor: "whitesmoke",
              }}
              maxW={300}
            ></Input>
          </Flex>
        </SlideFade>
      </Flex>
      <Flex justifyContent={"center"} alignItems="center">
        {loading ? (
          <>
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
            <Skeleton ml={16} height="200px" />
          </>
        ) : episodes.length === 0 ? (
          <Flex justifyContent={"center"} alignItems={"center"} h={500}>
            <Text color={"whitesmoke"}>There are no episodes loaded yet.</Text>
          </Flex>
        ) : (
          <>
            {showTable ? (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                  lg: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gap={{ base: 2, md: 4, lg: 6, xl: 8 }}
                m={{ base: 2, md: 4, lg: 6, xl: 8 }}
              >
                {episodes.map((e: Episode) => (
                  <GridItem
                    key={e.id}
                    minW={{ base: 300, md: 500, lg: 500, xl: 500 }}
                  >
                    <LinkBox>
                      <LinkOverlay href={`/episode/${e.number}`}>
                        <EpisodeCard
                          episode={e}
                          refreshEpisodes={getEpisodes}
                        />
                      </LinkOverlay>
                    </LinkBox>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <CustomTable
                data={episodes}
                type="episode"
                refreshList={getEpisodes}
                searchTerm={search}
              />
            )}
          </>
        )}
      </Flex>

      <EpisodeModal
        isOpen={isOpen}
        onClose={onClose}
        initialValue={null}
        getEpisode={getEpisodes}
      />
    </>
  );
}
