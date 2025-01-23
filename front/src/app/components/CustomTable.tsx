import React, { useEffect, useState } from "react";
import { Character, Episode, TableData } from "../types/types";
import {
  Checkbox,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
const URL_BACK = "http://localhost:3333/api";

const CustomTable: React.FC<TableData> = ({
  data,
  type,
  refreshList,
  searchTerm,
}) => {
  const navigate = useRouter();
  const [sortList, setSortList] = useState<Character[] | Episode[]>(data);
  const [sortOrder, setSortOrder] = useState<boolean>(false);
  const { username } = useAuthStore();
  const [listOfEpisodesHeard, setListOfEpisodesHeard] = useState<Episode[]>([]);

  const handleNavigation = (path: string) => {
    navigate.push(path);
  };

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
      await heardEpisodes();
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

  const handleSortList = (orderBy: string) => {
    if (type === "character") {
      const sortedList = [...(data as Character[])].sort((a, b: any) => {
        if (orderBy === "name") {
          return sortOrder
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });
      setSortList(sortedList);
    } else {
      const sortedList = [...(data as Episode[])].sort((a, b: any) => {
        if (orderBy === "id") {
          return sortOrder ? a.number - b.number : b.number - a.number;
        } else if (orderBy === "title") {
          return sortOrder
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (orderBy === "date") {
          return sortOrder
            ? a.releaseDate.localeCompare(b.releaseDate)
            : b.releaseDate.localeCompare(a.releaseDate);
        } else if (orderBy === "season") {
          return sortOrder ? a.season - b.season : b.season - a.season;
        } else if (orderBy === "caseNumber") {
          return sortOrder
            ? converCaseNumberToDate(a.caseNumber).localeCompare(
                converCaseNumberToDate(b.caseNumber)
              )
            : converCaseNumberToDate(b.caseNumber).localeCompare(
                converCaseNumberToDate(a.caseNumber)
              );
        }
      });
      setSortList(sortedList);
    }
    setSortOrder(!sortOrder);
  };

  useEffect(() => {
    if (searchTerm) {
      const sortedList: any = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.number?.toString().includes(searchTerm.toLowerCase()) ||
          item.characters?.some((characterEntry: any) =>
            characterEntry.character?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSortList(sortedList);
    } else {
      setSortList(data);
    }
  }, [searchTerm]);

  function converCaseNumberToDate(caseNumber: string) {
    const year = caseNumber.slice(0, 3);
    const day = caseNumber.slice(3, 5);
    const month = caseNumber.slice(5);

    const fullYear =
      parseInt(year.slice(0, 1)) === 0
        ? 2000 + parseInt(year)
        : 1000 + parseInt(year);

    const formattedDate = new Date(fullYear, parseInt(month), parseInt(day));
    return formattedDate.toISOString();
  }

  useEffect(() => {
    setSortList(data);
  }, [data]);

  useEffect(() => {
    heardEpisodes();
  }, []);

  return (
    <>
      <TableContainer>
        <Table
          variant="simple"
          color={"whitesmoke"}
          style={{ tableLayout: "fixed" }}
          m={8}
          p={4}
          maxW={"90vw"}
        >
          <Thead>
            <Tr>
              {type === "character" ? (
                <>
                  <Th
                    onClick={() => handleSortList("name")}
                    _hover={{ cursor: "pointer" }}
                    color={"whitesmoke"}
                  >
                    Character Name {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    w={{ base: "30vw", md: "40vw", lg: "52vw", xl: "71vw" }}
                  >
                    Character Description
                  </Th>
                </>
              ) : (
                <>
                  <Th
                    color={"whitesmoke"}
                    onClick={() => handleSortList("id")}
                    _hover={{ cursor: "pointer" }}
                    w={{ base: "3vw", md: "4vw", lg: "5vw", xl: "6vw" }}
                  >
                    Episode id {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    onClick={() => handleSortList("title")}
                    _hover={{ cursor: "pointer" }}
                    w={{ base: "3vw", md: "4vw", lg: "6vw", xl: "8vw" }}
                  >
                    {" "}
                    Episode Title {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    onClick={() => handleSortList("caseNumber")}
                    w={{ base: "5vw", md: "7vw", lg: "7vw", xl: "7vw" }}
                  >
                    {" "}
                    Case Number {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    w={{ base: "21vw", md: "30vw", lg: "35vw", xl: "40vw" }}
                  >
                    {" "}
                    Description{" "}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    onClick={() => handleSortList("date")}
                    w={{ base: "3vw", md: "4vw", lg: "5vw", xl: "6vw" }}
                  >
                    {" "}
                    Release Date {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    onClick={() => handleSortList("season")}
                    w={{ base: "3vw", md: "4vw", lg: "5vw", xl: "6vw" }}
                  >
                    Season {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th
                    color={"whitesmoke"}
                    w={{ base: "3vw", md: "4vw", lg: "5vw", xl: "5vw" }}
                  >
                    {" "}
                    Heard{" "}
                  </Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {type === "character" ? (
              sortList.length === 0 ? (
                <Tr>
                  <Td colSpan={2}>
                    <Text textAlign={"center"} p={4}>
                      No characters found
                    </Text>
                  </Td>
                </Tr>
              ) : (
                (sortList as Character[]).map((character) => (
                  <Tr
                    key={character.id}
                    onClick={() =>
                      handleNavigation(`/character/${character.id}`)
                    }
                    _hover={{
                      cursor: "pointer",
                      bg: "gray.300",
                      opacity: 0.2,
                      color: "black",
                    }}
                  >
                    <Td>{character.name}</Td>
                    <Td>{character.description}</Td>
                  </Tr>
                ))
              )
            ) : sortList?.length === 0 ? (
              <Tr>
                <Td colSpan={7}>
                  <Text textAlign={"center"} p={4}>
                    No episodes found
                  </Text>
                </Td>
              </Tr>
            ) : (
              (sortList as Episode[])?.map((episode) => (
                <Tr
                  key={episode.id}
                  _hover={{
                    cursor: "pointer",
                    bg: "gray.300",
                    opacity: 0.2,
                    color: "black",
                  }}
                >
                  <Td
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                  >
                    M.A.G {episode.number}
                  </Td>
                  <Td
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                  >
                    {episode.title}
                  </Td>
                  <Td
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                  >
                    #{episode.caseNumber}
                  </Td>
                  <Td
                    minW={{
                      base: 100,
                      sm: 200,
                      md: 300,
                      lg: 400,
                      xl: 1000,
                    }}
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                  >
                    {listOfEpisodesHeard.some(
                      (heardEpisode) => heardEpisode.id === episode.id
                    ) ? (
                      episode.description
                    ) : (
                      <Text
                        backgroundColor={"black"}
                        textAlign={"center"}
                        minW={{
                          base: 100,
                          sm: 100,
                          md: 100,
                          lg: 100,
                          xl: 100,
                        }}
                      >
                        [Redacted]
                      </Text>
                    )}
                  </Td>
                  <Td
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                  >
                    {dayjs(episode.releaseDate).format("DD-MM-YYYY")}
                  </Td>
                  <Td
                    onClick={() => handleNavigation(`/episode/${episode.id}`)}
                  >
                    {episode.season}
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={listOfEpisodesHeard.some(
                        (heardEpisode) => heardEpisode.id === episode.id
                      )}
                      onChange={() => heardEpisode(episode)}
                    ></Checkbox>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
