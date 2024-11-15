import React, { useEffect, useState } from "react";
import { Character, CharacterOrEpisode, Episode } from "../types/types";
import {
  Checkbox,
  LinkBox,
  LinkOverlay,
  Table,
  TableCaption,
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
const URL_BACK = "http://localhost:3333/api";

type TableData = {
  data: Character[] | Episode[];
  type: "character" | "episode";
  refreshList: () => void;
};

const CustomTable: React.FC<TableData> = ({ data, type, refreshList }) => {
  const navigate = useRouter();
  const [sortList, setSortList] = useState<Character[] | Episode[]>(data);
  const [sortOrder, setSortOrder] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    navigate.push(path);
  };

  const heardEpisode = async (episode: Episode) => {
    try {
      await axios.put(`${URL_BACK}/episodes/${episode.id}`, {
        heard: !episode.heard,
      });
      refreshList();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSortList = () => {
    if (type === "character") {
      const sortedList = [...(data as Character[])].sort((a, b) =>
        sortOrder ? a.id - b.id : b.id - a.id
      );
      setSortList(sortedList);
    } else {
      const sortedList = [...(data as Episode[])].sort((a, b) =>
        sortOrder ? a.id - b.id : b.id - a.id
      );
      setSortList(sortedList);
    }
    setSortOrder(!sortOrder);
  };

  useEffect(() => {
    setSortList(data);
  }, [data]);

  return (
    <>
      <TableContainer>
        <Table variant="simple" color={"whitesmoke"}>
          <Thead>
            <Tr>
              {type === "character" ? (
                <>
                  <Th isNumeric color={"whitesmoke"} onClick={handleSortList}>
                    Character id {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th color={"whitesmoke"}>Character Name</Th>
                  <Th color={"whitesmoke"}>Character Description</Th>
                </>
              ) : (
                <>
                  <Th isNumeric color={"whitesmoke"} onClick={handleSortList}>
                    Episode id {sortOrder ? "▲" : "▼"}
                  </Th>
                  <Th color={"whitesmoke"}> Episode Title </Th>
                  <Th color={"whitesmoke"}> Case Number </Th>
                  <Th color={"whitesmoke"}> Description </Th>
                  <Th color={"whitesmoke"}> Release Date </Th>
                  <Th isNumeric color={"whitesmoke"}>
                    {" "}
                    Season{" "}
                  </Th>
                  <Th color={"whitesmoke"}> Heard </Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {type === "character"
              ? (sortList as Character[]).map((character) => (
                  <>
                    <Tr
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
                      <Td>{character.id}</Td>
                      <Td>{character.name}</Td>
                      <Td>{character.description}</Td>
                    </Tr>
                  </>
                ))
              : (sortList as Episode[]).map((episode) => (
                  <>
                    <Tr
                      _hover={{
                        cursor: "pointer",
                        bg: "gray.300",
                        opacity: 0.2,
                        color: "black",
                      }}
                    >
                      <Td
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        M.A.G {episode.number}
                      </Td>
                      <Td
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        {episode.title}
                      </Td>
                      <Td
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        {episode.caseNumber}
                      </Td>
                      <Td
                        minW={"50vw"}
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        {episode.heard ? (
                          episode.description
                        ) : (
                          <Text backgroundColor={"black"} textAlign={"center"}>
                            [Redacted]
                          </Text>
                        )}
                      </Td>
                      <Td
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        {dayjs(episode.releaseDate).format("DD-MM-YYYY")}
                      </Td>
                      <Td
                        onClick={() =>
                          handleNavigation(`/episode/${episode.id}`)
                        }
                      >
                        {episode.season}
                      </Td>
                      <Td>
                        <Checkbox
                          isChecked={episode.heard}
                          onChange={(e) => {
                            e.preventDefault();
                            heardEpisode(episode);
                          }}
                        ></Checkbox>
                      </Td>
                    </Tr>
                  </>
                ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomTable;
